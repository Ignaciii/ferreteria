import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";

const TablaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1)
    const [cargando, setCargando] = useState(true)
    const [busqueda, setBusqueda] = useState("")

    useEffect(() => {
        cargarProductos();
    }, [])

    const cargarProductos = () => {
        axios.get("http://localhost:8080/api/productos").then((respuesta) => {
            setProductos(respuesta.data)
            setCargando(false)
        }).catch((error) => { console.log("Error ocurrido: ", error) })
    }

    const eliminarProducto = (id) => {
        //if (window.confirm("Estas apunto de borrar un producto, ¿estas seguro?"))
            axios.delete("http://localhost:8080/api/productos/" + id).then(() => (cargarProductos())).catch((error) => { console.log("Error al borrar: ", error) })
    }

    const manejarBusqueda = (elemento) => {
        setBusqueda(elemento.target.value)
        setPaginaActual(1)
    }

    const productosFiltrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const elementosPorPagina = 10;
    const indiceFinal = paginaActual * elementosPorPagina;
    const indiceInicial = indiceFinal - elementosPorPagina;
    const productosPorPagina = productosFiltrados.slice(indiceInicial, indiceFinal)
    const paginasTotales = Math.ceil(productosFiltrados.length / elementosPorPagina) // Corregido: usar productosFiltrados

    return (
        // Envolvemos todo en una caja gris (card) para que contraste con el fondo negro
        <div className="card bg-secondary text-white shadow-lg p-4">
            
            <h2 className="text-center mb-4">📦 Inventario de la Ferretería 📦</h2>
            
            {/* Buscador */}
            <div className="d-flex justify-content-center mb-4">
                <input
                    type="text"
                    className="form-control shadow-sm"
                    style={{ maxWidth: '500px' }}
                    placeholder="🔍 Buscar por nombre o código..."
                    value={busqueda}
                    onChange={manejarBusqueda}
                />
            </div>

            {/* Mensajes de carga o vacio */}
            {productos.length === 0 && !cargando ? (
                <div className="text-center">
                    <h3 className="display-6">No hay productos cargados aun</h3>
                </div>
            ) : cargando ? (
                <div className="text-center">
                    <p className="display-6">Esperando productos...</p>
                </div>
            ) : (
                /* TABLA */
                <>
                <div className="table-responsive">
                    <table className="table table-dark table-hover table-bordered align-middle">
                        <thead className="table-secondary text-center">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Codigo</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Unidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {productosPorPagina.map((p) => (
                                <tr key={p.id} >
                                    <td>{p.id}</td>
                                    <td>{p.nombre}</td>
                                    <td>{p.codigo}</td>
                                    <td>${p.precioPublico}</td>
                                    <td>{p.stockActual}</td>
                                    <td>{p.unidadMedida}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarProducto(p.id)}> 
                                                🗑️
                                            </button>
                                            <button className="btn btn-outline-primary btn-sm">
                                                ✏️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACION */}
                {paginasTotales > 0 && (
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <button className="btn btn-dark border-light me-2" onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>
                            ⬅️ Anterior
                        </button>
                        <span className="fw-bold mx-2"> {paginaActual} de {paginasTotales} </span>
                        <button className="btn btn-dark border-light ms-2" onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual >= paginasTotales}>
                            Siguiente ➡️
                        </button>
                    </div>
                )}
                </>
            )}
        </div>
    )
}

export default TablaProductos;