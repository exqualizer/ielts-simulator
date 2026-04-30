import { useEffect, useMemo, useState } from 'react'
import { TtsButton } from '../components/TtsButton'
import {
  PART2_PREP_SEC,
  PART2_SPEAK_SEC,
  buildRandomSpeakingSession,
} from '../data/speakingBank'
import { formatClock } from '../hooks/useTestTimer'

type Phase =
  | 'intro'
  | 'part1'
  | 'part2_card'
  | 'part2_prep'
  | 'part2_long'
  | 'part3'
  | 'done'

function part2IntroChunks(prompt: string, bullets: string[]): string[] {
  return [
    'Part two. I would like you to speak for one to two minutes.',
    prompt,
    ...bullets.map((b) => `You should say: ${b}`),
    'You have one minute to prepare. You can make notes.',
  ]
}

function part2CueOnlyChunks(prompt: string, bullets: string[]): string[] {
  return [prompt, ...bullets.map((b) => `Point on the card: ${b}`)]
}

export function SpeakingPage() {
  const [sessionKey, setSessionKey] = useState(0)
  const session = useMemo(() => {
    void sessionKey
    return buildRandomSpeakingSession()
  }, [sessionKey])

  const [phase, setPhase] = useState<Phase>('intro')
  const [prepLeft, setPrepLeft] = useState(PART2_PREP_SEC)
  const [longLeft, setLongLeft] = useState(PART2_SPEAK_SEC)

  useEffect(() => {
    if (phase !== 'part2_prep' && phase !== 'part2_long') return
    const tick =
      phase === 'part2_prep'
        ? () =>
            setPrepLeft((s) => {
              if (s <= 1) {
                queueMicrotask(() => setPhase('part2_long'))
                return 0
              }
              return s - 1
            })
        : () =>
            setLongLeft((s) => {
              if (s <= 1) {
                queueMicrotask(() => setPhase('part3'))
                return 0
              }
              return s - 1
            })
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [phase])

  function startPrep() {
    setPrepLeft(PART2_PREP_SEC)
    setLongLeft(PART2_SPEAK_SEC)
    setPhase('part2_prep')
  }

  function resetSimulator() {
    setSessionKey((k) => k + 1)
    setPhase('intro')
    setPrepLeft(PART2_PREP_SEC)
    setLongLeft(PART2_SPEAK_SEC)
  }

  return (
    <article className="paper paper--speaking">
      <header className="paper__head">
        <h1>Speaking</h1>
        <p className="paper__meta">
          Parts 1–3 with random prompts each session. Use <strong>Play</strong> to
          hear examiner-style lines via your browser’s text-to-speech (not a
          human recording). Practise speaking aloud; use a voice memo app if you
          want to record yourself.
        </p>
      </header>

      {phase === 'intro' && (
        <section className="panel">
          <h2>Before you begin</h2>
          <ul className="bullets">
            <li>Find a quiet space; imagine introducing yourself to an examiner.</li>
            <li>Part 1: short answers on familiar topics.</li>
            <li>
              Part 2: cue card, prepare for 1 minute, then speak for up to 2
              minutes.
            </li>
            <li>Part 3: more abstract discussion.</li>
          </ul>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setPhase('part1')}
          >
            Start Part 1
          </button>
        </section>
      )}

      {phase === 'part1' && (
        <section className="panel">
          <h2>Part 1 — Introduction &amp; interview</h2>
          <p className="hint">
            Answer aloud in a few sentences each. Tap Play to hear the question
            like an examiner prompt.
          </p>
          <ol className="speak-list speak-list--audio">
            {session.part1.map((q) => (
              <li key={q}>
                <span className="speak-q">{q}</span>
                <TtsButton
                  chunks={[`Question: ${q}`]}
                  label="Play"
                  className="speak-tts"
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setPhase('part2_card')}
          >
            Continue to Part 2
          </button>
        </section>
      )}

      {phase === 'part2_card' && (
        <section className="panel">
          <h2>Part 2 — Long turn (cue card)</h2>
          <div className="cue-card">
            <p className="cue-card__lead">{session.part2.prompt}</p>
            <ul>
              {session.part2.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="actions-row">
            <TtsButton
              chunks={part2IntroChunks(
                session.part2.prompt,
                session.part2.bullets,
              )}
              label="Play examiner instructions"
            />
          </div>
          <p className="hint">
            When you are ready, start the preparation timer. You may take notes
            on paper.
          </p>
          <button type="button" className="btn btn--primary" onClick={startPrep}>
            Start preparation ({PART2_PREP_SEC / 60} minute)
          </button>
        </section>
      )}

      {phase === 'part2_prep' && (
        <section className="panel panel--accent">
          <h2>Preparation</h2>
          <p className="big-clock" aria-live="polite">
            {formatClock(prepLeft)}
          </p>
          <p>You can make notes. When the timer ends, the long turn begins.</p>
        </section>
      )}

      {phase === 'part2_long' && (
        <section className="panel panel--accent">
          <h2>Long turn — speak now</h2>
          <p className="big-clock" aria-live="polite">
            {formatClock(longLeft)}
          </p>
          <div className="cue-card cue-card--muted">
            <p className="cue-card__lead">{session.part2.prompt}</p>
            <ul>
              {session.part2.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <TtsButton
            chunks={part2CueOnlyChunks(
              session.part2.prompt,
              session.part2.bullets,
            )}
            label="Replay cue"
          />
        </section>
      )}

      {phase === 'part3' && (
        <section className="panel">
          <h2>Part 3 — Two-way discussion</h2>
          <p className="hint">
            Discuss in more depth. Play each question if you want an oral prompt.
          </p>
          <ol className="speak-list speak-list--audio">
            {session.part3.map((q) => (
              <li key={q}>
                <span className="speak-q">{q}</span>
                <TtsButton
                  chunks={[`Question: ${q}`]}
                  label="Play"
                  className="speak-tts"
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setPhase('done')}
          >
            Finish session
          </button>
        </section>
      )}

      {phase === 'done' && (
        <section className="panel">
          <h2>Session complete</h2>
          <p>
            Reset to draw a new random set of Part 1 topics, a new cue card, and
            new Part 3 questions.
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={resetSimulator}
          >
            New random speaking set
          </button>
        </section>
      )}
    </article>
  )
}
