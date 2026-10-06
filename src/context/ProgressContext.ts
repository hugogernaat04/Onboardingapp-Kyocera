import { createContext } from 'react'
import type { Progress } from '../lib/progress'

export interface ProgressContextValue {
  progress: Progress
  passedCount: number
  total: number
  /** Slaat een quizresultaat op in de database. Geeft false als dat niet lukte. */
  recordResult: (productId: string, score: number) => Promise<boolean>
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
