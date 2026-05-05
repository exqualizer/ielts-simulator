import { useMemo, useState } from 'react'
import { buildRandomWritingPair } from '../data/writingBank'
import { useTestTimer } from '../hooks/useTestTimer'
import { TestTimerBar } from '../components/TestTimerBar'
import { checkWriting, type WritingCheckResult } from '../lib/writingChecker'
import { weightedWritingOverall } from '../lib/ieltsBand'
import { apiFetch } from '../lib/api'
import { useAuth } from '../contexts/useAuth'

const WRITING_SEC = 60 * 60

function countWords(s: string): number {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function WritingPage() {
  const { user } = useAuth()
  const [sessionKey, setSessionKey] = useState(0)
  const { task1: task1Prompt, task2: task2Prompt } = useMemo(() => {
    void sessionKey
    return buildRandomWritingPair()
  }, [sessionKey])

  const { secondsLeft, running, start, pause, reset, startedAt, endedAt, durationSec } = useTestTimer({
    initialSeconds: WRITING_SEC,
  })
  const [task1, setTask1] = useState('')
  const [task2, setTask2] = useState('')
  const [result1, setResult1] = useState<WritingCheckResult | null>(null)
  const [result2, setResult2] = useState<WritingCheckResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)

  const w1 = useMemo(() => countWords(task1), [task1])
  const w2 = useMemo(() => countWords(task2), [task2])

  const examActive = running && secondsLeft > 0

  function newPrompts() {
    if (examActive) return
    setSessionKey((k) => k + 1)
    setTask1('')
    setTask2('')
    setResult1(null)
    setResult2(null)
    setSubmitting(false)
    setSubmitStatus(null)
    reset()
  }

  function runCheckTask1() {
    setResult1(checkWriting('task1', task1))
  }

  function runCheckTask2() {
    setResult2(checkWriting('task2', task2))
  }

  function runCheckBoth() {
    setResult1(checkWriting('task1', task1))
    setResult2(checkWriting('task2', task2))
    setSubmitStatus(null)
  }

  async function completeTest() {
    setSubmitStatus(null)
    if (!user) {
      setSubmitStatus('Please login to save your result. Then view it on the Scores page.')
      return
    }
    if (!startedAt) {
      setSubmitStatus('Start the test first so time can be recorded.')
      return
    }
    if (!result1 || !result2) {
      setSubmitStatus('Run the checker for Task 1 + Task 2 first.')
      return
    }

    setSubmitting(true)
    try {
      const results = {
        task1Band: result1.estimatedOverallBand,
        task2Band: result2.estimatedOverallBand,
        overallBand: weightedWritingOverall(result1.estimatedOverallBand, result2.estimatedOverallBand),
        task1WordCount: result1.wordCount,
        task2WordCount: result2.wordCount,
      }
      await apiFetch('/api/sessions', {
        method: 'POST',
        json: {
          section: 'writing',
          startedAt,
          endedAt: endedAt ?? new Date().toISOString(),
          durationSec,
          results,
        },
      })
      setSubmitStatus('Completed. View your saved score on the Scores page.')
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message?: unknown }).message ?? 'Failed to save.')
          : 'Failed to save.'
      setSubmitStatus(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <article className="paper paper--writing">
      <header className="paper__head">
        <h1>Writing</h1>
        <p className="paper__meta">
          IELTS <strong>General Training</strong> Writing: <strong>Task 1</strong>{' '}
          — letter (≥150 words); <strong>Task 2</strong> — essay (≥250 words);{' '}
          <strong>60 minutes</strong> total.
          After <strong>Start test</strong>, the timer cannot be paused or reset
          until it finishes. Prompts are random — use New random prompts only
          before or after a test.
        </p>
      </header>

      <p className="banner banner--warn" role="note">
        Writing “checker” is a <strong>practice rubric</strong> based on IELTS
        criteria (Task Achievement/Response, Coherence &amp; Cohesion, Lexical
        Resource, Grammar Range &amp; Accuracy). It uses simple signals (word
        count, structure, cohesion markers, quick error flags), so treat it as
        guidance — not an official score.
      </p>

      <TestTimerBar
        label="Test time remaining"
        totalSeconds={WRITING_SEC}
        secondsLeft={secondsLeft}
        running={running}
        onStart={start}
        onPause={pause}
        onReset={reset}
        ended={secondsLeft === 0}
        examMode
      />
      <div className="actions-row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={newPrompts}
          disabled={examActive}
        >
          New random prompts
        </button>
        <button
          type="button"
          className="btn"
          onClick={runCheckBoth}
          disabled={task1.trim().length === 0 && task2.trim().length === 0}
        >
          Check writing (Task 1 + Task 2)
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => void completeTest()}
          disabled={submitting || !result1 || !result2}
        >
          {submitting ? 'Completing…' : 'Complete test'}
        </button>
      </div>
      {submitStatus && (
        <p className="banner banner--warn" role="status">
          {submitStatus}
        </p>
      )}

      {secondsLeft === 0 && !running && (
        <p className="banner banner--warn" role="status">
          Time is up — editing is still allowed for review in this practice app.
        </p>
      )}

      <section className="panel">
        <h2>Task 1 — Letter</h2>
        <p className="task-prompt">{task1Prompt}</p>
        <div className="word-row">
          <span className={w1 >= 150 ? 'wc ok' : 'wc'}>Words: {w1}</span>
          {w1 < 150 && <span className="wc-hint">aim for ≥ 150</span>}
        </div>
        <div className="actions-row">
          <button type="button" className="btn" onClick={runCheckTask1} disabled={task1.trim().length === 0}>
            Check Task 1
          </button>
        </div>
        <textarea
          className="ta"
          rows={12}
          value={task1}
          onChange={(e) => setTask1(e.target.value)}
          spellCheck
          placeholder="Your response…"
        />
        {result1 && <WritingResult kindLabel="Task 1" r={result1} />}
      </section>

      <section className="panel">
        <h2>Task 2 — Essay</h2>
        <p className="task-prompt">{task2Prompt}</p>
        <div className="word-row">
          <span className={w2 >= 250 ? 'wc ok' : 'wc'}>Words: {w2}</span>
          {w2 < 250 && <span className="wc-hint">aim for ≥ 250</span>}
        </div>
        <div className="actions-row">
          <button type="button" className="btn" onClick={runCheckTask2} disabled={task2.trim().length === 0}>
            Check Task 2
          </button>
        </div>
        <textarea
          className="ta"
          rows={16}
          value={task2}
          onChange={(e) => setTask2(e.target.value)}
          spellCheck
          placeholder="Your response…"
        />
        {result2 && <WritingResult kindLabel="Task 2" r={result2} />}
      </section>
    </article>
  )
}

function WritingResult({ kindLabel, r }: { kindLabel: string; r: WritingCheckResult }) {
  return (
    <section className="wcheck" aria-label={`${kindLabel} writing checker results`}>
      <header className="wcheck__head">
        <h3 className="wcheck__title">{kindLabel} — estimated overall band: {r.estimatedOverallBand.toFixed(1)}</h3>
        <p className="wcheck__meta">
          Words: <strong>{r.wordCount}</strong> · Paragraphs: <strong>{r.paragraphCount}</strong> · Sentences:{' '}
          <strong>{r.sentenceCount}</strong>
        </p>
      </header>

      {(r.highlights.length > 0 || r.cautions.length > 0) && (
        <div className="wcheck__split">
          {r.highlights.length > 0 && (
            <div className="wcheck__box wcheck__box--ok">
              <h4>Highlights</h4>
              <ul>
                {r.highlights.slice(0, 5).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}
          {r.cautions.length > 0 && (
            <div className="wcheck__box wcheck__box--warn">
              <h4>Fix next</h4>
              <ul>
                {r.cautions.slice(0, 6).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="wcheck__grid" role="list">
        {r.criteria.map((c) => (
          <div key={c.criterion} className="wcheck__card" role="listitem">
            <div className="wcheck__cardHead">
              <h4 className="wcheck__crit">{c.criterion}</h4>
              <span className="wcheck__band">Band {c.band.toFixed(1)}</span>
            </div>
            <p className="wcheck__summary">{c.summary}</p>
            <ul className="wcheck__tips">
              {c.feedback.slice(0, 3).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
