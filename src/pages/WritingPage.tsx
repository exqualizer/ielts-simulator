import { useMemo, useState } from 'react'
import { buildRandomWritingPair } from '../data/writingBank'
import { useTestTimer } from '../hooks/useTestTimer'
import { TestTimerBar } from '../components/TestTimerBar'

const WRITING_SEC = 60 * 60

function countWords(s: string): number {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function WritingPage() {
  const [sessionKey, setSessionKey] = useState(0)
  const { task1: task1Prompt, task2: task2Prompt } = useMemo(() => {
    void sessionKey
    return buildRandomWritingPair()
  }, [sessionKey])

  const { secondsLeft, running, start, pause, reset } = useTestTimer({
    initialSeconds: WRITING_SEC,
  })
  const [task1, setTask1] = useState('')
  const [task2, setTask2] = useState('')

  const w1 = useMemo(() => countWords(task1), [task1])
  const w2 = useMemo(() => countWords(task2), [task2])

  const examActive = running && secondsLeft > 0

  function newPrompts() {
    if (examActive) return
    setSessionKey((k) => k + 1)
    setTask1('')
    setTask2('')
    reset()
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
      </div>

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
        <textarea
          className="ta"
          rows={12}
          value={task1}
          onChange={(e) => setTask1(e.target.value)}
          spellCheck
          placeholder="Your response…"
        />
      </section>

      <section className="panel">
        <h2>Task 2 — Essay</h2>
        <p className="task-prompt">{task2Prompt}</p>
        <div className="word-row">
          <span className={w2 >= 250 ? 'wc ok' : 'wc'}>Words: {w2}</span>
          {w2 < 250 && <span className="wc-hint">aim for ≥ 250</span>}
        </div>
        <textarea
          className="ta"
          rows={16}
          value={task2}
          onChange={(e) => setTask2(e.target.value)}
          spellCheck
          placeholder="Your response…"
        />
      </section>
    </article>
  )
}
