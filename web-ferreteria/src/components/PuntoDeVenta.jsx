import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PuntoDeVenta = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [idSeleccionado, setIdSeleccionado] = useState(""); 
    const [textoBusqueda, setTextoBusqueda] = useState("");   
    const [coincidencias, setCoincidencias] = useState([]);   
    const [cantidad, setCantidad] = useState(1);
    const [subtotal, setSubtotal] = useState(0); 
    const [descuento, setDescuento] = useState(0); 
    const [totalVenta, setTotalVenta] = useState(0); 

    useEffect(() => {
        cargarProductos();
    }, []);

    useEffect(() => {
        const sumaBruta = carrito.reduce((acc, item) => acc + (item.precioPublico * item.cantidad), 0);
        setSubtotal(sumaBruta);
        const totalFinal = sumaBruta - (sumaBruta * ((descuento || 0) / 100));
        setTotalVenta(totalFinal);
    }, [carrito, descuento]); 

    const cargarProductos = () => {
        axios.get("http://localhost:8080/api/productos")
            .then((resp) => setProductos(resp.data))
            .catch((err) => console.log(err));
    };

    const manejarBusqueda = (e) => {
        const termino = e.target.value;
        setTextoBusqueda(termino);
        setIdSeleccionado(""); 

        if (termino.length > 0) {
            const filtrados = productos.filter(p => 
                p.nombre.toLowerCase().includes(termino.toLowerCase()) || 
                p.rubro.toLowerCase().includes(termino.toLowerCase())
            );
            setCoincidencias(filtrados);
        } else {
            setCoincidencias([]);
        }
    }

    const seleccionarProducto = (producto) => {
        setTextoBusqueda(producto.nombre); 
        setIdSeleccionado(producto.id);    
        setCoincidencias([]);              
    }

    const agregarAlCarrito = (e) => {
        e.preventDefault();
        if (!idSeleccionado) return;

        const prod = productos.find(p => p.id === parseInt(idSeleccionado));
        const enCarrito = carrito.find(item => item.id === prod.id);
        const cantFinal = (enCarrito ? enCarrito.cantidad : 0) + parseInt(cantidad);

        if (cantFinal > prod.stockActual) {
            Swal.fire({ title: 'Stock Insuficiente', text: `Solo hay ${prod.stockActual} disponibles.`, icon: 'error', background: '#1f1f1f', color: '#fff' });
            return;
        }

        if (enCarrito) {
            setCarrito(carrito.map(item => item.id === prod.id ? { ...item, cantidad: cantFinal } : item));
        } else {
            setCarrito([...carrito, { ...prod, cantidad: parseInt(cantidad) }]);
        }
        setTextoBusqueda(""); setIdSeleccionado(""); setCantidad(1);
    };

    const eliminarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id !== id));

    const finalizarVenta = () => {
        if (carrito.length === 0) return;
        
        // Calculamos la plata exacta del descuento para mostrarla
        const montoDescuento = subtotal * ((descuento || 0) / 100);

        Swal.fire({
            title: `Confirmar Venta`,
            html: `
                <div style="text-align: right;">
                    <p>Subtotal: <b>$${subtotal.toFixed(2)}</b></p>
                    <p style="color: #ffc107;">Descuento (${descuento || 0}%): <b>-$${montoDescuento.toFixed(2)}</b></p>
                    <hr style="border-color: white;">
                    <h2 style="color: #28a745;">Total a Cobrar: $${totalVenta.toFixed(2)}</h2>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '💰 Cobrar',
            background: '#1f1f1f', color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevaVenta = {
                    subtotalBruto: subtotal,
                    descuentoPorcentaje: descuento || 0,
                    totalNeto: totalVenta,
                    detalles: carrito.map(item => ({
                        producto: { id: item.id },
                        cantidad: item.cantidad,
                        precioUnitario: item.precioPublico,
                        subtotal: item.precioPublico * item.cantidad
                    }))
                };

                axios.post("http://localhost:8080/api/ventas", nuevaVenta)
                    .then(() => {
                        carrito.forEach(item => {
                            axios.put(`http://localhost:8080/api/productos/${item.id}`, { ...item, stockActual: item.stockActual - item.cantidad });
                        });
                        Swal.fire({ title: 'Venta Registrada', icon: 'success', background: '#1f1f1f', color: '#fff' });
                        setCarrito([]); setDescuento(0); cargarProductos(); 
                    });
            }
        });
    };

    return (
        <div className="card bg-secondary text-white shadow-lg p-4 mb-5 rounded">
            <h3 className="mb-4 text-center border-bottom pb-2">🛒 Nueva Venta</h3>
            <form onSubmit={agregarAlCarrito} className="row g-3 align-items-end mb-4 p-3 bg-dark bg-opacity-25 rounded" style={{position: 'relative'}}>
                <div className="col-md-6 position-relative">
                    <label className="form-label">Buscar Producto (Nombre o Rubro)</label>
                    <input type="text" className="form-control" value={textoBusqueda} onChange={manejarBusqueda} placeholder="Ej: Tornillos..." />
                    {coincidencias.length > 0 && (
                        <ul className="list-group position-absolute w-100 shadow-lg" style={{zIndex: 1000}}>
                            {coincidencias.map(p => (
                                <button key={p.id} type="button" className="list-group-item list-group-item-action bg-dark text-white" onClick={() => seleccionarProducto(p)}>
                                    <div className="d-flex justify-content-between">
                                        <strong>{p.nombre}</strong>
                                        <span className="badge bg-success">Stock: {p.stockActual}</span>
                                    </div>
                                    <small className="text-muted">Rubro: {p.rubro} - ${p.precioPublico}</small>
                                </button>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="col-md-3">
                    <label className="form-label">Cantidad</label>
                    <input type="number" className="form-control" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <button type="submit" className="btn btn-primary w-100" disabled={!idSeleccionado}>⬇️ Agregar</button>
                </div>
            </form>

            {carrito.length > 0 && (
                <div className="mt-3">
                    <table className="table table-dark">
                        <thead><tr><th>Producto</th><th>Cant.</th><th>Total</th><th>Acción</th></tr></thead>
                        <tbody>
                            {carrito.map(item => (
                                <tr key={item.id}>
                                    <td>{item.nombre}</td>
                                    <td>{item.cantidad}</td>
                                    <td>${(item.precioPublico * item.cantidad).toFixed(2)}</td>
                                    <td><button className="btn btn-sm btn-danger" onClick={() => eliminarDelCarrito(item.id)}>❌</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className="mt-4 p-3 bg-dark rounded border border-secondary">
                        <div className="row align-items-center">
                            <div className="col-md-4 text-end">
                                <h5 className="text-muted m-0">Subtotal: ${subtotal.toFixed(2)}</h5>
                            </div>
                            <div className="col-md-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-warning text-dark fw-bold">Descuento</span>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="0" min="0" max="100"
                                        value={descuento}
                                        onChange={(e) => setDescuento(e.target.value === "" ? "" : parseFloat(e.target.value) || 0)} 
                                    />
                                    <span className="input-group-text">%</span>
                                </div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-end align-items-center gap-3">
                                <h2 className="m-0 text-success fw-bold">Total: ${totalVenta.toFixed(2)}</h2>
                                <button className="btn btn-success btn-lg shadow" onClick={finalizarVenta}>Cobrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PuntoDeVenta;