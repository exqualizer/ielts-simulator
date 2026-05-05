export type ListeningQuestion =
  | { id: string; kind: 'mcq'; prompt: string; options: string[]; answer: number }
  | {
      id: string
      kind: 'gap'
      prompt: string
      /** One accepted-answer list per blank (match any, case-insensitive) */
      blanks: string[][]
    }

export type ListeningPart = {
  title: string
  script: string
  /** Short lines read in order (simulates a recording). Falls back to whole script if omitted. */
  ttsChunks?: string[]
  questions: ListeningQuestion[]
}

export type ReadingPassage = {
  title: string
  body: string
}

export type ReadingExamSection = {
  passage: ReadingPassage
  questions: ReadingQuestion[]
}

/** Four passages, 40 questions total (IELTS Academic Reading). */
export type ReadingExam = {
  sections: ReadingExamSection[]
}

export type SpeakingPart2Cue = {
  prompt: string
  bullets: string[]
}

export type ReadingQuestion =
  | {
      id: string
      kind: 'tfng'
      statement: string
      answer: 'TRUE' | 'FALSE' | 'NOT GIVEN'
    }
  | { id: string; kind: 'mcq'; prompt: string; options: string[]; answer: number }
  | {
      id: string
      kind: 'gap'
      prompt: string
      /** One accepted-answer list per blank (match any, case-insensitive) */
      blanks: string[][]
    }
