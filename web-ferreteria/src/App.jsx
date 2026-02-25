import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegurate que esto esté
import TablaProductos from "./components/TablaProductos"
import FormularioCarga from './components/FormularioCarga'

function App() {
  const [opcion, setOpcion] = useState("Formulario")

  return (
    // bg-dark: Fondo bien oscuro
    // text-white: Texto blanco general
    // min-vh-100: Ocupa el 100% de la altura de la pantalla (clave para que no quede cortado)
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      
      <div className="container mt-5">
        
        {/* TITULO */}
        <h1 className="text-center mb-4 display-5 fw-bold">🛠️ Ferretería System</h1>

        {/* BOTONERA */}
        <div className="d-flex justify-content-center mb-5 gap-3">
          <button 
              className={`btn btn-lg ${opcion === 'Inventario' ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => setOpcion('Inventario')}
          >
              📋 Ver Inventario
          </button>
          <button 
              className={`btn btn-lg ${opcion === 'Formulario' ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => setOpcion('Formulario')}
          >
              ➕ Cargar Producto
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="contenido">
          {opcion === 'Inventario' && <TablaProductos />}
          
          {opcion === 'Formulario' && (
              <div className="container">
                  <FormularioCarga /> 
              </div>
          )}
        </div>
      
      </div>
    </div>
  )
}

export default App