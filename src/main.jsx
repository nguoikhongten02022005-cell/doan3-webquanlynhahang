import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'
import { GioHangProvider } from './context/GioHangContext.jsx'
import { GioHangMangVeProvider } from './context/GioHangMangVeContext.jsx'
import { ThongBaoProvider } from './context/ThongBaoContext.jsx'
import { XacThucProvider } from './hooks/useXacThuc'
import { queryClient } from './lib/queryClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <XacThucProvider>
        <ThongBaoProvider>
          <GioHangProvider>
            <GioHangMangVeProvider>
              <App />
            </GioHangMangVeProvider>
          </GioHangProvider>
        </ThongBaoProvider>
      </XacThucProvider>
    </QueryClientProvider>
  </StrictMode>,
)
