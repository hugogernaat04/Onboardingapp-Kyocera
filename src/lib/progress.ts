export const STORAGE_KEY = 'kyocera-onboarding-progress-v1'
export const PASS_SCORE = 4

export interface ScoreRecord {
  /** Beste score tot nu toe */
  score: number
  total: number
  /** ISO-datum van de beste poging */
  datum: string
}

export type Progress = Record<string, ScoreRecord>

export const isPassed = (record: ScoreRecord | undefined): boolean =>
  !!record && record.score >= PASS_SCORE

const isRecord = (v: unknown): v is ScoreRecord =>
  typeof v === 'object' &&
  v !== null &&
  typeof (v as ScoreRecord).score === 'number' &&
  typeof (v as ScoreRecord).total === 'number'

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => isRecord(v)))
  } catch {
    return {}
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Opslag kan geblokkeerd zijn (privémodus); de app werkt dan zonder bewaren.
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // zie saveProgress
  }
}

/** Geeft nieuwe voortgang terug; bewaart alleen een betere (of eerste) score. */
export function recordScore(progress: Progress, productId: string, score: number, total: number): Progress {
  const current = progress[productId]
  if (current && current.score >= score) return progress
  return { ...progress, [productId]: { score, total, datum: new Date().toISOString() } }
}

export const countPassed = (progress: Progress, productIds: string[]): number =>
  productIds.filter((id) => isPassed(progress[id])).length
