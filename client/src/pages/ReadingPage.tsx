import { useMemo, useState } from 'react'
import {
  READING_DURATION_SEC,
  buildRandomReadingExam,
} from '../data/readingBank'
import { useTestTimer } from '../hooks/useTestTimer'
import { TestTimerBar } from '../components/TestTimerBar'
import type { ReadingQuestion } from '../types'
import { academicReadingRawToBand } from '../lib/ieltsBand'
import { saveReadingScore } from '../lib/scoreStore'
import { ScoreSummaryModal } from '../components/ScoreSummaryModal'

export function ReadingPage() {
  const [sessionKey, setSessionKey] = useState(0)
  const exam = useMemo(() => {
    void sessionKey
    return buildRandomReadingExam()
  }, [sessionKey])

  const allQuestions = useMemo(
    () => exam.sections.flatMap((s) => s.questions),
    [exam],
  )

  const { secondsLeft, running, start, pause, reset, startedAt, endedAt, durationSec } = useTestTimer({
    initialSeconds: READING_DURATION_SEC,
  })
  const [tfng, setTfng] = useState<Record<string, string>>({})
  const [mcq, setMcq] = useState<Record<string, number | null>>({})
  const [showResults, setShowResults] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalEndedAt, setModalEndedAt] = useState<string | null>(null)

  const examActive = running && secondsLeft > 0

  const score = useMemo(() => {
    if (!showResults) return null
    let c = 0
    let t = 0
    for (const q of allQuestions) {
      t += 1
      if (q.kind === 'tfng') {
        if ((tfng[q.id] ?? '') === q.answer) c += 1
      } else {
        if (mcq[q.id] === q.answer) c += 1
      }
    }
    return { correct: c, total: t }
  }, [allQuestions, mcq, showResults, tfng])

  function saveToScores() {
    if (!score) return
    saveReadingScore({
      kind: 'reading',
      createdAt: new Date().toISOString(),
      correct: score.correct,
      total: score.total,
      estimatedBand: academicReadingRawToBand(score.correct),
    })
  }

  function newExam() {
    if (examActive) return
    setSessionKey((k) => k + 1)
    setTfng({})
    setMcq({})
    setShowResults(false)
    setShowModal(false)
    setModalEndedAt(null)
    reset()
  }

  return (
    <article className="paper paper--reading">
      <header className="paper__head">
        <h1>Reading</h1>
        <p className="paper__meta">
          IELTS Academic format: <strong>three passages</strong>,{' '}
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

      <div className="reading-exam">
        {exam.sections.map((sec, si) => {
          const start = exam.sections
            .slice(0, si)
            .reduce((acc, s) => acc + s.questions.length, 0)
          const end = start + sec.questions.length
          return (
            <section
              key={`${sec.passage.title}-${si}`}
              className="reading-passage-block"
            >
              <h2 className="reading-passage-block__label">Passage {si + 1}</h2>
              <h3>{sec.passage.title}</h3>
              <div className="passage-body">{sec.passage.body}</div>
              <h4 className="reading-q-range">
                Questions {start + 1}–{end}
              </h4>
              <ol className="q-list" start={start + 1}>
                {sec.questions.map((q) => (
                  <li key={q.id}>
                    {q.kind === 'tfng' ? (
                      <TfngBlock
                        q={q}
                        value={tfng[q.id] ?? ''}
                        onChange={(v) =>
                          setTfng((m) => ({ ...m, [q.id]: v }))
                        }
                        show={showResults}
                      />
                    ) : (
                      <ReadingMcq
                        q={q}
                        value={mcq[q.id] ?? null}
                        onChange={(i) =>
                          setMcq((m) => ({ ...m, [q.id]: i }))
                        }
                        show={showResults}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </div>

      <div className="actions-row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            setShowResults((s) => {
              const next = !s
              if (next) {
                setModalEndedAt(new Date().toISOString())
                setShowModal(true)
              } else {
                setShowModal(false)
              }
              return next
            })
          }}
        >
          {showResults ? 'Hide results' : 'Check answers'}
        </button>
        {score && (
          <p className="score" role="status">
            Score: {score.correct} / {score.total}
          </p>
        )}
      </div>
      <ScoreSummaryModal
        open={showModal && Boolean(score)}
        onClose={() => setShowModal(false)}
        section="reading"
        startedAt={startedAt}
        endedAt={endedAt ?? modalEndedAt}
        durationSec={durationSec}
        results={
          score
            ? {
                correct: score.correct,
                total: score.total,
                estimatedBand: academicReadingRawToBand(score.correct),
              }
            : null
        }
        fallbackSave={saveToScores}
      />
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
