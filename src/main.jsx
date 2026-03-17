import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as UngDungAntd, ConfigProvider } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import 'antd/dist/reset.css'
import App from './App.jsx'
import { queryClient } from './lib/queryClient.js'
import { chuDeAntd } from './theme/chuDeAntd.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={chuDeAntd}>
      <UngDungAntd>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </UngDungAntd>
    </ConfigProvider>
  </StrictMode>,
)
