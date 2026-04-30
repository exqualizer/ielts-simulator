import { useEffect, useMemo, useState } from 'react'
import { TtsButton } from '../components/TtsButton'
import { AudioRecorder, type RecordedAnswer } from '../components/AudioRecorder'
import {
  PART2_PREP_SEC,
  PART2_SPEAK_SEC,
  buildRandomSpeakingSession,
} from '../data/speakingBank'
import { formatClock } from '../hooks/useTestTimer'
import { checkSpeaking } from '../lib/speakingChecker'
import {
  saveSpeakingSessionScore,
  type SpeakingQuestionScore,
  type SpeakingSessionScore,
} from '../lib/scoreStore'

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
  const [scores, setScores] = useState<Record<string, SpeakingQuestionScore>>({})

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
    setScores({})
  }

  function saveScore(id: string, label: string, rec: RecordedAnswer) {
    const item = checkSpeaking({
      id,
      label,
      createdAt: rec.createdAt,
      durationSec: rec.durationSec,
      silenceRatio: rec.silenceRatio,
      estimatedPauseCount: rec.estimatedPauseCount,
      transcript: rec.transcript,
      transcriptConfidence: rec.transcriptConfidence,
    })
    setScores((prev) => ({ ...prev, [id]: item }))
  }

  function buildSessionScore(): SpeakingSessionScore {
    const items = Object.values(scores).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    const overallBand =
      items.length === 0
        ? 0
        : Math.round(((items.reduce((s, x) => s + x.overallBand, 0) / items.length) * 2)) / 2
    return {
      kind: 'speaking',
      createdAt: new Date().toISOString(),
      items,
      overallBand,
    }
  }

  return (
    <article className="paper paper--speaking">
      <header className="paper__head">
        <h1>Speaking</h1>
        <p className="paper__meta">
          Parts 1–3 with random prompts each session. Use <strong>Play</strong> to
          hear examiner-style lines via your browser’s text-to-speech (not a
          human recording). Practise speaking aloud and record answers here. The
          checker is a practice estimate based on timing signals and (if your
          browser supports it) live speech-to-text.
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
            {session.part1.map((q, idx) => {
              const id = `p1_${idx}`
              return (
              <li key={q}>
                <span className="speak-q">{q}</span>
                <TtsButton
                  chunks={[`Question: ${q}`]}
                  label="Play"
                  className="speak-tts"
                />
                <AudioRecorder
                  label="Answer"
                  onRecorded={(rec) => saveScore(id, `Part 1 Q${idx + 1}`, rec)}
                />
                {scores[id] && <SpeakingInlineScore s={scores[id]} />}
              </li>
              )
            })}
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
          <div className="rec-block">
            <AudioRecorder
              label="Record your long turn"
              onRecorded={(rec) => saveScore('p2_long', 'Part 2 long turn', rec)}
            />
            {scores.p2_long && <SpeakingInlineScore s={scores.p2_long} />}
          </div>
        </section>
      )}

      {phase === 'part3' && (
        <section className="panel">
          <h2>Part 3 — Two-way discussion</h2>
          <p className="hint">
            Discuss in more depth. Play each question if you want an oral prompt.
          </p>
          <ol className="speak-list speak-list--audio">
            {session.part3.map((q, idx) => {
              const id = `p3_${idx}`
              return (
              <li key={q}>
                <span className="speak-q">{q}</span>
                <TtsButton
                  chunks={[`Question: ${q}`]}
                  label="Play"
                  className="speak-tts"
                />
                <AudioRecorder
                  label="Answer"
                  onRecorded={(rec) => saveScore(id, `Part 3 Q${idx + 1}`, rec)}
                />
                {scores[id] && <SpeakingInlineScore s={scores[id]} />}
              </li>
              )
            })}
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
          <div className="panel panel--accent">
            <h3>Estimated speaking band (this session)</h3>
            <p className="score">Overall: {buildSessionScore().overallBand.toFixed(1)}</p>
            <p className="hint">
              This is a practice estimate from your recordings. Use the Scores
              page to see the full breakdown.
            </p>
            <button
              type="button"
              className="btn"
              onClick={() => saveSpeakingSessionScore(buildSessionScore())}
              disabled={Object.keys(scores).length === 0}
            >
              Save to Scores page
            </button>
          </div>
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

function SpeakingInlineScore({ s }: { s: SpeakingQuestionScore }) {
  return (
    <p className="inline-result" role="status">
      <strong>Estimated band:</strong> {s.overallBand.toFixed(1)}{' '}
      <span className="tag tag--ok">FC {s.criteria[0].band.toFixed(1)}</span>{' '}
      <span className="tag tag--ok">LR {s.criteria[1].band.toFixed(1)}</span>{' '}
      <span className="tag tag--ok">GRA {s.criteria[2].band.toFixed(1)}</span>{' '}
      <span className="tag tag--ok">P {s.criteria[3].band.toFixed(1)}</span>
    </p>
  )
}
