export type WritingTaskKind = 'task1' | 'task2'

export type RubricCriterion =
  | 'Task Achievement'
  | 'Task Response'
  | 'Coherence & Cohesion'
  | 'Lexical Resource'
  | 'Grammar Range & Accuracy'

export type CriterionScore = {
  criterion: RubricCriterion
  band: number
  summary: string
  feedback: string[]
}

export type WritingCheckResult = {
  kind: WritingTaskKind
  wordCount: number
  paragraphCount: number
  sentenceCount: number
  estimatedOverallBand: number
  criteria: CriterionScore[]
  highlights: string[]
  cautions: string[]
}

const CONNECTORS = [
  'however',
  'therefore',
  'moreover',
  'furthermore',
  'in addition',
  'for example',
  'for instance',
  'as a result',
  'on the other hand',
  'in contrast',
  'firstly',
  'secondly',
  'finally',
  'overall',
  'in conclusion',
  'to conclude',
  'because',
  'although',
  'while',
  'whereas',
  'since',
]

const COMMON_TYPO_FLAGS: Array<{ re: RegExp; msg: string }> = [
  { re: /\bi\b/g, msg: 'Use capital “I” when referring to yourself.' },
  { re: /\b(alot)\b/gi, msg: '“a lot” is two words.' },
  { re: /\b(cant)\b/gi, msg: 'Use apostrophes: “can’t”, “don’t”, etc.' },
  { re: /\b(dont)\b/gi, msg: 'Use apostrophes: “don’t”, “isn’t”, etc.' },
  { re: /\b(shouldnt)\b/gi, msg: 'Use apostrophes: “shouldn’t”, etc.' },
  { re: /\b(its)\b\s+(a|an|the)\b/gi, msg: 'Check “its” vs “it’s” (it is).' },
  { re: /\bthere\s+is\s+\w+\s+\w+\s+people\b/gi, msg: 'Check agreement: “there are … people”.' },
]

function roundToHalf(band: number): number {
  return Math.round(band * 2) / 2
}

function clampBand(band: number): number {
  if (!Number.isFinite(band)) return 0
  return Math.min(9, Math.max(0, band))
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function splitParagraphs(text: string): string[] {
  return text
    .trim()
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function splitSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) return []
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '')
}

function words(text: string): string[] {
  return text
    .split(/\s+/)
    .map(normalizeWord)
    .filter((w) => w.length > 0)
}

function uniqueRatio(ws: string[]): number {
  if (ws.length === 0) return 0
  const uniq = new Set(ws)
  return uniq.size / ws.length
}

function countConnectorHits(text: string): number {
  const t = ` ${text.toLowerCase()} `
  let hits = 0
  for (const c of CONNECTORS) {
    const re = new RegExp(`\\b${escapeRegExp(c)}\\b`, 'g')
    const m = t.match(re)
    if (m) hits += m.length
  }
  return hits
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function typoFlags(text: string): string[] {
  const flags: string[] = []
  for (const { re, msg } of COMMON_TYPO_FLAGS) {
    if (re.test(text)) flags.push(msg)
  }
  return Array.from(new Set(flags))
}

function estimateBandFromMetrics(opts: {
  kind: WritingTaskKind
  wordCount: number
  paragraphCount: number
  sentenceCount: number
  connectorHits: number
  uniqRatio: number
  typoFlagCount: number
  hasLetterOpening: boolean
  hasLetterClosing: boolean
}): { criteria: CriterionScore[]; overall: number; highlights: string[]; cautions: string[] } {
  const {
    kind,
    wordCount,
    paragraphCount,
    sentenceCount,
    connectorHits,
    uniqRatio: ur,
    typoFlagCount,
    hasLetterOpening,
    hasLetterClosing,
  } = opts

  const highlights: string[] = []
  const cautions: string[] = []

  const minWords = kind === 'task1' ? 150 : 250
  if (wordCount >= minWords) highlights.push(`Meets the minimum word count (≥${minWords}).`)
  else cautions.push(`Below the minimum word count (aim for ≥${minWords}).`)

  if (paragraphCount >= (kind === 'task2' ? 4 : 3)) highlights.push('Clear paragraphing.')
  else cautions.push('Add clearer paragraphing (intro/body/conclusion).')

  const connectorPer100 = wordCount > 0 ? (connectorHits / wordCount) * 100 : 0
  if (connectorPer100 >= 1.2) highlights.push('Uses linking words to guide the reader.')
  else cautions.push('Use more cohesive devices (e.g., however, therefore, for example) without overusing them.')

  if (ur >= 0.45) highlights.push('Good lexical variety (low repetition).')
  else if (wordCount >= 80) cautions.push('Some repetition — try paraphrasing and more precise word choice.')

  if (typoFlagCount === 0) highlights.push('No obvious quick-fix errors detected.')
  else cautions.push('Some quick-fix errors detected (capitalisation / apostrophes / common typos).')

  // --- Task Achievement / Task Response ---
  let taskBand = 6
  if (wordCount < minWords) taskBand -= 1.5
  if (paragraphCount <= 1) taskBand -= 1
  if (kind === 'task1') {
    if (hasLetterOpening) taskBand += 0.5
    else cautions.push('Task 1 letter: start with a clear greeting (e.g., “Dear …,”).')
    if (hasLetterClosing) taskBand += 0.5
    else cautions.push('Task 1 letter: end with a closing line (e.g., “Yours sincerely,”).')
  } else {
    // task2
    if (paragraphCount >= 4) taskBand += 0.5
    if (paragraphCount >= 5) taskBand += 0.5
  }
  taskBand = clampBand(taskBand)

  // --- Coherence & Cohesion ---
  let ccBand = 6
  if (paragraphCount >= 3) ccBand += 0.5
  if (paragraphCount >= 4) ccBand += 0.5
  if (connectorPer100 >= 1.0) ccBand += 0.5
  if (connectorPer100 < 0.6) ccBand -= 1
  if (sentenceCount > 0) {
    const avgSentLen = wordCount / sentenceCount
    if (avgSentLen < 10) cautions.push('Many very short sentences — try combining some for smoother flow.')
    if (avgSentLen > 28) cautions.push('Some sentences may be too long — consider splitting for clarity.')
  }
  ccBand = clampBand(ccBand)

  // --- Lexical Resource ---
  let lrBand = 6
  if (ur >= 0.42) lrBand += 0.5
  if (ur >= 0.48) lrBand += 0.5
  if (ur < 0.34 && wordCount >= 120) lrBand -= 1
  lrBand = clampBand(lrBand)

  // --- Grammar Range & Accuracy ---
  let graBand = 6
  if (typoFlagCount >= 3) graBand -= 1
  if (typoFlagCount >= 6) graBand -= 1
  if (sentenceCount >= 10 && wordCount / sentenceCount >= 12 && wordCount / sentenceCount <= 26) graBand += 0.5
  graBand = clampBand(graBand)

  const criteria: CriterionScore[] =
    kind === 'task1'
      ? [
          {
            criterion: 'Task Achievement',
            band: roundToHalf(taskBand),
            summary:
              wordCount < minWords
                ? 'Word count may limit achievement.'
                : 'Structure and format are reasonably aligned with a letter task.',
            feedback: [
              'Address all bullet points from the prompt explicitly.',
              'Use an appropriate tone (formal / semi-formal / informal).',
              'Include purpose early and make the request/result clear.',
            ],
          },
          {
            criterion: 'Coherence & Cohesion',
            band: roundToHalf(ccBand),
            summary: 'Based on paragraphing and cohesion signals.',
            feedback: [
              'Use clear paragraph purposes (reason → details → request/next steps).',
              'Use reference words carefully (this/these/it) to avoid ambiguity.',
            ],
          },
          {
            criterion: 'Lexical Resource',
            band: roundToHalf(lrBand),
            summary: 'Based on variety and repetition signals.',
            feedback: [
              'Prefer specific verbs (request, apologise, arrange, resolve) over generic ones (do, make).',
              'Avoid repeating the same nouns/verbs in consecutive sentences.',
            ],
          },
          {
            criterion: 'Grammar Range & Accuracy',
            band: roundToHalf(graBand),
            summary: 'Based on quick error flags and sentence-length balance.',
            feedback: [
              'Mix simple and complex sentences (because/although/while).',
              'Check articles (a/an/the) and subject–verb agreement.',
            ],
          },
        ]
      : [
          {
            criterion: 'Task Response',
            band: roundToHalf(taskBand),
            summary:
              wordCount < minWords
                ? 'Word count may limit response depth.'
                : 'Based on structure signals (intro/body/conclusion) and length.',
            feedback: [
              'Answer every part of the question (e.g., discuss both views + your opinion).',
              'State your position clearly and maintain it throughout.',
              'Use specific examples (realistic, concise).',
            ],
          },
          {
            criterion: 'Coherence & Cohesion',
            band: roundToHalf(ccBand),
            summary: 'Based on paragraphing and cohesion signals.',
            feedback: [
              'Aim for 4–5 paragraphs: intro, 2 body paragraphs, conclusion.',
              'Use topic sentences and logical progression within each paragraph.',
            ],
          },
          {
            criterion: 'Lexical Resource',
            band: roundToHalf(lrBand),
            summary: 'Based on variety and repetition signals.',
            feedback: [
              'Paraphrase key terms from the prompt in the introduction.',
              'Use precise collocations (e.g., “public transport network”, “car dependency”).',
            ],
          },
          {
            criterion: 'Grammar Range & Accuracy',
            band: roundToHalf(graBand),
            summary: 'Based on quick error flags and sentence-length balance.',
            feedback: [
              'Use a mix of complex forms (relative clauses, conditionals) accurately.',
              'Proofread for basic errors: apostrophes, agreement, punctuation.',
            ],
          },
        ]

  // Overall band as a simple average of criteria (IELTS uses whole/half bands in practice).
  const overall = roundToHalf(
    criteria.reduce((sum, c) => sum + c.band, 0) / Math.max(1, criteria.length),
  )

  return { criteria, overall, highlights, cautions }
}

function detectLetterOpening(text: string): boolean {
  const t = text.trim().toLowerCase()
  if (!t) return false
  return t.startsWith('dear ') || t.startsWith('dear,') || t.startsWith('dear\n')
}

function detectLetterClosing(text: string): boolean {
  const t = text.toLowerCase()
  return /\b(yours sincerely|yours faithfully|kind regards|best regards|yours truly)\b/.test(t)
}

export function checkWriting(kind: WritingTaskKind, text: string): WritingCheckResult {
  const wc = countWords(text)
  const paras = splitParagraphs(text)
  const sents = splitSentences(text)
  const ws = words(text)
  const ur = uniqueRatio(ws)
  const connectorHits = countConnectorHits(text)
  const flags = typoFlags(text)

  const hasLetterOpening = detectLetterOpening(text)
  const hasLetterClosing = detectLetterClosing(text)

  const { criteria, overall, highlights, cautions } = estimateBandFromMetrics({
    kind,
    wordCount: wc,
    paragraphCount: paras.length,
    sentenceCount: sents.length,
    connectorHits,
    uniqRatio: ur,
    typoFlagCount: flags.length,
    hasLetterOpening,
    hasLetterClosing,
  })

  const minWords = kind === 'task1' ? 150 : 250
  const highlightsOut = [...highlights]
  const cautionsOut = [...cautions]

  if (flags.length > 0) {
    cautionsOut.push(...flags.slice(0, 4))
  }

  if (wc > 0 && wc < minWords) {
    cautionsOut.push('Note: being under the minimum word count can cap your band score in real IELTS marking.')
  }

  return {
    kind,
    wordCount: wc,
    paragraphCount: paras.length,
    sentenceCount: sents.length,
    estimatedOverallBand: overall,
    criteria,
    highlights: highlightsOut,
    cautions: Array.from(new Set(cautionsOut)),
  }
}

