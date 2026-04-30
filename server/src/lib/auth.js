import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || ''
const COOKIE_NAME = process.env.COOKIE_NAME || 'access_token'

export function assertJwtConfigured() {
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET')
  }
}

export function signToken(payload) {
  assertJwtConfigured()
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  assertJwtConfigured()
  return jwt.verify(token, JWT_SECRET)
}

export function getCookieName() {
  return COOKIE_NAME
}

export function authRequired(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token) return res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated.' })
    const decoded = verifyToken(token)
    req.user = decoded
    return next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token.' })
  }
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

