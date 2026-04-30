/** Integer in [0, max) */
export function randomInt(max: number): number {
  if (max <= 0) return 0
  return Math.floor(Math.random() * max)
}

export function pickOne<T>(items: readonly T[]): T {
  return items[randomInt(items.length)]!
}

export function pickNUnique<T>(items: readonly T[], n: number): T[] {
  const copy = [...items]
  const out: T[] = []
  const count = Math.min(n, copy.length)
  for (let i = 0; i < count; i++) {
    const j = randomInt(copy.length)
    out.push(copy[j]!)
    copy.splice(j, 1)
  }
  return out
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}
