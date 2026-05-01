import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isPages = mode === 'pages'
  // For GitHub Pages project sites: https://<user>.github.io/<repo>/
  // If your repo name differs, set it via VITE_PAGES_BASE or adjust below.
  const base = isPages ? process.env.VITE_PAGES_BASE ?? '/ielts-simulator/' : '/'
  // Empty string is common from .env / CI; `??` would not fall back and relative /api hits static Pages (405 on POST).
  const pagesApiBase =
    (process.env.VITE_API_BASE_URL || '').trim() ||
    'https://ielts-simulator-api-887393880271.australia-southeast1.run.app'

  return {
    plugins: [react()],
    base,
    define: isPages
      ? {
          // Ensure Pages build talks to hosted API (no dev proxy on GitHub Pages)
          'import.meta.env.VITE_API_BASE_URL': JSON.stringify(pagesApiBase),
        }
      : undefined,
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
