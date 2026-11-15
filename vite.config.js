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
  },
  build: {
    // SECURITY: Disable sourcemaps completely in production builds to prevent public reverse-engineering of source files
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Partition vendor libraries from application code for security and performance
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  },
  esbuild: {
    // SECURITY: Strip all development console logging and debuggers from compiled production bundles
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
})
