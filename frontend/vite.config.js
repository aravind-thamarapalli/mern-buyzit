import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
        tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://mern-buyzit-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/cart': {
        target: 'https://mern-buyzit-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/order': {
        target: 'https://mern-buyzit-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/orders': {
        target: 'https://mern-buyzit-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/all-orders': {
        target: 'https://mern-buyzit-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/add-address': {
        target: 'https://mern-buyzit-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
