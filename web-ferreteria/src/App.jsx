import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import TablaProductos from "./components/TablaProductos"

function App() {
  

  // 2. MEMORIA DEL FORMULARIO (El producto nuevo que estamos cargando)
  // Iniciamos todo vacío o en cero para que no explote
  // const [nuevoProducto, setNuevoProducto] = useState({
  //   codigo: '',
  //   nombre: '',
  //   unidadMedida: 'UNIDAD', // Valor por defecto
  //   precioCosto: 0,
  //   precioPublico: 0,
  //   stockActual: 0,
  //   puntoReposicion: 0
  // })
return (
  <div className='App'>
 <TablaProductos/></div>)



  // // 3. MANEJADOR DE CAMBIOS (La magia para escribir en los inputs)
  // const manejarCambio = (evento) => {
  //   const { name, value } = evento.target
  //   // Copiamos lo que ya había (...nuevoProducto) y sobreescribimos solo el campo que cambió
  //   setNuevoProducto({
  //     ...nuevoProducto,
  //     [name]: value
  //   })
  // }




  //  4. EL BOTONAZO (Enviar a Java)
  // const guardarProducto = (evento) => {
  //   evento.preventDefault() // Evita que se recargue la página (CLAVE en React)

  //   console.log("Enviando...", nuevoProducto)

  //   axios.post('http://localhost:8080/api/productos', nuevoProducto)
  //     .then(() => {
        
  //       cargarProductos() // Recargamos la tabla para ver el nuevo
  //       // Limpiamos el formulario para cargar otro
  //       setNuevoProducto({
  //           codigo: '',
  //           nombre: '',
  //           unidadMedida: 'UNIDAD',
  //           precioCosto: 0,
  //           precioPublico: 0,
  //           stockActual: 0,
  //           puntoReposicion: 0
  //       })
  //     })
  //     .catch((error) => {
  //       console.error("Error al guardar:", error)
  //       alert("Algo salió mal. Mirá la consola.")
  //     })
  // }

  
}
export default App

// /*
// (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1>🛠️ Ferretería System</h1>

//       {/* --- FORMULARIO DE CARGA --- */}
//       <div style={{ border: '2px solid #007bff', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
//         <h3>Nuevo Producto</h3>
//         <form onSubmit={guardarProducto} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          
//           <input type="text" name="codigo" placeholder="Código (ej: TORN-01)" 
//             value={nuevoProducto.codigo} onChange={manejarCambio} required />
          
//           <input type="text" name="nombre" placeholder="Nombre del Producto" 
//             value={nuevoProducto.nombre} onChange={manejarCambio} required />

//           <select name="unidadMedida" value={nuevoProducto.unidadMedida} onChange={manejarCambio}>
//             <option value="UNIDAD">Unidad</option>
//             <option value="KG">Kilogramo</option>
//             <option value="METRO">Metro</option>
//           </select>

//           <input type="number" name="stockActual" placeholder="Stock Inicial" 
//             value={nuevoProducto.stockActual} onChange={manejarCambio} required />

//           <input type="number" name="precioCosto" placeholder="Precio Costo" 
//             value={nuevoProducto.precioCosto} onChange={manejarCambio} step="0.01" />

//           <input type="number" name="precioPublico" placeholder="Precio Público" 
//             value={nuevoProducto.precioPublico} onChange={manejarCambio} step="0.01" />

//           {/* Botón que ocupa las dos columnas */}
//           <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
//             💾 Guardar Producto
//           </button>
//         </form>
//       </div>

//       {/* --- TABLA DE PRODUCTOS --- */}
//       <h2>Inventario Actual</h2>
//       {productos.length === 0 ? (
//         <p>No hay productos cargados todavía...</p>
//       ) : (
//         <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead style={{ background: '#333', color: 'white' }}>
//             <tr>
//               <th>ID</th>
//               <th>Código</th>
//               <th>Nombre</th>
//               <th>Precio Venta</th>
//               <th>Stock</th>
//               <th>Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {productos.map((p) => (
//               <tr key={p.id} style={{ textAlign: 'center' }}>
//                 <td>{p.id}</td>
//                 <td>{p.codigo}</td>
//                 <td>{p.nombre}</td>
//                 <td>{p.precioPublico}</td>
//                 <td>{p.stockActual} {p.unidadMedida}</td>
//                 <td>
//                   <button onClick={() => {eliminarProducto(p.id)}}>🗑️</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   )
// }