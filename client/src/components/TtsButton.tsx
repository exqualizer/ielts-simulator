import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isSpeechSynthesisSupported,
  primeSpeechVoices,
  speakChunksSequential,
  stopSpeech,
} from '../lib/speech'

type Props = {
  chunks: string[]
  label?: string
  className?: string
  disabled?: boolean
  /** Called after the full sequence finishes (not when stopped early). */
  onDone?: () => void
  /** Called synchronously when playback is requested (before audio starts). */
  onPlayStart?: () => void
}

export function TtsButton({
  chunks,
  label = 'Play',
  className = '',
  disabled = false,
  onDone,
  onPlayStart,
}: Props) {
  const [playing, setPlaying] = useState(false)
  const mounted = useRef(true)
  const cancelledRef = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      stopSpeech()
    }
  }, [])

  const supported = isSpeechSynthesisSupported()

  const onClick = useCallback(async () => {
    if (!supported || disabled || playing || chunks.length === 0) return
    cancelledRef.current = false
    onPlayStart?.()
    setPlaying(true)
    await primeSpeechVoices()
    try {
      await speakChunksSequential(chunks, { rate: 0.9 })
      if (!cancelledRef.current) onDone?.()
    } finally {
      if (mounted.current) setPlaying(false)
    }
  }, [chunks, disabled, onDone, onPlayStart, playing, supported])

  const onStop = useCallback(() => {
    cancelledRef.current = true
    stopSpeech()
    setPlaying(false)
  }, [])

  if (!supported) {
    return (
      <span className={`tts-fallback ${className}`.trim()} title="Not supported">
        No TTS
      </span>
    )
  }

  return (
    <span className={`tts-wrap ${className}`.trim()}>
      {playing ? (
        <button type="button" className="btn btn--ghost btn--sm" onClick={onStop}>
          Stop
        </button>
      ) : (
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={onClick}
          disabled={disabled || chunks.every((c) => !c.trim())}
        >
          {label}
        </button>
      )}
    </span>
  )
}
