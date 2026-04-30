import { useCallback, useEffect, useRef, useState } from 'react'

type Options = {
  initialSeconds: number
  autoStart?: boolean
  onEnd?: () => void
}

export function useTestTimer({
  initialSeconds,
  autoStart = false,
  onEnd,
}: Options) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [running, setRunning] = useState(autoStart)
  const [startedAt, setStartedAt] = useState<string | null>(autoStart ? new Date().toISOString() : null)
  const [endedAt, setEndedAt] = useState<string | null>(null)
  const onEndRef = useRef(onEnd)

  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          setEndedAt(new Date().toISOString())
          queueMicrotask(() => onEndRef.current?.())
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  const start = useCallback(() => {
    setStartedAt((prev) => prev ?? new Date().toISOString())
    setEndedAt(null)
    setRunning(true)
  }, [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => {
    setRunning(false)
    setSecondsLeft(initialSeconds)
    setStartedAt(null)
    setEndedAt(null)
  }, [initialSeconds])

  const durationSec = initialSeconds - secondsLeft

  return { secondsLeft, running, start, pause, reset, startedAt, endedAt, durationSec, initialSeconds }
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
