import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    headers: {
      // Ensure Google OAuth and Firebase Auth popups can communicate with the opener window on localhost:5173
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    }
  }
})
