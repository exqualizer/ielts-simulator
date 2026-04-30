import type { ScoreCriterion, SpeakingQuestionScore } from './scoreStore'

export type SpeakingCheckInput = {
  id: string
  label: string
  createdAt: string
  durationSec: number
  silenceRatio: number
  estimatedPauseCount: number
  transcript?: string
  transcriptConfidence?: number
}

function roundToHalf(b: number): number {
  return Math.round(b * 2) / 2
}

function clampBand(b: number): number {
  if (!Number.isFinite(b)) return 0
  return Math.max(0, Math.min(9, b))
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function uniqueRatio(text: string): number {
  const ws = text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, ''))
    .filter(Boolean)
  if (ws.length === 0) return 0
  return new Set(ws).size / ws.length
}

const FILLERS = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'sort of', 'kind of']
function fillerRate(text: string): number {
  const t = ` ${text.toLowerCase()} `
  let hits = 0
  for (const f of FILLERS) {
    const re = new RegExp(`\\b${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
    const m = t.match(re)
    if (m) hits += m.length
  }
  const wc = countWords(text)
  return wc > 0 ? hits / wc : 0
}

function buildCriterion(criterion: ScoreCriterion, band: number, summary: string) {
  return { criterion, band: roundToHalf(clampBand(band)), summary }
}

/**
 * Practice checker for IELTS Speaking criteria.
 * Uses audio timing heuristics + optional transcript signals.
 */
export function checkSpeaking(input: SpeakingCheckInput): SpeakingQuestionScore {
  const {
    id,
    label,
    createdAt,
    durationSec,
    silenceRatio,
    estimatedPauseCount,
    transcript,
    transcriptConfidence,
  } = input

  const hasTranscript = Boolean(transcript && transcript.trim().length > 0)
  const wc = hasTranscript ? countWords(transcript!) : 0
  const wpm = hasTranscript && durationSec > 0 ? (wc / durationSec) * 60 : 0
  const ur = hasTranscript ? uniqueRatio(transcript!) : 0
  const fill = hasTranscript ? fillerRate(transcript!) : 0

  // Fluency & Coherence
  let fc = 6
  if (durationSec < 8) fc -= 1.5
  if (durationSec >= 20) fc += 0.5
  if (durationSec >= 45) fc += 0.5
  if (silenceRatio > 0.45) fc -= 1
  if (silenceRatio > 0.6) fc -= 1
  if (estimatedPauseCount >= 6) fc -= 0.5
  if (estimatedPauseCount >= 10) fc -= 0.5
  if (hasTranscript) {
    if (wpm >= 95 && wpm <= 165) fc += 0.5
    if (wpm < 75) fc -= 0.5
    if (fill > 0.03) fc -= 0.5
    if (fill > 0.06) fc -= 0.5
  }

  // Lexical Resource (transcript-based only)
  let lr = 6
  if (hasTranscript) {
    if (ur >= 0.46) lr += 0.5
    if (ur >= 0.52) lr += 0.5
    if (ur < 0.38 && wc >= 60) lr -= 0.5
    if (wc < 30) lr -= 1
  } else {
    lr = 5.5
  }

  // Grammar Range & Accuracy (very approximate via transcript length + punctuation cues)
  let gra = 6
  if (hasTranscript) {
    const complexMarkers = (transcript!.match(/\b(although|because|while|whereas|if|when|since|however|therefore)\b/gi) ?? []).length
    if (complexMarkers >= 2) gra += 0.5
    if (complexMarkers >= 5) gra += 0.5
    if (wc < 30) gra -= 1
  } else {
    gra = 5.5
  }

  // Pronunciation (proxy): recognition confidence + pause pattern
  let pron = 6
  if (typeof transcriptConfidence === 'number') {
    if (transcriptConfidence >= 0.85) pron += 0.5
    if (transcriptConfidence >= 0.92) pron += 0.5
    if (transcriptConfidence <= 0.6) pron -= 0.5
    if (transcriptConfidence <= 0.45) pron -= 0.5
  }
  if (silenceRatio > 0.55) pron -= 0.5

  fc = clampBand(fc)
  lr = clampBand(lr)
  gra = clampBand(gra)
  pron = clampBand(pron)

  const criteria = [
    buildCriterion(
      'Fluency & Coherence',
      fc,
      hasTranscript
        ? `Pace ~${Math.round(wpm)} wpm, pauses ratio ${(silenceRatio * 100).toFixed(0)}%.`
        : `Pauses ratio ${(silenceRatio * 100).toFixed(0)}% (no transcript).`,
    ),
    buildCriterion(
      'Lexical Resource',
      lr,
      hasTranscript ? `Lexical variety ${(ur * 100).toFixed(0)}% (unique-word ratio).` : 'Transcript unavailable; using timing-only estimate.',
    ),
    buildCriterion(
      'Grammar Range & Accuracy',
      gra,
      hasTranscript ? 'Estimated from linking/complex markers and response length.' : 'Transcript unavailable; using timing-only estimate.',
    ),
    buildCriterion(
      'Pronunciation',
      pron,
      typeof transcriptConfidence === 'number'
        ? `Speech recognition confidence ${(transcriptConfidence * 100).toFixed(0)}% (proxy).`
        : 'Estimated from pauses + (optional) recognition confidence.',
    ),
  ] as const

  const overallBand = roundToHalf((criteria[0].band + criteria[1].band + criteria[2].band + criteria[3].band) / 4)

  return {
    id,
    label,
    createdAt,
    durationSec,
    transcript: transcript?.trim() || undefined,
    criteria: criteria.map((c) => ({ criterion: c.criterion, band: c.band, summary: c.summary })),
    overallBand,
  }
}

