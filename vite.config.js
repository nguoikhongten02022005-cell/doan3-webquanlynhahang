import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('@ant-design/plots') || id.includes('@antv/')) {
            return 'charts-vendor'
          }

          if (id.includes('/antd/') || id.includes('rc-') || id.includes('@ant-design')) {
            return 'antd-vendor'
          }

          if (id.includes('react-router')) {
            return 'router-vendor'
          }

          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor'
          }

          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'react-vendor'
          }

          return 'vendor-core'
        },
      },
    },
  },
})
