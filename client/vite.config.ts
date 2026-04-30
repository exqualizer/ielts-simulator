import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isPages = mode === 'pages'
  // For GitHub Pages project sites: https://<user>.github.io/<repo>/
  // If your repo name differs, set it via VITE_PAGES_BASE or adjust below.
  const base = isPages ? process.env.VITE_PAGES_BASE ?? '/ielts-simulator/' : '/'

  return {
    plugins: [react()],
    base,
    server: isPages
      ? undefined
      : {
          proxy: {
            '/api': {
              target: 'http://localhost:3001',
              changeOrigin: true,
            },
          },
        },
    build: {
      // GitHub Pages can serve from /docs on main branch (Jekyll-compatible)
      outDir: '../docs',
      emptyOutDir: true,
    },
  }
})
