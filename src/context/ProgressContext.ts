import { createContext } from 'react'
import type { Progress } from '../lib/progress'

export interface ProgressContextValue {
  progress: Progress
  passedCount: number
  total: number
  recordResult: (productId: string, score: number, total: number) => void
  resetProgress: () => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)
