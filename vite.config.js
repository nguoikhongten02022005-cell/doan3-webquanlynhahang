import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const bienMoiTruong = loadEnv(mode, process.cwd(), '')
  const congFrontend = Number(bienMoiTruong.VITE_PORT)

  if (!Number.isInteger(congFrontend) || congFrontend <= 0) {
    throw new Error('Thiếu hoặc sai VITE_PORT trong file .env')
  }

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: congFrontend,
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
  }
})
