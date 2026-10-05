import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { talen, type Taal } from '../data/products'
import { LanguageContext } from './LanguageContext'
import { dictionaries, type TranslationKey } from './translations'

export const LANGUAGE_KEY = 'kyocera-onboarding-language-v1'

function loadLanguage(): Taal {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    if (stored && (talen as readonly string[]).includes(stored)) return stored as Taal
  } catch {
    // opslag geblokkeerd: val terug op de standaardtaal
  }
  return 'nl'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [taal, setTaalState] = useState<Taal>(loadLanguage)

  const setTaal = useCallback((next: Taal) => {
    setTaalState(next)
    try {
      localStorage.setItem(LANGUAGE_KEY, next)
    } catch {
      // zie loadLanguage
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = taal
    document.title = dictionaries[taal]['app.title']
  }, [taal])

  const value = useMemo(() => {
    const dict = dictionaries[taal]
    const t = (key: TranslationKey, params?: Record<string, string | number>) =>
      dict[key].replace(/\{(\w+)\}/g, (_, name: string) => String(params?.[name] ?? `{${name}}`))
    return { taal, setTaal, t }
  }, [taal, setTaal])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
