import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

const duongDanTapTin = fileURLToPath(import.meta.url)
const thuMucFrontend = path.dirname(duongDanTapTin)
const thuMucGoc = path.resolve(thuMucFrontend, '..')
const thuMucEnv = thuMucFrontend

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const bienMoiTruong = loadEnv(mode, thuMucEnv, '')
  const congFrontend = Number(bienMoiTruong.VITE_PORT || '5173')

  if (!Number.isInteger(congFrontend) || congFrontend <= 0) {
    throw new Error('VITE_PORT trong frontend/.env không hợp lệ')
  }

  return {
    envDir: thuMucEnv,
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: congFrontend,
      open: true,
      proxy: {
        '/api': {
          target: bienMoiTruong.VITE_API_PROXY_TARGET || 'http://localhost:5011',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: path.resolve(thuMucGoc, 'dist'),
      emptyOutDir: true,
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
