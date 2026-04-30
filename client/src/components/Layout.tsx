import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/listening', label: 'Listening' },
  { to: '/reading', label: 'Reading' },
  { to: '/writing', label: 'Writing' },
  { to: '/speaking', label: 'Speaking' },
  { to: '/scores', label: 'Scores' },
]

export function Layout() {
  const loc = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          IELTS Simulator
        </Link>
        <nav className="site-nav" aria-label="Main">
          {user &&
            nav.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={loc.pathname === to ? 'nav-link active' : 'nav-link'}
              >
                {label}
              </Link>
            ))}
        </nav>
        <div className="auth-box">
          {user ? (
            <>
              <span className="auth-box__who" title={user.email}>
                {user.firstName} {user.lastName}
              </span>
              <button type="button" className="btn btn--sm" onClick={() => void logout()}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={loc.pathname === '/login' ? 'nav-link active' : 'nav-link'} to="/login">
                Login
              </Link>
              <Link className={loc.pathname === '/register' ? 'nav-link active' : 'nav-link'} to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        Practice environment — timings follow computer-delivered IELTS style
        (approximate).
      </footer>
    </div>
  )
}
