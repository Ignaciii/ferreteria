import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const FormularioCarga = ({ productoEditar, alTerminar }) => {
    
    const [producto, setProducto] = useState({
        rubro: '',
        nombre: '',
        unidadMedida: 'UNIDAD',
        precioCosto: 0,
        porcentaje: 0, 
        precioPublico: 0,
        stockActual: 0,
        puntoReposicion: 0
    });

    const [rubrosSugeridos, setRubrosSugeridos] = useState([]);
    const [mostrarSensible, setMostrarSensible] = useState(!productoEditar);

    const cargarRubrosSugeridos = () => {
        axios.get("http://localhost:8080/api/productos")
            .then(resp => {
                const unicos = [...new Set(resp.data.map(p => p.rubro))]
                                .filter(r => r && r.trim() !== "");
                setRubrosSugeridos(unicos);
            })
            .catch(err => console.log("Error cargando rubros:", err));
    };

    useEffect(() => {
        cargarRubrosSugeridos();

        if (productoEditar) {
            setMostrarSensible(false);
            let porcentajeCalculado = 0;
            if (productoEditar.precioCosto > 0) {
                porcentajeCalculado = ((productoEditar.precioPublico - productoEditar.precioCosto) / productoEditar.precioCosto) * 100;
            }

            setProducto({
                ...productoEditar,
                puntoReposicion: productoEditar.puntoReposicion || 0, 
                porcentaje: porcentajeCalculado.toFixed(2) 
            });
        } else {
            setMostrarSensible(true);
            limpiarFormulario();
        }
    }, [productoEditar]);

    const limpiarFormulario = () => {
        setProducto({
            rubro: '', nombre: '', unidadMedida: 'UNIDAD',
            precioCosto: 0, porcentaje: 0, precioPublico: 0, stockActual: 0, puntoReposicion: 0
        });
    }

    const desbloquearPrecios = () => {
        Swal.fire({
            title: 'Seguridad',
            text: 'Ingrese la clave de administrador:',
            input: 'password',
            showCancelButton: true,
            confirmButtonText: 'Desbloquear',
            background: '#1f1f1f', color: '#fff'
        }).then((result) => {
            if (result.isConfirmed && result.value === "123456") { 
                setMostrarSensible(true);
                Swal.fire({ title: 'Acceso Concedido', icon: 'success', timer: 1000, showConfirmButton: false, background: '#1f1f1f', color: '#fff' });
            } else if (result.isConfirmed) {
                Swal.fire({ title: 'Clave Incorrecta', icon: 'error', background: '#1f1f1f', color: '#fff' });
            }
        });
    }

    // Nueva función para bloquear teclas raras en los números
    const bloquearInvalidos = (e) => {
        if (['-', '+', 'e', 'E'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        
        // Freno de mano extra: si pegan un número negativo con Ctrl+V, lo volvemos positivo o 0
        let valLimpio = value;
        if (evento.target.type === 'number' && parseFloat(value) < 0) {
            valLimpio = Math.abs(value);
        }

        let nuevoProducto = { ...producto, [name]: valLimpio };

        const costo = parseFloat(name === 'precioCosto' ? valLimpio : producto.precioCosto) || 0;
        const porc = parseFloat(name === 'porcentaje' ? valLimpio : producto.porcentaje) || 0;
        const publico = parseFloat(name === 'precioPublico' ? valLimpio : producto.precioPublico) || 0;

        if (name === 'precioCosto' || name === 'porcentaje') {
            const precioFinal = costo + (costo * (porc / 100));
            nuevoProducto.precioPublico = Math.round(precioFinal);
        } else if (name === 'precioPublico') {
            if (costo > 0) {
                const nuevoPorc = ((publico - costo) / costo) * 100;
                nuevoProducto.porcentaje = nuevoPorc.toFixed(2); 
            }
        }
        
        setProducto(nuevoProducto);
    }

    const guardarProducto = (evento) => {
        evento.preventDefault();
        
        if (parseFloat(producto.precioCosto) <= 0) {
            Swal.fire({ title: 'Atención', text: 'El precio de costo no puede ser $0.', icon: 'warning', background: '#1f1f1f', color: '#fff' });
            return;
        }
        if (parseInt(producto.stockActual) < 0 && !producto.id) { 
            Swal.fire({ title: 'Atención', text: 'El stock inicial no puede ser menor a 0.', icon: 'warning', background: '#1f1f1f', color: '#fff' });
            return;
        }

        const swalDark = { background: '#1f1f1f', color: '#fff' };

        const productoParaGuardar = {
            ...producto,
            precioCosto: parseFloat(producto.precioCosto) || 0,
            precioPublico: parseFloat(producto.precioPublico) || 0, 
            stockActual: parseInt(producto.stockActual) || 0,
            puntoReposicion: parseInt(producto.puntoReposicion) || 0
        };

        const peticion = productoParaGuardar.id 
            ? axios.put(`http://localhost:8080/api/productos/${productoParaGuardar.id}`, productoParaGuardar)
            : axios.post("http://localhost:8080/api/productos", productoParaGuardar);

        peticion.then(() => {
            Swal.fire({ title: 'Éxito', text: 'Producto guardado correctamente.', icon: 'success', ...swalDark });
            cargarRubrosSugeridos(); 
            limpiarFormulario();
            alTerminar();
        }).catch(() => Swal.fire({ title: 'Error', text: 'No se pudo guardar.', icon: 'error', ...swalDark }));
    }

    return (
        <div className="card bg-secondary text-white shadow-lg p-4 mb-5 rounded">
            <h3 className="mb-4 text-center border-bottom pb-2">
                {producto.id ? "✏️ Editar Producto" : "📦 Nuevo Producto"}
            </h3>
            
            <form onSubmit={guardarProducto} className="row g-3">
                <div className="col-md-5">
                    <label className="form-label">Rubro</label>
                    <div className="input-group shadow-sm">
                        <input 
                            type="text" className="form-control" name="rubro" placeholder="Ej: Pinturería..."
                            value={producto.rubro} onChange={manejarCambio} required autoComplete="off"
                        />
                        <select 
                            className="form-select fw-bold text-dark" 
                            style={{ maxWidth: '140px', cursor: 'pointer', backgroundColor: '#ffc107', borderColor: '#ffc107' }}
                            onChange={(e) => {
                                if (e.target.value) {
                                    manejarCambio({ target: { name: 'rubro', value: e.target.value } });
                                    e.target.value = "";
                                }
                            }}
                        >
                            <option value="">▼ Elegir</option>
                            {rubrosSugeridos.map((r, index) => (
                                <option key={index} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="col-md-7">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="nombre" 
                        value={producto.nombre} onChange={manejarCambio} required />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Unidad</label>
                    <select className="form-select" name="unidadMedida" value={producto.unidadMedida} required onChange={manejarCambio}>
                        <option value="UNIDAD">Unidad</option>
                        <option value="KG">Kilogramo</option>
                        <option value="METRO">Metro</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Stock Actual</label>
                    {/* Agregado onKeyDown acá */}
                    <input type="number" className="form-control" name="stockActual" min="0"
                        value={producto.stockActual} onChange={manejarCambio} onKeyDown={bloquearInvalidos} required />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Stock Mínimo</label>
                    {/* Agregado onKeyDown acá */}
                    <input type="number" className="form-control" name="puntoReposicion" min="0"
                        value={producto.puntoReposicion} onChange={manejarCambio} onKeyDown={bloquearInvalidos} required />
                </div>

                <div className="col-12 mt-4">
                    <div className="p-3 border rounded bg-dark bg-opacity-25">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="text-info m-0">💰 Calculadora de Precios</h5>
                            {!mostrarSensible && (
                                <button type="button" className="btn btn-sm btn-danger" onClick={desbloquearPrecios}>
                                    🔒 Desbloquear Costos
                                </button>
                            )}
                        </div>

                        {!mostrarSensible ? (
                            <div className="alert alert-dark d-flex align-items-center justify-content-between m-0">
                                <span>🔒 Costos ocultos por seguridad.</span>
                                <h4 className="text-success m-0">Venta: ${producto.precioPublico}</h4>
                            </div>
                        ) : (
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Precio Costo ($)</label>
                                    {/* Agregado onKeyDown acá */}
                                    <input type="number" className="form-control" name="precioCosto" 
                                        min="0" step="0.01" value={producto.precioCosto} onChange={manejarCambio} onKeyDown={bloquearInvalidos} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Recargo (%)</label>
                                    <div className="input-group">
                                        {/* Agregado onKeyDown acá */}
                                        <input type="number" className="form-control border-success" name="porcentaje" 
                                            min="0" step="0.01" value={producto.porcentaje} onChange={manejarCambio} onKeyDown={bloquearInvalidos} required/>
                                        <span className="input-group-text bg-success text-white">%</span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold text-warning">Precio al Público ($)</label>
                                    {/* Agregado onKeyDown acá */}
                                    <input type="number" className="form-control bg-dark text-warning fw-bold" name="precioPublico" 
                                        step="1" min="0" value={producto.precioPublico} onChange={manejarCambio} onKeyDown={bloquearInvalidos} required />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12 mt-4 text-center">
                    <button type="submit" className={`btn btn-lg shadow ${producto.id ? 'btn-warning text-dark' : 'btn-primary'}`} style={{ minWidth: '200px' }}>
                        {producto.id ? "🔄 Modificar" : "💾 Guardar"}
                    </button>
                    {producto.id && (
                        <button type="button" className="btn btn-outline-light btn-lg ms-3 shadow" onClick={() => { limpiarFormulario(); alTerminar(); }}>
                            ❌ Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default FormularioCarga;