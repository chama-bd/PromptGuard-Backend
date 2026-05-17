import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'text-body font-sans',
          style: {
            borderRadius: '10px',
            background: '#FFFFFF',
            color: '#1C2833',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: 'none',
          },
          success: {
            iconTheme: {
              primary: '#3B6D11',
              secondary: '#EAF3DE',
            },
          },
          error: {
            iconTheme: {
              primary: '#A32D2D',
              secondary: '#FCEBEB',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
