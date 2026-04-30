import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export function RegisterPage() {
  const nav = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    contactNo: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function upd<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(form)
      nav('/scores')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message ?? 'Failed to register.')
          : 'Failed to register.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="paper">
      <header className="paper__head">
        <h1>Create account</h1>
        <p className="paper__meta">Register with your details to save test sessions.</p>
      </header>

      <section className="panel">
        <form onSubmit={onSubmit} className="form">
          <div className="grid-2">
            <label className="gap-label">
              First name
              <input className="input" value={form.firstName} onChange={(e) => upd('firstName', e.target.value)} autoComplete="given-name" />
            </label>
            <label className="gap-label">
              Last name
              <input className="input" value={form.lastName} onChange={(e) => upd('lastName', e.target.value)} autoComplete="family-name" />
            </label>
          </div>
          <label className="gap-label">
            Email
            <input className="input" value={form.email} onChange={(e) => upd('email', e.target.value)} autoComplete="email" />
          </label>
          <label className="gap-label">
            Address
            <input className="input" value={form.address} onChange={(e) => upd('address', e.target.value)} autoComplete="street-address" />
          </label>
          <label className="gap-label">
            Contact no.
            <input className="input" value={form.contactNo} onChange={(e) => upd('contactNo', e.target.value)} autoComplete="tel" />
          </label>
          <label className="gap-label">
            Password (min 8 chars)
            <input className="input" value={form.password} onChange={(e) => upd('password', e.target.value)} type="password" autoComplete="new-password" />
          </label>
          {error && (
            <p className="banner banner--warn" role="status">
              {error}
            </p>
          )}
          <div className="actions-row">
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </button>
            <Link className="btn" to="/login">
              Already have an account?
            </Link>
          </div>
        </form>
      </section>
    </article>
  )
}

