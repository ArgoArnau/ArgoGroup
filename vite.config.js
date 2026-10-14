import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Only VITE_* reaches the browser. The landings' CRM settings live in the
  // Netlify function (netlify/functions/lead.js), never in the bundle.
  envPrefix: ['VITE_'],
  build: {
    rollupOptions: {
      input: {
        // Keyed 'index' so the main site's bundles keep their index-* names.
        index: resolve(import.meta.dirname, 'index.html'),
        // The Meta Ads landings: own shell each, no Google Fonts, no router.
        growth: resolve(import.meta.dirname, 'growth.html'),
        systems: resolve(import.meta.dirname, 'systems.html'),
      },
    },
  },
})
