import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Imports your App.jsx
import 'bootstrap/dist/css/bootstrap.min.css' // Global Bootstrap

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)