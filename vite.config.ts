import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Removed base path for Netlify (serves from root)
  // base: '/demo_portal/',
})
