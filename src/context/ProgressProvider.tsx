import { useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useQuery } from '../hooks/useQuery'
import { addResult, countPassed, PASS_SCORE, progressFromResults, type Progress, type ResultRow } from '../lib/progress'
import { supabase } from '../lib/supabase'
import { CatalogContext } from './CatalogContext'
import { ProgressContext } from './ProgressContext'

/** Voortgang per gebruiker, bewaard in de tabel quiz_results. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const { products } = useContext(CatalogContext)
  const [added, setAdded] = useState<{ userId: string | null; progress: Progress }>({ userId: null, progress: {} })

  const { data } = useQuery(async (): Promise<Progress> => {
    if (!userId) return {}
    // Een admin mag alle resultaten lezen; hier willen we alleen de eigen.
    const { data: rows, error } = await supabase
      .from('quiz_results')
      .select('product_id,score,gehaald,created_at')
      .eq('user_id', userId)
    if (error) throw error
    return progressFromResults((rows ?? []) as ResultRow[])
  }, [userId])

  const progress = useMemo(() => {
    const local = added.userId === userId ? added.progress : {}
    return Object.entries(local).reduce((acc, [id, r]) => addResult(acc, id, r.score, r.gehaald, r.datum), data ?? {})
  }, [data, added, userId])

  const recordResult = useCallback(
    async (productId: string, score: number) => {
      if (!userId) return false
      const gehaald = score >= PASS_SCORE
      const { error } = await supabase.from('quiz_results').insert({ user_id: userId, product_id: productId, score, gehaald })
      if (error) return false
      setAdded((prev) => {
        const base = prev.userId === userId ? prev.progress : {}
        return { userId, progress: addResult(base, productId, score, gehaald, new Date().toISOString()) }
      })
      return true
    },
    [userId],
  )

  const value = useMemo(() => {
    const ids = products.map((p) => p.id)
    return { progress, passedCount: countPassed(progress, ids), total: ids.length, recordResult }
  }, [progress, products, recordResult])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
