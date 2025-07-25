import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows Vite to be accessible from the network
    allowedHosts: [
      'update-tinz.aipencil.name.vn'
    ],
    port: 5174,
  }
})
