import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'
import { GioHangProvider } from './context/GioHangContext.jsx'
import { GioHangMangVeProvider } from './context/GioHangMangVeContext.jsx'
import { ThongBaoProvider } from './context/ThongBaoContext.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThongBaoProvider>
        <GioHangProvider>
          <GioHangMangVeProvider>
            <App />
          </GioHangMangVeProvider>
        </GioHangProvider>
      </ThongBaoProvider>
    </QueryClientProvider>
  </StrictMode>,
)
