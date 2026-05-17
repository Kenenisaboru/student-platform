import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Dedicated ports so this app does not clash with other Vite/Express projects on 5173/5001
const CLIENT_PORT = 5180
const API_PORT = 5010

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: CLIENT_PORT,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${API_PORT}`,
        changeOrigin: true,
      },
      '/socket.io': {
        target: `http://127.0.0.1:${API_PORT}`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
