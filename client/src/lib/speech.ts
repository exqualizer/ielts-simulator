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

function pickEnglishVoices(max: number): SpeechSynthesisVoice[] {
  const voices = loadVoices()
  if (voices.length === 0 || max <= 0) return []

  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  const gb = en.filter((v) => v.lang.toLowerCase().startsWith('en-gb'))
  const us = en.filter((v) => v.lang.toLowerCase().startsWith('en-us'))
  const pool = [...gb, ...us, ...en, ...voices]

  const out: SpeechSynthesisVoice[] = []
  const seen = new Set<string>()
  for (const v of pool) {
    const key = `${v.name}::${v.lang}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(v)
    if (out.length >= max) break
  }
  return out
}

function parseSpeakerPrefix(raw: string): { speaker: string | null; spokenText: string } {
  const s = raw.trim()
  const m = s.match(/^([A-Za-z][A-Za-z0-9 ]{0,20}):\s*(.+)$/)
  if (!m) return { speaker: null, spokenText: s }
  const speaker = m[1]?.trim() || null
  const spokenText = (m[2] ?? '').trim()
  if (!speaker || !spokenText) return { speaker: null, spokenText: s }
  return { speaker, spokenText }
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
    const fallbackVoice = opts.voice ?? pickEnglishVoice()

    // If the chunks contain multiple speakers (e.g. "Staff:" / "Caller:"),
    // automatically assign different voices per speaker.
    const parsed = clean.map((c) => ({ raw: c, ...parseSpeakerPrefix(c) }))
    const speakers = Array.from(
      new Set(parsed.map((p) => p.speaker).filter((x): x is string => Boolean(x))),
    )
    const useMultiVoice = !opts.voice && speakers.length >= 2
    const voicePool = useMultiVoice ? pickEnglishVoices(Math.min(4, speakers.length)) : []
    const speakerToIdx = new Map<string, number>()
    speakers.forEach((sp, idx) => speakerToIdx.set(sp, idx))

    window.requestAnimationFrame(() => {
      let i = 0
      const speakNext = () => {
        if (i >= parsed.length) {
          resolve()
          return
        }
        const cur = parsed[i]!
        const u = new SpeechSynthesisUtterance(cur.spokenText)
        u.rate = rate
        u.pitch = pitch
        if (useMultiVoice && cur.speaker) {
          const idx = speakerToIdx.get(cur.speaker) ?? 0
          const v = voicePool[idx] ?? fallbackVoice
          if (v) u.voice = v
          // If we couldn't find different voices, vary pitch slightly.
          if (!voicePool[idx] && speakers.length >= 2) {
            u.pitch = 0.92 + (idx % 3) * 0.12
          }
        } else if (fallbackVoice) {
          u.voice = fallbackVoice
        }
        u.onend = () => {
          i += 1
          window.setTimeout(speakNext, 120)
        }
        u.onerror = () => {
          i = parsed.length
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
