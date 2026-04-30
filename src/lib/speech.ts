/**
 * Browser text-to-speech (Web Speech API). No server; voice depends on OS/browser.
 */

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function stopSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

function loadVoices(): SpeechSynthesisVoice[] {
  if (!window.speechSynthesis) return []
  return window.speechSynthesis.getVoices()
}

export function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices()
  if (voices.length === 0) return null
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith('en-gb')) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('en-us')) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('en')) ??
    voices[0] ??
    null
  )
}

/** Ensure voices list is populated (Chrome loads async). */
export function primeSpeechVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve([])
      return
    }
    const first = loadVoices()
    if (first.length > 0) {
      resolve(first)
      return
    }
    const handler = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler)
      resolve(loadVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', handler)
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handler)
      resolve(loadVoices())
    }, 1500)
  })
}

export type SpeakOptions = {
  rate?: number
  pitch?: number
  voice?: SpeechSynthesisVoice | null
}

/**
 * Speak chunks one after another (like short recording segments).
 */
export function speakChunksSequential(
  chunks: string[],
  opts: SpeakOptions = {},
): Promise<void> {
  const clean = chunks.map((c) => c.trim()).filter(Boolean)
  if (!isSpeechSynthesisSupported() || clean.length === 0) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    stopSpeech()
    const rate = opts.rate ?? 0.92
    const pitch = opts.pitch ?? 1
    const voice = opts.voice ?? pickEnglishVoice()

    window.requestAnimationFrame(() => {
      let i = 0
      const speakNext = () => {
        if (i >= clean.length) {
          resolve()
          return
        }
        const u = new SpeechSynthesisUtterance(clean[i])
        u.rate = rate
        u.pitch = pitch
        if (voice) u.voice = voice
        u.onend = () => {
          i += 1
          window.setTimeout(speakNext, 120)
        }
        u.onerror = () => {
          i = clean.length
          resolve()
        }
        window.speechSynthesis.speak(u)
      }
      speakNext()
    })
  })
}

export function speakText(text: string, opts: SpeakOptions = {}): Promise<void> {
  return speakChunksSequential([text], opts)
}
