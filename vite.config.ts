import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures proper asset loading on Netlify
  build: {
    outDir: 'dist', // Default build output folder
    assetsDir: 'assets', // Organizes assets inside the dist folder
  },
  server: {
    port: 3000, // Local development port
  }
})
