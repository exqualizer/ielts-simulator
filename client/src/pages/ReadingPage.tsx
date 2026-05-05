import { useMemo, useState } from 'react'
import {
  READING_DURATION_SEC,
  buildRandomReadingExam,
} from '../data/readingBank'
import { useTestTimer } from '../hooks/useTestTimer'
import { TestTimerBar } from '../components/TestTimerBar'
import type { ReadingQuestion } from '../types'
import { academicReadingRawToBand } from '../lib/ieltsBand'
import { apiFetch } from '../lib/api'
import { useAuth } from '../contexts/useAuth'

function normalize(s: string): string {
  return s.trim().toLowerCase()
}

function matchesGap(input: string, accepted: string[]): boolean {
  const n = normalize(input)
  return accepted.some((a) => normalize(a) === n)
}

function gapValuesFor(
  q: Extract<ReadingQuestion, { kind: 'gap' }>,
  gapValues: Record<string, string[]>,
): string[] {
  const raw = gapValues[q.id] ?? []
  return q.blanks.map((_, i) => raw[i] ?? '')
}

export function ReadingPage() {
  const { user } = useAuth()
  const [sessionKey, setSessionKey] = useState(0)
  const exam = useMemo(() => {
    void sessionKey
    return buildRandomReadingExam()
  }, [sessionKey])

  const [activePassage, setActivePassage] = useState(0)

  const allQuestions = useMemo(
    () => exam.sections.flatMap((s) => s.questions),
    [exam],
  )

  const { secondsLeft, running, start, pause, reset, startedAt, endedAt, durationSec } = useTestTimer({
    initialSeconds: READING_DURATION_SEC,
  })
  const [tfng, setTfng] = useState<Record<string, string>>({})
  const [mcq, setMcq] = useState<Record<string, number | null>>({})
  const [gapValues, setGapValues] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)

  const examActive = running && secondsLeft > 0

  const score = useMemo(() => {
    let c = 0
    let t = 0
    for (const q of allQuestions) {
      if (q.kind === 'tfng') {
        t += 1
        if ((tfng[q.id] ?? '') === q.answer) c += 1
      } else if (q.kind === 'mcq') {
        t += 1
        if (mcq[q.id] === q.answer) c += 1
      } else {
        const vals = gapValuesFor(q, gapValues)
        q.blanks.forEach((accepted, i) => {
          t += 1
          if (matchesGap(vals[i] ?? '', accepted)) c += 1
        })
      }
    }
    return { correct: c, total: t }
  }, [allQuestions, gapValues, mcq, tfng])

  function newExam() {
    if (examActive) return
    setSessionKey((k) => k + 1)
    setActivePassage(0)
    setTfng({})
    setMcq({})
    setGapValues({})
    setSubmitting(false)
    setSubmitStatus(null)
    reset()
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
    setSubmitting(true)
    try {
      const results = {
        correct: score.correct,
        total: score.total,
        estimatedBand: academicReadingRawToBand(score.correct),
      }
      await apiFetch('/api/sessions', {
        method: 'POST',
        json: {
          section: 'reading',
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

  const activeSection = exam.sections[activePassage] ?? exam.sections[0]
  const activeStartIndex = useMemo(() => {
    return exam.sections
      .slice(0, activePassage)
      .reduce((acc, s) => acc + s.questions.length, 0)
  }, [activePassage, exam.sections])
  const activeEndIndex = activeStartIndex + (activeSection?.questions.length ?? 0)

  return (
    <article className="paper paper--reading">
      <header className="paper__head">
        <h1>Reading</h1>
        <p className="paper__meta">
          IELTS Academic format: <strong>four passages</strong>,{' '}
          <strong>40 questions</strong> in 60 minutes. After you press{' '}
          <strong>Start test</strong>, the timer cannot be paused or reset until
          it finishes.
        </p>
      </header>

      <TestTimerBar
        label="Test time remaining"
        totalSeconds={READING_DURATION_SEC}
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
          onClick={newExam}
          disabled={examActive}
        >
          New random exam
        </button>
      </div>

      {secondsLeft === 0 && !running && (
        <p className="banner banner--warn" role="status">
          Time is up. You may still check answers below.
        </p>
      )}

      <section className="panel reading-shell" aria-label="Reading passage and questions">
        <div className="reading-shell__top">
          <div className="reading-shell__tabs" role="tablist" aria-label="Passages">
            {exam.sections.map((sec, i) => (
              <button
                key={`${sec.passage.title}-${i}`}
                type="button"
                role="tab"
                aria-selected={activePassage === i}
                className={`tab ${activePassage === i ? 'tab--active' : ''}`}
                onClick={() => setActivePassage(i)}
              >
                Passage {i + 1}
              </button>
            ))}
          </div>
          <div className="reading-shell__pager">
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => setActivePassage((p) => Math.max(0, p - 1))}
              disabled={activePassage === 0}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn btn--sm"
              onClick={() =>
                setActivePassage((p) => Math.min(exam.sections.length - 1, p + 1))
              }
              disabled={activePassage >= exam.sections.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        <div className="reading-shell__grid">
          <div className="reading-shell__col reading-shell__col--questions">
            <h2 className="reading-passage-block__label" style={{ marginTop: 0 }}>
              Questions {activeStartIndex + 1}–{activeEndIndex}
            </h2>
            <ol className="q-list" start={activeStartIndex + 1}>
              {(activeSection?.questions ?? []).map((q) => (
                <li key={q.id}>
                  {q.kind === 'tfng' ? (
                    <TfngBlock
                      q={q}
                      value={tfng[q.id] ?? ''}
                      onChange={(v) => setTfng((m) => ({ ...m, [q.id]: v }))}
                      show={false}
                    />
                  ) : q.kind === 'mcq' ? (
                    <ReadingMcq
                      q={q}
                      value={mcq[q.id] ?? null}
                      onChange={(i) => setMcq((m) => ({ ...m, [q.id]: i }))}
                      show={false}
                    />
                  ) : (
                    <ReadingGapBlock
                      q={q}
                      values={gapValuesFor(q, gapValues)}
                      onChange={(idx, v) => {
                        setGapValues((g) => {
                          const prev = gapValuesFor(q, g)
                          const next = [...prev]
                          next[idx] = v
                          return { ...g, [q.id]: next }
                        })
                      }}
                      show={false}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>

          <aside className="reading-shell__col reading-shell__col--passage" aria-label="Passage text">
            <div className="reading-passage">
              <h2 className="reading-passage__label" style={{ marginTop: 0 }}>
                Passage {activePassage + 1}
              </h2>
              <h3 className="reading-passage__title">{activeSection?.passage.title}</h3>
              <div className="passage-body">{activeSection?.passage.body}</div>
            </div>
          </aside>
        </div>
      </section>

      <div className="actions-row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => void completeTest()}
          disabled={submitting}
        >
          {submitting ? 'Completing…' : 'Complete test'}
        </button>
        <p className="score" role="status">
          Progress: {score.correct} / {score.total}
        </p>
      </div>
      {submitStatus && (
        <p className="banner banner--warn" role="status">
          {submitStatus}
        </p>
      )}
    </article>
  )
}

function TfngBlock({
  q,
  value,
  onChange,
  show,
}: {
  q: Extract<ReadingQuestion, { kind: 'tfng' }>
  value: string
  onChange: (v: string) => void
  show: boolean
}) {
  const opts = ['TRUE', 'FALSE', 'NOT GIVEN'] as const
  return (
    <fieldset className="fieldset">
      <legend>{q.statement}</legend>
      {opts.map((o) => (
        <label key={o} className="radio-row">
          <input
            type="radio"
            name={q.id}
            checked={value === o}
            onChange={() => onChange(o)}
          />
          <span>{o}</span>
          {show && o === q.answer && <span className="tag tag--ok">model</span>}
        </label>
      ))}
      {show && value && value !== q.answer && (
        <p className="inline-result tag tag--bad">Your answer: {value}</p>
      )}
    </fieldset>
  )
}

function ReadingMcq({
  q,
  value,
  onChange,
  show,
}: {
  q: Extract<ReadingQuestion, { kind: 'mcq' }>
  value: number | null
  onChange: (i: number) => void
  show: boolean
}) {
  return (
    <fieldset className="fieldset">
      <legend>{q.prompt}</legend>
      {q.options.map((opt, i) => {
        const isModel = i === q.answer
        const pickedWrong = show && value === i && !isModel
        return (
          <label key={opt} className="radio-row">
            <input
              type="radio"
              name={q.id}
              checked={value === i}
              onChange={() => onChange(i)}
            />
            <span>{opt}</span>
            {show && isModel && <span className="tag tag--ok">model</span>}
            {pickedWrong && <span className="tag tag--bad">your answer</span>}
          </label>
        )
      })}
    </fieldset>
  )
}

function ReadingGapBlock({
  q,
  values,
  onChange,
  show,
}: {
  q: Extract<ReadingQuestion, { kind: 'gap' }>
  values: string[]
  onChange: (idx: number, v: string) => void
  show: boolean
}) {
  return (
    <div className="gap-block">
      <p>{q.prompt}</p>
      <div className="gap-inputs">
        {q.blanks.map((accepted, i) => {
          const ok = matchesGap(values[i] ?? '', accepted)
          return (
            <label key={i} className="gap-label">
              <span className="sr-only">Blank {i + 1}</span>
              <input
                type="text"
                className={`input ${show ? (ok ? 'input--ok' : 'input--bad') : ''}`}
                value={values[i] ?? ''}
                onChange={(e) => onChange(i, e.target.value)}
                autoComplete="off"
              />
              {show && (
                <span className="model-ans">Model: {accepted.join(' / ')}</span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
