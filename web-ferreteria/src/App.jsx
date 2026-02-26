import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import TablaProductos from "./components/TablaProductos"
import FormularioCarga from './components/FormularioCarga'
import PuntoDeVenta from './components/PuntoDeVenta' 

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
        
        {/* TITULO */}
        <h1 className="text-center mb-4 display-5 fw-bold">🛠️ Ferretería Electronor 🪛</h1>

        {/* BOTONERA TRIPLE CORREGIDA */}
        <div className="d-flex justify-content-center mb-5 gap-3 flex-wrap">
          
          {/* 1. INVENTARIO */}
          <button 
              // Si está activo es BLANCO (light), sino GRIS (secondary)
              className={`btn btn-lg ${opcion === 'Inventario' ? 'btn-warning text-dark' : 'btn-secondary'}`}
              onClick={() => {setOpcion('Inventario'); limpiar()}}
          >
              📋 Ver Inventario
          </button>
          
          {/* 2. VENTA (Destacado) */}
          <button 
              // Si está activo es AMARILLO (warning), sino GRIS
              className={`btn btn-lg ${opcion === 'Venta' ? 'btn-warning text-dark' : 'btn-secondary'}`}
              onClick={() => {setOpcion('Venta'); limpiar()}}
          >
              🛒 Nueva Venta
          </button>

          {/* 3. CARGAR PRODUCTO */}
          <button 
              // Si está activo es BLANCO, sino GRIS. (Antes acá tenías el error de lógica)
              className={`btn btn-lg ${opcion === 'Formulario' ? 'btn-warning text-dark' : 'btn-secondary'}`}
              onClick={() => {setOpcion('Formulario');limpiar()}}
          >
              ➕ Cargar Producto
          </button>
        </div>

        {/* CONTENIDO (Sin containers anidados que rompen el diseño) */}
        <div className="contenido">
          {opcion === 'Inventario' && <TablaProductos alEditar={editarProducto}/>}
          
          {opcion === 'Venta' && <PuntoDeVenta />}
          
          {opcion === 'Formulario' && <FormularioCarga productoEditar={productoEditar} alTerminar={limpiar}/>}
        </div>
      
      </div>
    </div>
  )
}

export default App