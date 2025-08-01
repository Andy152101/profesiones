// Punto de entrada principal de la aplicación React
// Importa React y ReactDOM para renderizar la app en el DOM
import React from 'react'
import ReactDOM from 'react-dom/client'

// Importa el componente principal de la aplicación
import App from './App.jsx'
// Importa los estilos globales (Tailwind y personalizados)
import './index.css'

// Renderiza la aplicación dentro del elemento con id 'root'
// React.StrictMode ayuda a detectar problemas potenciales en desarrollo
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
