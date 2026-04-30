import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { getCookieName, setAuthCookie, signToken, verifyToken } from '../lib/auth.js'

export const authRouter = express.Router()

authRouter.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, address, contactNo, password } = req.body ?? {}
    const e = String(email || '').trim().toLowerCase()
    if (!e || !firstName || !lastName || !address || !contactNo || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'All fields are required.' })
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Validation Error', message: 'Password must be at least 8 characters.' })
    }

    const existing = await User.findOne({ email: e }).lean()
    if (existing) {
      return res.status(409).json({ error: 'Conflict', message: 'Email is already registered.' })
    }

    const passwordHash = await bcrypt.hash(String(password), 10)
    const user = await User.create({
      email: e,
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      address: String(address).trim(),
      contactNo: String(contactNo).trim(),
      passwordHash,
    })

    const token = signToken({ id: user._id.toString(), email: user.email })
    setAuthCookie(res, token)
    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to register.' })
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {}
    const e = String(email || '').trim().toLowerCase()
    if (!e || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: e }).select('+passwordHash').exec()
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password.' })
    }
    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password.' })
    }

    const token = signToken({ id: user._id.toString(), email: user.email })
    setAuthCookie(res, token)
    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch {
    return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to login.' })
  }
})

authRouter.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.[getCookieName()]
    if (!token) return res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated.' })

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.id).lean()
    if (!user) return res.status(401).json({ error: 'Unauthorized', message: 'User not found.' })

    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token.' })
  }
})

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(getCookieName(), { path: '/' })
  return res.json({ message: 'Logged out.' })
})

