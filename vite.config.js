import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('antd') || id.includes('@ant-design') || id.includes('rc-')) {
            return 'ui-antd'
          }

          if (id.includes('@tanstack/react-query')) {
            return 'du-lieu-query'
          }

          if (id.includes('react-router') || id.includes('@remix-run')) {
            return 'dieu-huong'
          }

          if (id.includes('zustand')) {
            return 'trang-thai-zustand'
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor'
          }

          return 'vendor-khac'
        },
      },
    },
  },
})
