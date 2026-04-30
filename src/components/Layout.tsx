import { Link, Outlet, useLocation } from 'react-router-dom'

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

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          IELTS Simulator
        </Link>
        <nav className="site-nav" aria-label="Main">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={loc.pathname === to ? 'nav-link active' : 'nav-link'}
            >
              {label}
            </Link>
          ))}
        </nav>
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
