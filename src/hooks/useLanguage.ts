import { useContext } from 'react'
import { LanguageContext } from '../i18n/LanguageContext'

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage moet binnen een LanguageProvider gebruikt worden')
  return ctx
}
