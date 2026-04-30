import { useEffect, useMemo, useRef, useState } from 'react'
import { analyzeAudioTiming } from '../lib/audioAnalysis'
import {
  isSpeechRecognitionSupported,
  startLiveTranscription,
  type SpeechRecognitionResult,
} from '../lib/speechRecognition'

export type RecordedAnswer = {
  blob: Blob
  url: string
  mimeType: string
  createdAt: string
  durationSec: number
  silenceRatio: number
  estimatedPauseCount: number
  transcript?: string
  transcriptConfidence?: number
}

export function AudioRecorder({
  label,
  disabled = false,
  onRecorded,
}: {
  label: string
  disabled?: boolean
  onRecorded: (rec: RecordedAnswer) => void
}) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [partial, setPartial] = useState<string>('')
  const [lastUrl, setLastUrl] = useState<string | null>(null)

  const mediaRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recStopRef = useRef<(() => void) | null>(null)
  const finalTranscriptRef = useRef<SpeechRecognitionResult | null>(null)

  const canSTT = useMemo(() => isSpeechRecognitionSupported(), [])

  useEffect(() => {
    return () => {
      if (lastUrl) URL.revokeObjectURL(lastUrl)
      try {
        mediaRef.current?.stop()
      } catch {
        // ignore
      }
      streamRef.current?.getTracks().forEach((t) => t.stop())
      recStopRef.current?.()
    }
  }, [lastUrl])

  function errToMessage(e: unknown): string {
    if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message ?? 'Error')
    return String(e ?? 'Error')
  }

  async function start() {
    if (disabled || status !== 'idle') return
    setErrMsg(null)
    setPartial('')
    finalTranscriptRef.current = null

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType =
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : 'audio/mp4'

      const rec = new MediaRecorder(stream, { mimeType })
      mediaRef.current = rec
      chunksRef.current = []

      if (canSTT) {
        recStopRef.current = startLiveTranscription({
          onPartial: (p) => setPartial(p),
          onFinal: (f) => {
            finalTranscriptRef.current = f
          },
          onError: () => {
            // ignore – checker still works without transcript
          },
        })?.stop ?? null
      }

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      rec.onstop = async () => {
        setStatus('processing')
        recStopRef.current?.()
        recStopRef.current = null
        stream.getTracks().forEach((t) => t.stop())

        const blob = new Blob(chunksRef.current, { type: rec.mimeType })
        const url = URL.createObjectURL(blob)
        if (lastUrl) URL.revokeObjectURL(lastUrl)
        setLastUrl(url)

        try {
          const timing = await analyzeAudioTiming(blob)
          const tr = finalTranscriptRef.current
          onRecorded({
            blob,
            url,
            mimeType: rec.mimeType,
            createdAt: new Date().toISOString(),
            durationSec: timing.durationSec,
            silenceRatio: timing.silenceRatio,
            estimatedPauseCount: timing.estimatedPauseCount,
            transcript: tr?.transcript,
            transcriptConfidence: tr?.confidence,
          })
          setStatus('idle')
        } catch (e: unknown) {
          setErrMsg(errToMessage(e) || 'Failed to analyze audio')
          setStatus('error')
        }
      }

      rec.start()
      setStatus('recording')
    } catch (e: unknown) {
      setErrMsg(errToMessage(e) || 'Microphone permission denied')
      setStatus('error')
    }
  }

  function stop() {
    if (status !== 'recording') return
    try {
      mediaRef.current?.stop()
    } catch {
      // ignore
    }
  }

  const busy = status === 'recording' || status === 'processing'

  return (
    <div className="rec">
      <span className="rec__label">{label}</span>
      <div className="rec__actions">
        {status !== 'recording' ? (
          <button type="button" className="btn btn--sm" onClick={start} disabled={disabled || busy}>
            Record
          </button>
        ) : (
          <button type="button" className="btn btn--sm btn--primary" onClick={stop}>
            Stop
          </button>
        )}
        {status === 'processing' && <span className="rec__hint">Processing…</span>}
        {canSTT && status === 'recording' && partial && <span className="rec__hint">Heard: {partial}</span>}
      </div>
      {errMsg && (
        <p className="inline-result" role="status">
          <strong>Recorder:</strong> {errMsg}
        </p>
      )}
      {lastUrl && (
        <audio className="rec__audio" controls src={lastUrl}>
          <track kind="captions" />
        </audio>
      )}
    </div>
  )
}

