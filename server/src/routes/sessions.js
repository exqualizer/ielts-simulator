import express from 'express'
import { TestSession } from '../models/TestSession.js'
import { authRequired } from '../lib/auth.js'

export const sessionsRouter = express.Router()

sessionsRouter.post('/', authRequired, async (req, res) => {
  try {
    const userId = req.user.id
    const { section, startedAt, endedAt, durationSec, results } = req.body ?? {}
    if (!section || !startedAt || !endedAt || typeof durationSec !== 'number' || !results) {
      return res.status(400).json({ error: 'Validation Error', message: 'Missing required session fields.' })
    }

    const doc = await TestSession.findOneAndUpdate(
      { userId, section },
      {
        userId,
        section,
        startedAt: new Date(startedAt),
        endedAt: new Date(endedAt),
        durationSec,
        results,
        savedAt: new Date(),
      },
      { upsert: true, new: true },
    ).lean()

    return res.json({ id: doc?._id?.toString?.() ?? null, message: 'Saved.' })
  } catch {
    return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to save session.' })
  }
})

sessionsRouter.get('/latest', authRequired, async (req, res) => {
  try {
    const userId = req.user.id
    const sections = ['listening', 'reading', 'writing', 'speaking']

    const out = {}
    await Promise.all(
      sections.map(async (section) => {
        const doc = await TestSession.findOne({ userId, section }).sort({ savedAt: -1 }).lean()
        if (doc) out[section] = doc
      }),
    )

    return res.json({ latest: out })
  } catch {
    return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load sessions.' })
  }
})

sessionsRouter.get('/', authRequired, async (req, res) => {
  try {
    const userId = req.user.id
    const section = req.query.section ? String(req.query.section) : null
    const filter = section ? { userId, section } : { userId }
    const docs = await TestSession.find(filter).sort({ createdAt: -1 }).limit(50).lean()
    return res.json({ sessions: docs })
  } catch {
    return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to load sessions.' })
  }
})

