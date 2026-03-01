import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import TablaProductos from "./components/TablaProductos"
import FormularioCarga from "./components/FormularioCarga"
import PuntoDeVenta from "./components/PuntoDeVenta"
import IngresarPedido from "./components/IngresarPedido"
import HistorialVentas from "./components/HistorialDeVentas" // <-- IMPORTAMOS EL NUEVO

function App() {
  const [opcion, setOpcion] = useState("Venta") 
  const [productoEditar, setProductoEditar] = useState(null)

  const editarProducto = (producto) => {
    setProductoEditar(producto)
    setOpcion("Formulario")
  }

  const limpiar = () => {
    setProductoEditar(null)
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      
      <div className="container mt-5">
        
        <h1 className="text-center mb-4 display-5 fw-bold">🛠️ Ferretería Electronor 🔨</h1>

        {/* --- AHORA TENEMOS 5 BOTONES EN LA BOTONERA --- */}
        <div className="d-flex justify-content-center mb-5 gap-2 flex-wrap">
          
          <button 
              className={`btn btn-lg ${opcion === 'Inventario' ? 'btn-warning text-dark' : 'btn-secondary'}`}
              onClick={() => {setOpcion('Inventario'); limpiar()}}
          >
              📋 Inventario
          </button>
          
          <button 
              className={`btn btn-lg ${opcion === 'Venta' ? 'btn-warning text-dark ' : 'btn-secondary'}`}
              onClick={() => {setOpcion('Venta'); limpiar()}}
          >
              🛒 Venta
          </button>

          {/* EL BOTÓN NUEVO DEL JEFE */}
          <button 
              className={`btn btn-lg ${opcion === 'Historial' ? 'btn-success text-white  shadow' : 'btn-secondary'}`}
              onClick={() => {setOpcion('Historial'); limpiar()}}
          >
              📊 Historial
          </button>

          <button 
              className={`btn btn-lg ${opcion === 'Pedido' ? 'btn-warning text-dark' : 'btn-secondary'}`}
              onClick={() => {setOpcion('Pedido'); limpiar()}}
          >
              🚚 Reposición
          </button>

          <button 
              className={`btn btn-lg ${opcion === 'Formulario' ? 'btn-warning text-dark' : 'btn-secondary'}`}
              onClick={() => {setOpcion('Formulario');limpiar()}}
          >
              ➕ Cargar Prod.
          </button>
        </div>

        {/* --- RUTAS DEL CONTENIDO --- */}
        <div className="contenido">
          {opcion === 'Inventario' && <TablaProductos alEditar={editarProducto}/>}
          {opcion === 'Venta' && <PuntoDeVenta />}
          {opcion === 'Historial' && <HistorialVentas />} {/* <-- EL COMPONENTE NUEVO */}
          {opcion === 'Pedido' && <IngresarPedido />}
          {opcion === 'Formulario' && <FormularioCarga productoEditar={productoEditar} alTerminar={limpiar}/>}
        </div>
      
      </div>
    </div>
  )
}

export default App