import { useContext } from 'react'
import { ProgressContext } from '../context/ProgressContext'

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress moet binnen een ProgressProvider gebruikt worden')
  return ctx
}
