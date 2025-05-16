import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Porta modificata da 5173 a 3000
    strictPort: true, // Se true, Vite non proverà altre porte se questa è occupata
  }
})
