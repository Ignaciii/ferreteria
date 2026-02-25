import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

const FormularioCarga = () => {
    const [producto, setProducto] = useState({
        codigo: '',
        nombre: '',
        unidadMedida: 'UNIDAD',
        precioCosto: 0,
        porcentaje: 0, // Nuevo campo para el recargo
        precioPublico: 0,
        stockActual: 0,
        puntoReposicion: 0
    });

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        
        // 1. Hacemos una copia del producto actual para modificarla
        let nuevoProducto = { ...producto, [name]: value };

        // 2. Si cambiaste el COSTO o el PORCENTAJE, recalculamos el precio final
        if (name === 'precioCosto' || name === 'porcentaje') {
            // Convertimos a numero para que no concatene strings (ojo con el parseFloat)
            const costo = parseFloat(name === 'precioCosto' ? value : producto.precioCosto) || 0;
            const porc = parseFloat(name === 'porcentaje' ? value : producto.porcentaje) || 0;
            
            // LA FORMULA MAGICA:
            const precioFinal = costo + (costo * (porc / 100));
            
            // Guardamos con 2 decimales
            nuevoProducto.precioPublico = precioFinal.toFixed(2);
        }

        setProducto(nuevoProducto);
    }

    const guardarProducto = (evento) => {
        evento.preventDefault();
        
        // Ojo acá: Si tu backend NO espera recibir el campo "porcentaje", 
        // podrías filtrar el objeto antes de enviarlo. 
        // Por ahora lo mandamos así, si el backend lo ignora, joya.
        
        axios.post("http://localhost:8080/api/productos", producto)
            .then(() => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El producto se cargó y se calculó el precio joya 🧮',
                    icon: 'success',
                    confirmButtonText: 'De una',
                    background: '#1f1f1f',
                    color: '#fff'
                });
                
                // Limpiar form (reseteamos todo a 0)
                setProducto({
                    codigo: '', nombre: '', unidadMedida: 'UNIDAD',
                    precioCosto: 0, porcentaje: 0, precioPublico: 0, stockActual: 0, puntoReposicion: 0
                });
            })
            .catch((error) => { 
                console.log("Error al cargar: ", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Algo explotó en el servidor',
                    icon: 'error',
                    background: '#1f1f1f',
                    color: '#fff'
                });
            });
    }

    return (
        <div className="card bg-secondary text-white shadow-lg p-4 mb-5 rounded">
            <h3 className="mb-4 text-center border-bottom pb-2">📦 Nuevo Producto (Calculadora Auto)</h3>
            
            <form onSubmit={guardarProducto} className="row g-3">
                
                {/* Fila 1: Codigo y Nombre */}
                <div className="col-md-4">
                    <label className="form-label">Código</label>
                    <input type="text" className="form-control" name="codigo" placeholder="Ej: TORN-01" 
                        value={producto.codigo} onChange={manejarCambio} required />
                </div>
                
                <div className="col-md-8">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="nombre" placeholder="Ej: Martillo Galáctico" 
                        value={producto.nombre} onChange={manejarCambio} required />
                </div>

                {/* Fila 2: Unidad y Stock */}
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

        
                <div className="col-12 mt-4">
                    <div className="p-3 border rounded bg-dark bg-opacity-25">
                        <h5 className="mb-3 text-info">💰 Calculadora de Precios</h5>
                        <div className="row g-3">
                            
                        
                            <div className="col-md-4">
                                <label className="form-label">Precio Costo ($)</label>
                                <input type="number" className="form-control" name="precioCosto" 
                                    placeholder="0.00"
                                    value={producto.precioCosto} onChange={manejarCambio} step="0.01" required />
                            </div>

                            
                            <div className="col-md-4">
                                <label className="form-label">Recargo (%)</label>
                                <div className="input-group">
                                    <input type="number" className="form-control border-success" name="porcentaje" 
                                        placeholder="Ej: 30"
                                        value={producto.porcentaje} onChange={manejarCambio} />
                                    <span className="input-group-text bg-success text-white">%</span>
                                </div>
                            </div>

                            {/* PRECIO FINAL (Calculado) */}
                            <div className="col-md-4">
                                <label className="form-label fw-bold text-warning">Precio al Público ($)</label>
                                <input type="number" className="form-control bg-dark text-warning fw-bold" name="precioPublico" 
                                    value={producto.precioPublico} 
                                    readOnly // <--- ESTO ES CLAVE: No se puede editar a mano
                                />
                                <small className="text-light opacity-50">Se calcula solo</small>
                            </div>

                        </div>
                    </div>
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