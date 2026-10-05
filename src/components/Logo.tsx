import { useState } from 'react'
import { LOGO_SOURCES } from '../lib/media'

interface LogoProps {
  className?: string
  /** Zet op true voor gebruik op een donkere achtergrond (fallbacktekst wordt wit) */
  onDark?: boolean
}

/** Het officiële logo staat in public/brand/. Zonder bestand tonen we de tekst "KYOCERA". */
export function Logo({ className = 'h-7', onDark = false }: LogoProps) {
  const [attempt, setAttempt] = useState(0)

  if (attempt >= LOGO_SOURCES.length) {
    return (
      <span
        className={`font-display text-2xl font-bold tracking-[0.08em] ${onDark ? 'text-white' : 'text-kyocera-red'}`}
      >
        KYOCERA
      </span>
    )
  }
  return (
    <img
      src={LOGO_SOURCES[attempt]}
      alt="Kyocera"
      className={`w-auto ${className}`}
      onError={() => setAttempt((a) => a + 1)}
    />
  )
}
