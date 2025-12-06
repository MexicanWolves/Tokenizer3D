import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/bert': {
        target: 'http://34.123.216.38:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bert/, '')
      },
      '/word2vec': {
        target: 'http://34.42.66.227:8000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/word2vec/, '')
      }
    }
  }
})
