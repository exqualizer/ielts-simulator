export type ScoreCriterion =
  | 'Fluency & Coherence'
  | 'Lexical Resource'
  | 'Grammar Range & Accuracy'
  | 'Pronunciation'

export type RawSectionScore = {
  kind: 'listening' | 'reading'
  createdAt: string
  correct: number
  total: number
  estimatedBand: number
}

export type WritingTaskScore = {
  kind: 'task1' | 'task2'
  createdAt: string
  estimatedBand: number
  wordCount: number
  criteria: Array<{ criterion: string; band: number }>
}

export type WritingSectionScore = {
  kind: 'writing'
  createdAt: string
  task1?: WritingTaskScore
  task2?: WritingTaskScore
  overallEstimatedBand: number
}

export type SpeakingQuestionScore = {
  id: string
  label: string
  createdAt: string
  durationSec: number
  transcript?: string
  criteria: Array<{ criterion: ScoreCriterion; band: number; summary: string }>
  overallBand: number
}

export type SpeakingSessionScore = {
  kind: 'speaking'
  createdAt: string
  items: SpeakingQuestionScore[]
  overallBand: number
}

export type StoredScores = {
  listening?: RawSectionScore
  reading?: RawSectionScore
  writing?: WritingSectionScore
  speaking?: SpeakingSessionScore
}

const KEY = 'ieltsSimulator:scores:v1'

export function loadScores(): StoredScores {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as StoredScores
  } catch {
    return {}
  }
}

export function saveScores(next: StoredScores) {
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function saveSpeakingSessionScore(session: SpeakingSessionScore) {
  const prev = loadScores()
  saveScores({ ...prev, speaking: session })
}

export function saveListeningScore(score: RawSectionScore) {
  const prev = loadScores()
  saveScores({ ...prev, listening: score })
}

export function saveReadingScore(score: RawSectionScore) {
  const prev = loadScores()
  saveScores({ ...prev, reading: score })
}

export function saveWritingScore(score: WritingSectionScore) {
  const prev = loadScores()
  saveScores({ ...prev, writing: score })
}

