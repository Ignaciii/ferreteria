import axios from "axios";
import { useState } from "react";

const FormularioCarga = () => {
    const [producto, setProducto] = useState({
        codigo: '',
        nombre: '',
        unidadMedida: 'UNIDAD',
        precioCosto: 0,
        precioPublico: 0,
        stockActual: 0,
        puntoReposicion: 0
    });

    const manejarCambio = (evento) => {
        const { name, value } = evento.target
        setProducto({ ...producto, [name]: value })
    }

    const guardarProducto = (evento) => {
        evento.preventDefault();
        axios.post("http://localhost:8080/api/productos", producto)
            .then(() => {
                window.alert("¡Producto cargado joya!");
                // Limpiar form
                setProducto({
                    codigo: '', nombre: '', unidadMedida: 'UNIDAD',
                    precioCosto: 0, precioPublico: 0, stockActual: 0, puntoReposicion: 0
                });
            })
            .catch((error) => { console.log("Error al cargar el producto: ", error) });
    }

    return (
        // CARD: Fondo gris intermedio (bg-secondary) con opacidad (bg-opacity-25) para darle estilo
        // shadow-lg: Sombra fuerte para que "flote"
        <div className="card bg-secondary text-white shadow-lg p-4 mb-5 rounded">
            <h3 className="mb-4 text-center border-bottom pb-2">📦 Nuevo Producto</h3>
            
            <form onSubmit={guardarProducto} className="row g-3">
                
                <div className="col-md-4">
                    <label className="form-label">Código</label>
                    <input type="text" className="form-control" name="codigo" placeholder="Ej: TORN-01" 
                        value={producto.codigo} onChange={manejarCambio} required />
                </div>
                
                <div className="col-md-8">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="nombre" placeholder="Ej: Destornillador Phillips" 
                        value={producto.nombre} onChange={manejarCambio} required />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Unidad</label>
                    <select className="form-select" name="unidadMedida" value={producto.unidadMedida} onChange={manejarCambio}>
                        <option value="UNIDAD">Unidad</option>
                        <option value="KG">Kilogramo</option>
                        <option value="METRO">Metro</option>
                    </select>
                </div>

                <div className="col-md-6">
                    <label className="form-label">Stock Inicial</label>
                    <input type="number" className="form-control" name="stockActual" 
                        value={producto.stockActual} onChange={manejarCambio} required />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Costo</label>
                    <input type="number" className="form-control" name="precioCosto" 
                        value={producto.precioCosto} onChange={manejarCambio} step="0.01" />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Precio Público</label>
                    <input type="number" className="form-control" name="precioPublico" 
                        value={producto.precioPublico} onChange={manejarCambio} step="0.01" />
                </div>

                <div className="col-12 mt-4 text-center">
                    <button type="submit" className="btn btn-primary btn-lg w-50 shadow">
                        💾 Guardar Producto
                    </button>
                </div>

            </form>
        </div>
    )
}

export default FormularioCarga