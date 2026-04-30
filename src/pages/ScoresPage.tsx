import { useMemo } from 'react'
import { loadScores, type RawSectionScore, type SpeakingSessionScore, type WritingSectionScore } from '../lib/scoreStore'
import { ACADEMIC_READING_TABLE, LISTENING_TABLE } from '../lib/ieltsBand'

const IELTS_BANDS: Array<{ band: string; label: string; note: string }> = [
  { band: '9', label: 'Expert user', note: 'Fully operational command; accurate, fluent and appropriate.' },
  { band: '8', label: 'Very good user', note: 'Very good command; occasional unsystematic inaccuracies.' },
  { band: '7', label: 'Good user', note: 'Operational command; some inaccuracies and misunderstandings in unfamiliar situations.' },
  { band: '6', label: 'Competent user', note: 'Effective command; some inappropriate usage, inaccuracies and misunderstandings.' },
  { band: '5', label: 'Modest user', note: 'Partial command; copes with overall meaning, frequent errors.' },
  { band: '4', label: 'Limited user', note: 'Basic competence limited to familiar situations; frequent breakdowns.' },
  { band: '3', label: 'Extremely limited user', note: 'Conveys and understands only general meaning in very familiar situations.' },
  { band: '2', label: 'Intermittent user', note: 'No real communication possible except basic information.' },
  { band: '1', label: 'Non user', note: 'No ability to use the language except a few isolated words.' },
  { band: '0', label: 'Did not attempt', note: 'No assessable information provided.' },
]

function avgCriterion(session: SpeakingSessionScore, idx: number): number {
  if (!session.items.length) return 0
  const v = session.items.reduce((s, it) => s + (it.criteria[idx]?.band ?? 0), 0) / session.items.length
  return Math.round(v * 2) / 2
}

function SectionScore({ s, title }: { s: RawSectionScore; title: string }) {
  return (
    <div>
      <p className="score">
        {title}: {s.correct} / {s.total} — estimated band {s.estimatedBand.toFixed(1)}
      </p>
      <p className="hint">Saved: {new Date(s.createdAt).toLocaleString()}</p>
    </div>
  )
}

function BandConversion({ title, table }: { title: string; table: Array<{ min: number; max: number; band: number }> }) {
  return (
    <details className="panel" style={{ marginTop: '0.75rem' }}>
      <summary>{title} band conversion (raw → band)</summary>
      <p className="hint" style={{ marginTop: '0.5rem' }}>
        Practice reference. Official conversions can vary slightly by test version.
      </p>
      <ul className="q-list">
        {table.map((r) => (
          <li key={`${r.min}-${r.max}-${r.band}`}>
            <strong>
              {r.min === r.max ? r.min : `${r.min}–${r.max}`}
            </strong>{' '}
            correct → <strong>Band {r.band.toFixed(1)}</strong>
          </li>
        ))}
      </ul>
    </details>
  )
}

function WritingScore({ w }: { w: WritingSectionScore }) {
  return (
    <div>
      <p className="score">Overall (Task 2 weighted): {w.overallEstimatedBand.toFixed(1)}</p>
      <p className="hint">Saved: {new Date(w.createdAt).toLocaleString()}</p>
      <div className="wcheck__grid" role="list">
        {w.task1 && (
          <div className="wcheck__card" role="listitem">
            <div className="wcheck__cardHead">
              <h3 className="wcheck__crit">Writing Task 1</h3>
              <span className="wcheck__band">{w.task1.estimatedBand.toFixed(1)}</span>
            </div>
            <p className="wcheck__summary">Words: {w.task1.wordCount}</p>
          </div>
        )}
        {w.task2 && (
          <div className="wcheck__card" role="listitem">
            <div className="wcheck__cardHead">
              <h3 className="wcheck__crit">Writing Task 2</h3>
              <span className="wcheck__band">{w.task2.estimatedBand.toFixed(1)}</span>
            </div>
            <p className="wcheck__summary">Words: {w.task2.wordCount}</p>
          </div>
        )}
      </div>
      <details className="panel" style={{ marginTop: '0.75rem' }}>
        <summary>Writing overall band calculation</summary>
        <p className="hint" style={{ marginTop: '0.5rem' }}>
          In IELTS Writing, Task 2 is typically weighted about <strong>twice</strong> as much as Task 1.
          This app uses:
        </p>
        <p className="score" style={{ marginTop: 0 }}>
          Overall = round-to-0.5((Task1 + 2×Task2) / 3)
        </p>
      </details>
    </div>
  )
}

export function ScoresPage() {
  const scores = useMemo(() => loadScores(), [])
  const speaking = scores.speaking
  const listening = scores.listening
  const reading = scores.reading
  const writing = scores.writing

  return (
    <article className="paper">
      <header className="paper__head">
        <h1>Scores</h1>
        <p className="paper__meta">
          This page shows your most recently saved practice scores. IELTS bands
          are decided by trained examiners — these checkers are guidance only.
        </p>
      </header>

      <section className="panel">
        <h2>Listening (latest saved)</h2>
        {!listening ? (
          <p className="hint">No saved listening score yet. Use Check answers, then Save to Scores page.</p>
        ) : (
          <div>
            <SectionScore s={listening} title="Listening" />
            <BandConversion title="Listening" table={LISTENING_TABLE} />
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Reading (latest saved)</h2>
        {!reading ? (
          <p className="hint">No saved reading score yet. Use Check answers, then Save to Scores page.</p>
        ) : (
          <div>
            <SectionScore s={reading} title="Academic Reading" />
            <BandConversion title="Academic Reading" table={ACADEMIC_READING_TABLE} />
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Writing (latest saved)</h2>
        {!writing ? (
          <p className="hint">No saved writing score yet. Run the checker for Task 1 + Task 2, then Save to Scores page.</p>
        ) : (
          <WritingScore w={writing} />
        )}
      </section>

      <section className="panel">
        <h2>Speaking (latest saved)</h2>
        {!speaking ? (
          <p className="hint">
            No saved speaking score yet. Finish a speaking session, then click{' '}
            <strong>Save to Scores page</strong>.
          </p>
        ) : (
          <div>
            <p className="score">Overall: {speaking.overallBand.toFixed(1)}</p>
            <p className="hint">
              Saved: {new Date(speaking.createdAt).toLocaleString()}
            </p>

            <div className="wcheck__grid" role="list">
              <div className="wcheck__card" role="listitem">
                <div className="wcheck__cardHead">
                  <h3 className="wcheck__crit">Fluency &amp; Coherence</h3>
                  <span className="wcheck__band">
                    {avgCriterion(speaking, 0).toFixed(1)}
                  </span>
                </div>
                <p className="wcheck__summary">
                  Focus on pace, reducing long pauses, and connecting ideas
                  logically.
                </p>
              </div>
              <div className="wcheck__card" role="listitem">
                <div className="wcheck__cardHead">
                  <h3 className="wcheck__crit">Lexical Resource</h3>
                  <span className="wcheck__band">
                    {avgCriterion(speaking, 1).toFixed(1)}
                  </span>
                </div>
                <p className="wcheck__summary">
                  Use varied vocabulary, paraphrase, and choose precise words.
                </p>
              </div>
              <div className="wcheck__card" role="listitem">
                <div className="wcheck__cardHead">
                  <h3 className="wcheck__crit">Grammar Range &amp; Accuracy</h3>
                  <span className="wcheck__band">
                    {avgCriterion(speaking, 2).toFixed(1)}
                  </span>
                </div>
                <p className="wcheck__summary">
                  Mix simple/complex structures while keeping accuracy stable.
                </p>
              </div>
              <div className="wcheck__card" role="listitem">
                <div className="wcheck__cardHead">
                  <h3 className="wcheck__crit">Pronunciation</h3>
                  <span className="wcheck__band">
                    {avgCriterion(speaking, 3).toFixed(1)}
                  </span>
                </div>
                <p className="wcheck__summary">
                  Work on clarity, stress/intonation, and smooth connected
                  speech.
                </p>
              </div>
            </div>

            <details className="panel" style={{ marginTop: '1rem' }}>
              <summary>
                Show recorded answers ({speaking.items.length})
              </summary>
              <ol className="q-list">
                {speaking.items.map((it) => (
                  <li key={it.id}>
                    <p className="score" style={{ marginBottom: 0 }}>
                      {it.label}: {it.overallBand.toFixed(1)} (Duration{' '}
                      {it.durationSec.toFixed(0)}s)
                    </p>
                    {it.transcript && (
                      <p className="hint" style={{ whiteSpace: 'pre-wrap' }}>
                        Transcript: {it.transcript}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </details>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>IELTS band score reference</h2>
        <p className="hint">
          Bands are reported in whole or half bands. This reference is a quick
          summary of public IELTS band labels.
        </p>
        <ul className="q-list">
          {IELTS_BANDS.map((b) => (
            <li key={b.band}>
              <strong>Band {b.band}</strong> — {b.label}.{' '}
              <span className="hint">{b.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

