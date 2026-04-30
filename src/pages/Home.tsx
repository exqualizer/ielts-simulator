import { Link } from 'react-router-dom'

const cards = [
  {
    to: '/listening',
    title: 'Listening',
    desc: '40 questions, 30 min, non-stop timer; one TTS play per part while the clock runs.',
    time: '30 min',
  },
  {
    to: '/reading',
    title: 'Reading',
    desc: 'Three passages, 40 questions, 60 min, non-stop timer (IELTS Academic style).',
    time: '60 min',
  },
  {
    to: '/writing',
    title: 'Writing',
    desc: 'GT Task 1 (letter) + Task 2 (essay), 60 min, non-stop timer; random prompts when not in a test.',
    time: '60 min',
  },
  {
    to: '/speaking',
    title: 'Speaking',
    desc: 'Random Part 1–3 prompts; Part 2 timers; optional TTS examiner prompts.',
    time: '~11–14 min',
  },
]

export function Home() {
  return (
    <div className="home">
      <h1>IELTS practice lab</h1>
      <p className="home__lede">
        Pick a paper to rehearse timings and question formats. This is a local
        study tool — it does not submit scores to any exam board.
      </p>
      <ul className="home-grid">
        {cards.map((c) => (
          <li key={c.to}>
            <Link to={c.to} className="home-card">
              <span className="home-card__time">{c.time}</span>
              <h2>{c.title}</h2>
              <p>{c.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
