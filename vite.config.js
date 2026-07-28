import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    /*
     * The API runs as its own process on 3001. Proxying keeps the browser on a
     * single origin, so there is no CORS to configure in development and the
     * fetch path (/api/contact) is identical in production.
     */
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
