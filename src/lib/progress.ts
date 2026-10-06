export const PASS_SCORE = 4

export interface ScoreRecord {
  /** Beste score tot nu toe */
  score: number
  gehaald: boolean
  /** ISO-datum van de beste poging */
  datum: string
}

/** Beste resultaat per product-id. */
export type Progress = Record<string, ScoreRecord>

export interface ResultRow {
  product_id: string
  score: number
  gehaald: boolean
  created_at: string
}

export const isPassed = (record: ScoreRecord | undefined): boolean => !!record && record.gehaald

/** Geeft nieuwe voortgang terug; bewaart alleen een betere (of eerste) score. */
export function addResult(progress: Progress, productId: string, score: number, gehaald: boolean, datum: string): Progress {
  const current = progress[productId]
  if (current && current.score >= score) {
    return gehaald && !current.gehaald ? { ...progress, [productId]: { ...current, gehaald: true } } : progress
  }
  return { ...progress, [productId]: { score, gehaald: gehaald || !!current?.gehaald, datum } }
}

/** Zet alle opgeslagen resultaten om naar het beste resultaat per product. */
export function progressFromResults(rows: ResultRow[]): Progress {
  return rows.reduce<Progress>((acc, r) => addResult(acc, r.product_id, r.score, r.gehaald, r.created_at), {})
}

export const countPassed = (progress: Progress, productIds: string[]): number =>
  productIds.filter((id) => isPassed(progress[id])).length
