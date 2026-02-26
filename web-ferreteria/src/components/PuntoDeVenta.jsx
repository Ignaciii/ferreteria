import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PuntoDeVenta = () => {
    // 1. STOCK
    const [productos, setProductos] = useState([]);
    
    // 2. CARRITO
    const [carrito, setCarrito] = useState([]);

    // 3. ESTADOS
    const [idSeleccionado, setIdSeleccionado] = useState(""); 
    const [textoBusqueda, setTextoBusqueda] = useState("");   
    const [coincidencias, setCoincidencias] = useState([]);   
    const [cantidad, setCantidad] = useState(1);
    
    // --- ESTADOS PARA LA PLATA ---
    const [subtotal, setSubtotal] = useState(0); 
    const [descuento, setDescuento] = useState(0); // VALIDADO
    const [totalVenta, setTotalVenta] = useState(0); 

    useEffect(() => {
        cargarProductos();
    }, []);

    // CADA VEZ QUE CAMBIA EL CARRITO O EL DESCUENTO, RECALCULAMOS TODO
    useEffect(() => {
        const sumaBruta = carrito.reduce((acumulador, item) => {
            return acumulador + (item.precioPublico * item.cantidad);
        }, 0);

        setSubtotal(sumaBruta);

        // FIX MATEMÁTICO: Si descuento es "" o null, usamos 0
        const porcentajeSeguro = descuento || 0; 
        const montoDescuento = sumaBruta * (porcentajeSeguro / 100);
        const totalFinal = sumaBruta - montoDescuento;

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
                p.codigo.toLowerCase().includes(termino.toLowerCase())
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

        if (!idSeleccionado) {
            Swal.fire({ title: 'Atención', text: 'Debe seleccionar un producto de la lista.', icon: 'warning', background: '#1f1f1f', color: '#fff' });
            return;
        }

        const productoOriginal = productos.find(p => p.id === parseInt(idSeleccionado));
        
        const enCarrito = carrito.find(item => item.id === productoOriginal.id);
        const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;

        if ((parseInt(cantidad) + cantidadEnCarrito) > productoOriginal.stockActual) {
            Swal.fire({ 
                title: 'Stock Insuficiente', 
                text: `Solo tenés ${productoOriginal.stockActual} unidades disponibles.`, 
                icon: 'error', 
                background: '#1f1f1f', color: '#fff' 
            });
            return;
        }

        if (enCarrito) {
            const carritoActualizado = carrito.map(item => 
                item.id === productoOriginal.id 
                ? { ...item, cantidad: item.cantidad + parseInt(cantidad) }
                : item
            );
            setCarrito(carritoActualizado);
        } else {
            const nuevoItem = { ...productoOriginal, cantidad: parseInt(cantidad) };
            setCarrito([...carrito, nuevoItem]);
        }

        setTextoBusqueda("");
        setIdSeleccionado("");
        setCantidad(1);
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    // --- FIX INPUT: Función para validar lo que escribe el usuario ---
    const cambiarDescuento = (e) => {
        let valor = e.target.value;

        // Si borra todo, dejamos string vacío para que no sea molesto
        if (valor === "") {
            setDescuento("");
            return;
        }

        // Convertimos a número y validamos rangos
        let numero = parseFloat(valor);

        if (numero < 0) numero = 0;    // No negativos
        if (numero > 100) numero = 100; // No más del 100%

        setDescuento(numero);
    }
    // -------------------------------------------------------------

    const finalizarVenta = () => {
        if (carrito.length === 0) return;

        Swal.fire({
            title: `Confirmar Venta`,
            html: `
                <div style="text-align: right;">
                    <p>Subtotal: <b>$${subtotal.toFixed(2)}</b></p>
                    <p style="color: #ffc107;">Descuento (${descuento || 0}%): <b>-$${(subtotal * ((descuento || 0)/100)).toFixed(2)}</b></p>
                    <hr style="border-color: white;">
                    <h2 style="color: #28a745;">Total: $${totalVenta.toFixed(2)}</h2>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '💰 Cobrar',
            cancelButtonText: 'Cancelar',
            background: '#1f1f1f', color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.forEach(item => {
                    const stockNuevo = item.stockActual - item.cantidad;
                    axios.put(`http://localhost:8080/api/productos/${item.id}`, { ...item, stockActual: stockNuevo });
                });

                Swal.fire({ title: '¡Venta Registrada!', icon: 'success', background: '#1f1f1f', color: '#fff' });
                setCarrito([]);
                setDescuento(0); 
                cargarProductos(); 
            }
        });
    };

    return (
        <div className="card bg-secondary text-white shadow-lg p-4 mb-5 rounded">
            <h3 className="mb-4 text-center border-bottom pb-2">🛒 Nueva Venta</h3>

            <form onSubmit={agregarAlCarrito} className="row g-3 align-items-end mb-4 p-3 bg-dark bg-opacity-25 rounded" style={{position: 'relative'}}>
                
                {/* --- BUSCADOR --- */}
                <div className="col-md-6 position-relative">
                    <label className="form-label">Buscar Producto</label>
                    <input 
                        type="text" 
                        className={`form-control ${idSeleccionado ? 'is-valid' : ''}`} 
                        placeholder="Escribí nombre o código..." 
                        value={textoBusqueda}
                        onChange={manejarBusqueda}
                    />
                    
                    {coincidencias.length > 0 && (
                        <ul className="list-group position-absolute w-100 shadow-lg" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                            {coincidencias.map(p => (
                                <button 
                                    key={p.id} 
                                    type="button"
                                    className="list-group-item list-group-item-action bg-dark text-white border-secondary"
                                    onClick={() => seleccionarProducto(p)}
                                    disabled={p.stockActual <= 0}
                                >
                                    <div className="d-flex justify-content-between">
                                        <strong>{p.nombre}</strong>
                                        <span className={`badge ${p.stockActual > 0 ? 'bg-success' : 'bg-danger'}`}>
                                            Stock: {p.stockActual}
                                        </span>
                                    </div>
                                    <small className="text-muted">Cód: {p.codigo} - Precio: ${p.precioPublico}</small>
                                </button>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="col-md-3">
                    <label className="form-label">Cantidad</label>
                    <input 
                        type="number" className="form-control" min="1" 
                        value={cantidad} onChange={(e) => setCantidad(e.target.value)} 
                    />
                </div>
                
                <div className="col-md-3">
                    <button type="submit" className="btn btn-primary w-100" disabled={!idSeleccionado}>
                        ⬇️ Agregar
                    </button>
                </div>
            </form>

            {/* --- TABLA --- */}
            {carrito.length > 0 ? (
                <>
                    <div className="table-responsive">
                        <table className="table table-dark table-striped table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th className="text-center">Cant.</th>
                                    <th className="text-end">Unitario</th>
                                    <th className="text-end">Subtotal</th>
                                    <th className="text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.nombre}</td>
                                        <td className="text-center">{item.cantidad}</td>
                                        <td className="text-end">${item.precioPublico}</td>
                                        <td className="text-end fw-bold">${(item.precioPublico * item.cantidad).toFixed(2)}</td>
                                        <td className="text-center">
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarDelCarrito(item.id)}>❌</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- TOTALES --- */}
                    <div className="mt-4 p-3 bg-dark rounded border border-secondary">
                        <div className="row align-items-center">
                            
                            <div className="col-md-4 text-end">
                                <h5 className="text-muted m-0">Subtotal: ${subtotal.toFixed(2)}</h5>
                            </div>

                            <div className="col-md-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-warning text-dark fw-bold">Descuento</span>
                                    
                                    {/* ACÁ USAMOS LA NUEVA FUNCIÓN 'cambiarDescuento' */}
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                        value={descuento}
                                        onChange={cambiarDescuento} 
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
                </>
            ) : (
                <div className="text-center p-4 opacity-50">
                    <h5>El carrito está vacío.</h5>
                </div>
            )}
        </div>
    );
};

export default PuntoDeVenta;