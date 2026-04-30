export type SpeechRecognitionResult = {
  transcript: string
  confidence?: number
}

type SpeechRecognitionAltLike = { transcript?: unknown; confidence?: unknown }
type SpeechRecognitionResultLike = {
  isFinal?: unknown
  0?: SpeechRecognitionAltLike
}
type SpeechRecognitionEventLike = {
  resultIndex?: unknown
  results?: ArrayLike<SpeechRecognitionResultLike>
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error?: unknown }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: SpeechRecognitionCtor
  webkitSpeechRecognition?: SpeechRecognitionCtor
}

function getRecognizerCtor(): SpeechRecognitionCtor | null {
  const w = window as WindowWithSpeechRecognition
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export function isSpeechRecognitionSupported(): boolean {
  return Boolean(getRecognizerCtor())
}

/**
 * Live speech-to-text (browser dependent).
 * Note: This does NOT transcribe from a saved audio Blob. It listens to the mic in real-time.
 */
export function startLiveTranscription(opts: {
  lang?: string
  onPartial?: (partial: string) => void
  onFinal?: (final: SpeechRecognitionResult) => void
  onError?: (message: string) => void
}): { stop: () => void } | null {
  const Ctor = getRecognizerCtor()
  if (!Ctor) return null

  const rec = new Ctor()
  rec.lang = opts.lang ?? 'en-US'
  rec.interimResults = true
  rec.continuous = true

  let finalTranscript = ''
  let lastConfidence: number | undefined

  rec.onresult = (event: SpeechRecognitionEventLike) => {
    let interim = ''
    const resultIndex = typeof event.resultIndex === 'number' ? event.resultIndex : 0
    const results = event.results
    const len = results ? results.length : 0
    for (let i = resultIndex; i < len; i++) {
      const r = results?.[i]
      const alt0 = r?.[0]
      const text = String(alt0?.transcript ?? '').trim()
      const conf = typeof alt0?.confidence === 'number' ? alt0.confidence : undefined
      const isFinal = Boolean(r?.isFinal)
      if (isFinal) {
        if (text) finalTranscript += (finalTranscript ? ' ' : '') + text
        if (conf != null) lastConfidence = conf
      } else {
        interim += (interim ? ' ' : '') + text
      }
    }
    if (interim) opts.onPartial?.(interim)
  }

  rec.onerror = (e: { error?: unknown }) => {
    opts.onError?.(String(e?.error ?? 'Speech recognition error'))
  }

  rec.onend = () => {
    const transcript = finalTranscript.trim()
    if (transcript) opts.onFinal?.({ transcript, confidence: lastConfidence })
  }

  try {
    rec.start()
  } catch (e: unknown) {
    const msg =
      e && typeof e === 'object' && 'message' in e
        ? String((e as { message?: unknown }).message ?? 'Failed to start speech recognition')
        : String(e ?? 'Failed to start speech recognition')
    opts.onError?.(msg)
    return null
  }

  return {
    stop: () => {
      try {
        rec.stop()
      } catch {
        // ignore
      }
    },
  }
}

