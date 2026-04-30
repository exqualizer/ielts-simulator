import { formatClock } from '../hooks/useTestTimer'

type Props = {
  label: string
  totalSeconds: number
  secondsLeft: number
  running: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  ended?: boolean
  /** IELTS-style: no pause or reset while the clock is running. */
  examMode?: boolean
}

export function TestTimerBar({
  label,
  totalSeconds,
  secondsLeft,
  running,
  onStart,
  onPause,
  onReset,
  ended,
  examMode = false,
}: Props) {
  const urgent = secondsLeft > 0 && secondsLeft <= 5 * 60
  const atFull = secondsLeft === totalSeconds
  const inProgress = examMode && running && secondsLeft > 0

  return (
    <div
      className={`timer-bar ${urgent ? 'timer-bar--urgent' : ''} ${ended ? 'timer-bar--ended' : ''} ${inProgress ? 'timer-bar--locked' : ''}`}
    >
      <span className="timer-bar__label">{label}</span>
      <span className="timer-bar__clock" aria-live="polite">
        {formatClock(secondsLeft)}
      </span>
      {examMode && inProgress && (
        <span className="timer-bar__lock-msg" role="status">
          Test in progress — pause and reset are disabled.
        </span>
      )}
      <div className="timer-bar__actions">
        {examMode && inProgress ? null : running ? (
          <button type="button" className="btn btn--ghost" onClick={onPause}>
            Pause
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={onStart}
            disabled={secondsLeft === 0 || ended}
          >
            {atFull ? 'Start test' : 'Resume'}
          </button>
        )}
        {examMode && inProgress ? null : (
          <button type="button" className="btn btn--ghost" onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
