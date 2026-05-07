import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { initCMS } from './lib/cms.js'
import '@fontsource/geist-sans/latin-300.css'
import '@fontsource/geist-sans/latin-400.css'
import '@fontsource/geist-sans/latin-500.css'
import '@fontsource/geist-sans/latin-600.css'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

// Render immediately with cached data, then sync from Supabase in background
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Pull latest content from Supabase into localStorage for next render
initCMS()
