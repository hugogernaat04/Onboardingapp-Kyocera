import { createContext } from 'react'
import type { Taal } from '../data/products'
import type { TranslationKey } from './translations'

export interface LanguageContextValue {
  taal: Taal
  setTaal: (taal: Taal) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
