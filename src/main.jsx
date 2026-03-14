import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GioHangProvider } from './context/GioHangContext.jsx'
import { ThongBaoProvider } from './context/ThongBaoContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThongBaoProvider>
      <GioHangProvider>
        <App />
      </GioHangProvider>
    </ThongBaoProvider>
  </StrictMode>,
)
