function roundToHalf(b: number): number {
  return Math.round(b * 2) / 2
}

type Range = { min: number; max: number; band: number }

export const LISTENING_TABLE: Range[] = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 32, max: 34, band: 7.5 },
  { min: 30, max: 31, band: 7.0 },
  { min: 26, max: 29, band: 6.5 },
  { min: 23, max: 25, band: 6.0 },
  { min: 18, max: 22, band: 5.5 },
  { min: 16, max: 17, band: 5.0 },
  { min: 13, max: 15, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 8, max: 9, band: 3.5 },
  { min: 6, max: 7, band: 3.0 },
  { min: 4, max: 5, band: 2.5 },
  { min: 2, max: 3, band: 2.0 },
  { min: 1, max: 1, band: 1.0 },
  { min: 0, max: 0, band: 0.0 },
]

export const ACADEMIC_READING_TABLE: Range[] = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7.0 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6.0 },
  { min: 19, max: 22, band: 5.5 },
  { min: 15, max: 18, band: 5.0 },
  { min: 13, max: 14, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 8, max: 9, band: 3.5 },
  { min: 6, max: 7, band: 3.0 },
  { min: 4, max: 5, band: 2.5 },
  { min: 0, max: 3, band: 2.0 },
]

function bandFromTable(correct: number, table: Range[]): number {
  const c = Math.max(0, Math.min(40, Math.floor(correct)))
  const r = table.find((x) => c >= x.min && c <= x.max)
  return r ? r.band : 0
}

export function listeningRawToBand(correct: number): number {
  return bandFromTable(correct, LISTENING_TABLE)
}

export function academicReadingRawToBand(correct: number): number {
  return bandFromTable(correct, ACADEMIC_READING_TABLE)
}

/** Writing overall typically weights Task 2 twice as much as Task 1. */
export function weightedWritingOverall(task1Band: number, task2Band: number): number {
  return roundToHalf((task1Band + 2 * task2Band) / 3)
}

