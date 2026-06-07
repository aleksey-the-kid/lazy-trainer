import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Lazy Trainer',
        short_name: 'Lazy Trainer',
        description: 'Workout tracker',
        theme_color: '#f5f0e8',
        background_color: '#f5f0e8',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        skipWaiting: false,
        clientsClaim: false,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
})
