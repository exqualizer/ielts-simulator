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
          queueMicrotask(() => onEndRef.current?.())
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => {
    setRunning(false)
    setSecondsLeft(initialSeconds)
  }, [initialSeconds])

  return { secondsLeft, running, start, pause, reset }
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
