import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";

const TablaProductos = () =>{
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        cargarProductos();

    }, []
    )

    const cargarProductos = () => {
        axios.get("http://localhost:8080/api/productos").then((respuesta) => (setProductos(respuesta.data))).catch((error) => {console.log("Error ocurrido: ",error)})

    }

    const eliminarProducto = (id) => {
        if(window.confirm("Estas apunto de borrar un producto, ¿estas seguro?"))
        axios.delete("http://localhost:8080/api/productos/"+id).then(() => (cargarProductos())).catch((error) => {console.log("Error al borrar: ",error)})
    }

    
    return (
        <div>
            <h2 classNameName="lead ">Inventario de la ferreteria</h2>
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
                    {productos.map((p)=> (
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
        </div>
    )

}
export default TablaProductos;