import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const IngresarPedido = () => {
    const [productos, setProductos] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [coincidencias, setCoincidencias] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidadAgregar, setCantidadAgregar] = useState(1);
    
    // Toggle para cambiar entre la vista de buscador y la tabla de faltantes
    const [verFaltantes, setVerFaltantes] = useState(false);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = () => {
        axios.get("http://localhost:8080/api/productos")
            .then((resp) => setProductos(resp.data))
            .catch((err) => console.log(err));
    };

    const manejarBusqueda = (e) => {
        const termino = e.target.value;
        setTextoBusqueda(termino);
        setProductoSeleccionado(null);

        if (termino.length > 0) {
            const filtrados = productos.filter(p => 
                p.nombre.toLowerCase().includes(termino.toLowerCase()) || 
                p.rubro.toLowerCase().includes(termino.toLowerCase())
            );
            setCoincidencias(filtrados);
        } else {
            setCoincidencias([]);
        }
    };

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setTextoBusqueda(producto.nombre);
        setCoincidencias([]);
        setCantidadAgregar(1);
    };

    const guardarIngreso = (e) => {
        e.preventDefault();

        if (!productoSeleccionado) {
            Swal.fire({ title: 'Atención', text: 'Debe seleccionar un producto.', icon: 'warning', background: '#1f1f1f', color: '#fff' });
            return;
        }

        if (cantidadAgregar <= 0) {
            Swal.fire({ title: 'Error', text: 'La cantidad a ingresar debe ser mayor a 0.', icon: 'error', background: '#1f1f1f', color: '#fff' });
            return;
        }

        // Calculamos el nuevo stock sumando lo que había + lo nuevo
        const nuevoStock = productoSeleccionado.stockActual + parseInt(cantidadAgregar);
        const productoActualizado = { ...productoSeleccionado, stockActual: nuevoStock };

        axios.put(`http://localhost:8080/api/productos/${productoSeleccionado.id}`, productoActualizado)
            .then(() => {
                Swal.fire({ 
                    title: 'Stock Actualizado', 
                    text: `Se agregaron ${cantidadAgregar} unidades a ${productoSeleccionado.nombre}. Nuevo stock: ${nuevoStock}`, 
                    icon: 'success', 
                    background: '#1f1f1f', color: '#fff' 
                });
                setProductoSeleccionado(null);
                setTextoBusqueda("");
                setCantidadAgregar(1);
                cargarProductos(); 
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({ title: 'Error', text: 'No se pudo actualizar el stock.', icon: 'error', background: '#1f1f1f', color: '#fff' });
            });
    };

    // Lógica mágica para el reporte: Filtramos solo los que tienen stockActual menor al puntoReposicion
    const productosFaltantes = productos.filter(p => p.stockActual < p.puntoReposicion);

    return (
        <div className="card bg-secondary text-white shadow-lg p-4 mb-5 rounded">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h3 className="m-0">🚚 Ingreso de Pedidos</h3>
                <button 
                    className={`btn ${verFaltantes ? 'btn-danger' : 'btn-danger'} fw-bold`}
                    onClick={() => setVerFaltantes(!verFaltantes)}
                >
                    {verFaltantes ? '🔙 Volver al Buscador' : '⚠️ Ver Faltantes'}
                </button>
            </div>

            {/* --- ZONA 1: INGRESO RÁPIDO --- */}
            {!verFaltantes ? (
                <form onSubmit={guardarIngreso} className="row g-3 align-items-end mb-4 p-3 bg-dark bg-opacity-25 rounded" style={{position: 'relative'}}>
                    <div className="col-md-6 position-relative">
                        <label className="form-label">Buscar Producto a Reponer</label>
                        <input 
                            type="text" 
                            className={`form-control ${productoSeleccionado ? 'is-valid' : ''}`} 
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
                                    >
                                        <div className="d-flex justify-content-between">
                                            <strong>{p.nombre}</strong>
                                            <span className={`badge ${p.stockActual < p.puntoReposicion ? 'bg-danger' : 'bg-success'}`}>
                                                Stock: {p.stockActual} (Mín: {p.puntoReposicion})
                                            </span>
                                        </div>
                                        <small className="text-muted">Cód: {p.rubro}</small>
                                    </button>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Cantidad Recibida</label>
                        <input 
                            type="number" className="form-control border-info" min="1" 
                            value={cantidadAgregar} onChange={(e) => setCantidadAgregar(e.target.value)} 
                            disabled={!productoSeleccionado}
                        />
                    </div>
                    
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-info w-100 fw-bold" disabled={!productoSeleccionado}>
                            ➕ Sumar Stock
                        </button>
                    </div>
                </form>
            ) : (
                /* --- ZONA 2: REPORTE DE FALTANTES --- */
                <div className="mt-3">
                    <h5 className="text-warning mb-3">🚨 Listado de productos con stock crítico</h5>
                    {productosFaltantes.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-dark table-striped table-hover align-middle">
                                <thead className="table-danger">
                                    <tr>
                                        <th className="text-dark">Código</th>
                                        <th className="text-dark">Producto</th>
                                        <th className="text-center text-dark">Stock Actual</th>
                                        <th className="text-center text-dark">Mínimo Requerido</th>
                                        <th className="text-center text-dark">Faltan</th>
                                        <th className="text-center text-dark">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosFaltantes.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.rubro}</td>
                                            <td>{p.nombre}</td>
                                            <td className="text-center text-danger fw-bold">{p.stockActual}</td>
                                            <td className="text-center">{p.puntoReposicion}</td>
                                            <td className="text-center text-warning fw-bold">
                                                {/* Cuánto falta exactamente para llegar al mínimo */}
                                                {p.puntoReposicion - p.stockActual}
                                            </td>
                                            <td className="text-center">
                                                <button 
                                                    className="btn btn-sm btn-outline-info"
                                                    onClick={() => {
                                                        // Si toca acá, lo devolvemos al buscador con el producto ya cargado
                                                        setVerFaltantes(false);
                                                        seleccionarProducto(p);
                                                    }}
                                                >
                                                    Reponer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-success text-center">
                            ¡El stock está perfecto! No hay ningún producto por debajo del mínimo. 🎉
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default IngresarPedido;