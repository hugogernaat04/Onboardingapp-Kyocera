import { useCallback, useEffect, useRef, useState } from 'react'

export interface QueryState<T> {
  data: T | undefined
  error: Error | undefined
  loading: boolean
  reload: () => void
}

/** Haalt asynchroon data op en haalt die opnieuw op als `key` verandert of `reload()` wordt aangeroepen. */
export function useQuery<T>(fn: () => Promise<T>, key: readonly unknown[]): QueryState<T> {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState<{ token: string; data?: T; error?: Error }>()
  const fnRef = useRef(fn)
  useEffect(() => {
    fnRef.current = fn
  })
  const token = `${JSON.stringify(key)}#${reloadCount}`

  useEffect(() => {
    let cancelled = false
    fnRef
      .current()
      .then((data) => {
        if (!cancelled) setResult({ token, data })
      })
      .catch((e: unknown) => {
        if (!cancelled) setResult({ token, error: e instanceof Error ? e : new Error(String(e)) })
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const reload = useCallback(() => setReloadCount((c) => c + 1), [])
  const current = result?.token === token
  return { data: result?.data, error: current ? result?.error : undefined, loading: !current, reload }
}
