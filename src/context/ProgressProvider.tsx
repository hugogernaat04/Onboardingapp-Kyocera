import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { products } from '../data/products'
import { clearProgress, countPassed, loadProgress, recordScore, saveProgress } from '../lib/progress'
import { ProgressContext } from './ProgressContext'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(loadProgress)

  const recordResult = useCallback((productId: string, score: number, total: number) => {
    setProgress((prev) => {
      const next = recordScore(prev, productId, score, total)
      if (next !== prev) saveProgress(next)
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    clearProgress()
    setProgress({})
  }, [])

  const value = useMemo(() => {
    const ids = products.map((p) => p.id)
    return { progress, passedCount: countPassed(progress, ids), total: ids.length, recordResult, resetProgress }
  }, [progress, recordResult, resetProgress])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
