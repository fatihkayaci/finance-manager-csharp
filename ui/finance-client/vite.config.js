import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Windows'ta Hot Reload'ın düzgün çalışması için şart!
    },
    host: true, // Docker dışından erişime izin ver
    strictPort: true,
    port: 5173, 
  }
})
