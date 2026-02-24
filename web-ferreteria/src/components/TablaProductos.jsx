import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";


const TablaProductos = () =>{
    const [productos, setProductos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1)
    const [cargando, setCargando] = useState(true)
    const [busqueda,setBusqueda] = useState("")


    useEffect(() => {
        cargarProductos();

    }, []
    )

    const cargarProductos = () => {
        axios.get("http://localhost:8080/api/productos").then((respuesta) => 
            {setProductos(respuesta.data) 
            setCargando(false)}).catch((error) => {console.log("Error ocurrido: ",error)})

    }

    const eliminarProducto = (id) => {
        if(window.confirm("Estas apunto de borrar un producto, ¿estas seguro?"))
        axios.delete("http://localhost:8080/api/productos/"+id).then(() => (cargarProductos())).catch((error) => {console.log("Error al borrar: ",error)})
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
    const indiceFinal =   paginaActual * elementosPorPagina;
    const indiceInicial = indiceFinal - elementosPorPagina ;
    const productosPorPagina = productosFiltrados.slice(indiceInicial,indiceFinal)

    const paginasTotales = Math.ceil(productos.length/elementosPorPagina)
    
    return (productos.length === 0 ? ( cargando === false ?<div className="container mt-4">
            
            <h1 className="  display-4 ">No hay productos cargados aun</h1>
            <button className="btn btn-primary">regresar</button> </div>
            :
            <div className="container mt-4">
            <p className="display-4 ">Esperando productos...</p>
           <button className="btn btn-primary">regresar</button> 
           

        </div>)
        
        :

        <div className=" container mt-4">
            <h2 classNameName="text-body-secondary">📦Inventario de la ferreteria📦</h2>
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
            <table className="table table-dark table-hover table-bordered">
                <thead  >
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Codigo</th>
                        <th>Precio</th>
                        <th>Stock actual</th>
                        <th>Unidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {productosPorPagina.map((p)=> (
                        <tr key={p.id} >
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>{p.codigo}</td>
                            <td>{p.precioPublico}</td>
                            <td>{p.stockActual}</td>
                            <td>{p.unidadMedida}</td>
                            <td>{
                                <>
                                <button type="button" className="btn btn-outline-danger me-2" onClick={() => {eliminarProducto(p.id)}}> 🗑️Eliminar</button>
                                <button type="button" className="btn btn-outline-primary me-2">✏️Editar</button>
                                </>
                                }
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            { paginasTotales > 1 && (
            <div className="d-flex justify-content-center align-items-center">
                
                
                <button className= "btn btn-secondary me-2 " onClick ={() => {setPaginaActual(paginaActual - 1)}} disabled = {paginaActual === 1}>⬅️ Anterior</button>
             <span className="text-muted me-2"> {paginaActual} de {paginasTotales}</span>
            <button className= "btn btn-secondary me-2" onClick ={() => {setPaginaActual(paginaActual + 1)}} disabled = {paginaActual === paginasTotales} >Siguiente ➡️</button>
            </div>
            )} 
        </div>
        
    )
}

export default TablaProductos;


/* <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form> */