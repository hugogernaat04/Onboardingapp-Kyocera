import { createContext } from 'react'
import type { Product } from '../lib/catalog'

export interface CatalogContextValue {
  products: Product[]
  loading: boolean
  error: boolean
  reload: () => void
}

export const CatalogContext = createContext<CatalogContextValue>({
  products: [],
  loading: true,
  error: false,
  reload: () => {},
})
