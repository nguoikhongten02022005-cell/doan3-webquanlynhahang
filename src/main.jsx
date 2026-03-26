import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'
import { GioHangProvider } from './context/GioHangContext.jsx'
import { ThongBaoProvider } from './context/ThongBaoContext.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThongBaoProvider>
        <GioHangProvider>
          <App />
        </GioHangProvider>
      </ThongBaoProvider>
    </QueryClientProvider>
  </StrictMode>,
)
