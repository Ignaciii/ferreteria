import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const HistorialVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    useEffect(() => {
        buscarVentas();
    }, []);

    const buscarVentas = () => {
        let url = "http://localhost:8080/api/ventas";
        
        if (fechaDesde && fechaHasta) {
            const inicio = `${fechaDesde}T00:00:00`;
            const fin = `${fechaHasta}T23:59:59`;
            url += `?inicio=${inicio}&fin=${fin}`;
        } else if (fechaDesde || fechaHasta) {
            Swal.fire({ title: 'Ojo al piojo', text: 'Tenés que completar ambas fechas para filtrar.', icon: 'warning', background: '#1f1f1f', color: '#fff' });
            return;
        }

        axios.get(url)
            .then(resp => {
                const ventasOrdenadas = resp.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setVentas(ventasOrdenadas);
            })
            .catch(err => {
                console.log(err);
                Swal.fire({ title: 'Error', text: 'No se pudo traer el historial de ventas.', icon: 'error', background: '#1f1f1f', color: '#fff' });
            });
    };

    const limpiarFiltros = () => {
        setFechaDesde("");
        setFechaHasta("");
        axios.get("http://localhost:8080/api/ventas")
            .then(resp => setVentas(resp.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))))
            .catch(err => console.log(err));
    };

    // --- LA MAGIA NUEVA: Función para ver qué tiene adentro la venta ---
    const verDetalleTicket = (venta) => {
        if (!venta.detalles || venta.detalles.length === 0) {
            Swal.fire({ title: 'Mmm...', text: 'Este ticket no tiene productos registrados.', icon: 'info', background: '#1f1f1f', color: '#fff' });
            return;
        }

        // Armamos las filas de la tabla en HTML para el SweetAlert
        let filasHtml = venta.detalles.map(d => `
            <tr style="border-bottom: 1px solid #444;">
                <td style="text-align: left; padding: 8px;">${d.producto ? d.producto.nombre : 'Prod. Borrado'}</td>
                <td style="text-align: center; padding: 8px;">${d.cantidad}</td>
                <td style="text-align: right; padding: 8px;">$${d.precioUnitario.toFixed(2)}</td>
                <td style="text-align: right; font-weight: bold; color: #28a745; padding: 8px;">$${d.subtotal.toFixed(2)}</td>
            </tr>
        `).join('');

        let tablaHtml = `
            <table style="width: 100%; color: white; border-collapse: collapse; margin-top: 10px; font-size: 0.95em;">
                <thead style="background-color: #333;">
                    <tr>
                        <th style="text-align: left; padding: 10px;">Producto</th>
                        <th style="text-align: center; padding: 10px;">Cant.</th>
                        <th style="text-align: right; padding: 10px;">Unitario</th>
                        <th style="text-align: right; padding: 10px;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasHtml}
                </tbody>
            </table>
        `;

        // Lanzamos el Popup
        Swal.fire({
            title: `🧾 Detalle Ticket #${venta.id}`,
            html: tablaHtml,
            width: '600px',
            background: '#1f1f1f',
            color: '#fff',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#6c757d'
        });
    };
    // -------------------------------------------------------------------

    const totalRecaudado = ventas.reduce((acc, venta) => acc + venta.totalNeto, 0);

    return (
        <div className="card bg-secondary text-white shadow-lg p-4 mb-5 rounded">
            <h3 className="mb-4 text-center border-bottom pb-2">📈 Historial de Ventas</h3>

            <div className="row g-3 align-items-end mb-4 p-3 bg-dark bg-opacity-25 rounded">
                <div className="col-md-4">
                    <label className="form-label">Desde Fecha:</label>
                    <input 
                        type="date" className="form-control" 
                        value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} 
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Hasta Fecha:</label>
                    <input 
                        type="date" className="form-control" 
                        value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} 
                    />
                </div>
                <div className="col-md-4 d-flex gap-2">
                    <button className="btn btn-primary w-100 fw-bold" onClick={buscarVentas}>🔍 Filtrar</button>
                    <button className="btn btn-outline-light w-100" onClick={limpiarFiltros}>🧹 Limpiar</button>
                </div>
            </div>

            <div className="alert alert-success d-flex justify-content-between align-items-center shadow-sm">
                <h4 className="m-0 text-dark">Total Recaudado en el periodo:</h4>
                <h2 className="m-0 text-dark fw-bold">${totalRecaudado.toFixed(2)}</h2>
            </div>

            {ventas.length > 0 ? (
                <div className="table-responsive mt-3">
                    <table className="table table-dark table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th className="text-center">Nº Ticket</th>
                                <th>Fecha y Hora</th>
                                <th className="text-end">Subtotal</th>
                                <th className="text-center">Descuento</th>
                                <th className="text-end text-success">Total Cobrado</th>
                                <th className="text-center">Detalle</th> {/* <-- NUEVA COLUMNA */}
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map(v => {
                                const fechaLinda = new Date(v.fecha).toLocaleString('es-AR', {
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                });

                                return (
                                    <tr key={v.id}>
                                        <td className="text-center fw-bold">#{v.id}</td>
                                        <td>{fechaLinda}</td>
                                        <td className="text-end">${v.subtotalBruto?.toFixed(2)}</td>
                                        <td className="text-center">{v.descuentoPorcentaje}%</td>
                                        <td className="text-end text-success fw-bold">${v.totalNeto?.toFixed(2)}</td>
                                        <td className="text-center">
                                            {/* --- NUEVO BOTÓN PARA VER EL TICKET --- */}
                                            <button 
                                                className="btn btn-sm btn-outline-info rounded-circle" 
                                                title="Ver detalle del ticket"
                                                onClick={() => verDetalleTicket(v)}
                                            >
                                                👁️
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-4 opacity-50 mt-3 border rounded border-secondary">
                    <h5>No hay ventas registradas en este periodo. 🦗 (Cri cri...)</h5>
                </div>
            )}
        </div>
    );
};

export default HistorialVentas;