import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import { authRouter } from './routes/auth.js'
import { sessionsRouter } from './routes/sessions.js'

const PORT = Number(process.env.PORT || 3001)
const MONGODB_URI = process.env.MONGODB_URI || ''
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment.')
  process.exit(1)
}

await mongoose.connect(MONGODB_URI)
console.log('MongoDB connected.')

const app = express()

app.use(
  cors({
    origin: CORS_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api/sessions', sessionsRouter)

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
})

