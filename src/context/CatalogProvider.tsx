import { useMemo, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useQuery } from '../hooks/useQuery'
import type { Product } from '../lib/catalog'
import { fetchPublishedProducts } from '../lib/catalogApi'
import { CatalogContext } from './CatalogContext'

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const { data, error, loading, reload } = useQuery(
    () => (userId ? fetchPublishedProducts() : Promise.resolve<Product[]>([])),
    [userId],
  )
  const value = useMemo(
    () => ({ products: data ?? [], loading: loading && !!userId, error: !!error, reload }),
    [data, error, loading, userId, reload],
  )
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
