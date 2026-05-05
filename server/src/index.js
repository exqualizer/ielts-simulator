import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import { expressLogger, expressErrorLogger, logger } from './config/logger.js'
import { authRouter } from './routes/auth.js'
import { sessionsRouter } from './routes/sessions.js'

const PORT = Number(process.env.PORT || 3001)
const MONGODB_URI = process.env.MONGODB_URI || ''

const app = express();

function collectAllowedOrigins() {
  const set = new Set(
    (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  )
  // GitHub Pages sends Origin as https://<owner>.github.io (no repo path). Optional shortcut for Cloud Run.
  const ghOwner = (process.env.CORS_GITHUB_OWNER || '').trim()
  if (ghOwner) set.add(`https://${ghOwner}.github.io`)
  return [...set]
}

const allowedOrigins = collectAllowedOrigins();

/** Explicit CORS headers (with credentials, origin cannot be *). Runs before `cors` as a clear contract for proxies. */
app.use((req, res, next) => {
  const origin = req.get('Origin')
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Vary', 'Origin')
  }
  next()
})

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true)
      if (allowedOrigins.includes(origin)) return cb(null, true)
      logger.warn(`CORS blocked request from origin: ${origin}`)
      return cb(null, false)
    },
    credentials: true,
  }),
)

if (!MONGODB_URI) {
  logger.error('Missing MONGODB_URI in environment.')
  process.exit(1)
}

await mongoose.connect(MONGODB_URI)
logger.info('MongoDB connected.')
logger.info(`CORS allowed origins (${allowedOrigins.length}): ${allowedOrigins.join(', ')}`)

app.set('trust proxy', 1)

app.use(expressLogger)
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/sessions', sessionsRouter)

app.use(expressErrorLogger)

app.listen(PORT, () => {
  logger.info(`API server listening on http://localhost:${PORT}`)
})

