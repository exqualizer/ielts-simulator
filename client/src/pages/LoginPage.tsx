import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export function LoginPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      nav('/scores')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message ?? 'Failed to login.')
          : 'Failed to login.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="paper">
      <header className="paper__head">
        <h1>Log in</h1>
        <p className="paper__meta">Use your email and password.</p>
      </header>

      <section className="panel">
        <form onSubmit={onSubmit} className="form">
          <label className="gap-label">
            Email
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="gap-label">
            Password
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="banner banner--warn" role="status">
              {error}
            </p>
          )}
          <div className="actions-row">
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
            </button>
            <Link className="btn" to="/register">
              Create account
            </Link>
          </div>
        </form>
      </section>
    </article>
  )
}

