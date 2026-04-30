import { pickOne } from '../lib/random'
import {
  LISTENING_ACADEMIC_TESTS,
  LISTENING_DURATION_SEC,
} from './listeningExam40'
import type { ListeningPart } from '../types'

export { LISTENING_DURATION_SEC }

const PART_TITLES = [
  'Part 1 — Everyday social context',
  'Part 2 — Monologue in a social context',
  'Part 3 — Conversation in an educational context',
  'Part 4 — Monologue on an academic subject',
] as const

export function buildRandomListeningParts(): ListeningPart[] {
  const raw = pickOne(LISTENING_ACADEMIC_TESTS)
  return raw.map((part, pi) => ({
    ...part,
    title: PART_TITLES[pi]!,
    questions: part.questions.map((q, qi) => ({
      ...q,
      id: `L${pi + 1}-Q${qi}`,
    })),
  }))
}
