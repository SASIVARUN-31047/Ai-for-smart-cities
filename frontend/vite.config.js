import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ai-for-smart-cities.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
// Cache buster for Vercel: 1
