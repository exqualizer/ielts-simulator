import { useMemo, useState } from 'react'
import {
  LISTENING_DURATION_SEC,
  buildRandomListeningParts,
} from '../data/listeningBank'
import { TtsButton } from '../components/TtsButton'
import { useTestTimer } from '../hooks/useTestTimer'
import { TestTimerBar } from '../components/TestTimerBar'
import type { ListeningPart, ListeningQuestion } from '../types'

function normalize(s: string): string {
  return s.trim().toLowerCase()
}

function matchesGap(input: string, accepted: string[]): boolean {
  const n = normalize(input)
  return accepted.some((a) => normalize(a) === n)
}

function gapValuesFor(
  q: Extract<ListeningQuestion, { kind: 'gap' }>,
  gapValues: Record<string, string[]>,
): string[] {
  const raw = gapValues[q.id] ?? []
  return q.blanks.map((_, i) => raw[i] ?? '')
}

function chunksForPart(part: ListeningPart): string[] {
  if (part.ttsChunks && part.ttsChunks.length > 0) return part.ttsChunks
  const t = part.script.replace(/\s+/g, ' ').trim()
  return t ? [t] : []
}

export function ListeningPage() {
  const [sessionKey, setSessionKey] = useState(0)
  const listeningParts = useMemo(() => {
    void sessionKey
    return buildRandomListeningParts()
  }, [sessionKey])

  const { secondsLeft, running, start, pause, reset } = useTestTimer({
    initialSeconds: LISTENING_DURATION_SEC,
    onEnd: () => {
      setPlayedParts(new Set())
    },
  })
  const [gapValues, setGapValues] = useState<Record<string, string[]>>({})
  const [mcqChoice, setMcqChoice] = useState<Record<string, number | null>>({})
  const [showResults, setShowResults] = useState(false)
  const [playedParts, setPlayedParts] = useState<Set<number>>(() => new Set())

  const examActive = running && secondsLeft > 0

  const allQuestions = useMemo(
    () => listeningParts.flatMap((p) => p.questions),
    [listeningParts],
  )

  const score = useMemo(() => {
    if (!showResults) return null
    let correct = 0
    let total = 0
    for (const q of allQuestions) {
      if (q.kind === 'mcq') {
        total += 1
        if (mcqChoice[q.id] === q.answer) correct += 1
      } else {
        const vals = gapValuesFor(q, gapValues)
        q.blanks.forEach((accepted, i) => {
          total += 1
          if (matchesGap(vals[i] ?? '', accepted)) correct += 1
        })
      }
    }
    return { correct, total }
  }, [allQuestions, gapValues, mcqChoice, showResults])

  function newRandomTest() {
    if (examActive) return
    setSessionKey((k) => k + 1)
    setGapValues({})
    setMcqChoice({})
    setShowResults(false)
    setPlayedParts(new Set())
    reset()
  }

  return (
    <article className="paper paper--listening">
      <header className="paper__head">
        <h1>Listening</h1>
        <p className="paper__meta">
          IELTS Academic Listening format: <strong>40 questions</strong> in four
          parts (10 each), <strong>30 minutes</strong>. Transcript is hidden — use{' '}
          <strong>Play recording</strong> (browser TTS). After you press{' '}
          <strong>Start test</strong>, the timer cannot be paused or reset, and
          each part’s audio can be played only once until time is up.
        </p>
      </header>

      <TestTimerBar
        label="Test time remaining"
        totalSeconds={LISTENING_DURATION_SEC}
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
          onClick={newRandomTest}
          disabled={examActive}
        >
          New random test
        </button>
      </div>

      {secondsLeft === 0 && !running && (
        <p className="banner banner--warn" role="status">
          Time is up. You can still review and check answers below.
        </p>
      )}

      <section className="panel">
        <h2>Audio &amp; questions (1–40)</h2>
        <p className="hint">
          {examActive
            ? 'Test in progress: each recording plays once only; timer cannot be paused.'
            : 'Start the test to begin timing. After time is up, you may replay recordings to review.'}{' '}
          Model answers appear only when you use Check answers.
        </p>
        {listeningParts.map((part, partIndex) => {
          const qStart =
            listeningParts
              .slice(0, partIndex)
              .reduce((acc, p) => acc + p.questions.length, 0) + 1
          const qEnd = qStart + part.questions.length - 1
          return (
          <div key={part.title} className="part-block">
            <div className="part-block__head">
              <h3>
                {part.title}{' '}
                <span className="part-q-range">
                  (Questions {qStart}–{qEnd})
                </span>
              </h3>
              <TtsButton
                chunks={chunksForPart(part)}
                label="Play recording"
                disabled={examActive && playedParts.has(partIndex)}
                onPlayStart={() => {
                  if (examActive) {
                    setPlayedParts((prev) => new Set(prev).add(partIndex))
                  }
                }}
              />
            </div>
            <ol className="q-list" start={qStart}>
              {part.questions.map((q) => (
                <li key={q.id}>
                  {q.kind === 'mcq' ? (
                    <McqBlock
                      q={q}
                      value={mcqChoice[q.id] ?? null}
                      onChange={(i) =>
                        setMcqChoice((m) => ({ ...m, [q.id]: i }))
                      }
                      show={showResults}
                    />
                  ) : (
                    <GapBlock
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
                      show={showResults}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
          )
        })}
      </section>

      <div className="actions-row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setShowResults((s) => !s)}
        >
          {showResults ? 'Hide results' : 'Check answers'}
        </button>
        {score && (
          <p className="score" role="status">
            Score: {score.correct} / {score.total}
          </p>
        )}
      </div>
    </article>
  )
}

function McqBlock({
  q,
  value,
  onChange,
  show,
}: {
  q: Extract<ListeningQuestion, { kind: 'mcq' }>
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

function GapBlock({
  q,
  values,
  onChange,
  show,
}: {
  q: Extract<ListeningQuestion, { kind: 'gap' }>
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
                <span className="model-ans">
                  Model: {accepted.join(' / ')}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
