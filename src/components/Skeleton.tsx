/** Grijs blokje met een pulserende animatie, voor laadtoestanden. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-fog ${className}`} />
}

/** Schermlezers horen één keer dat er geladen wordt; de blokjes zelf zijn verborgen. */
export function LoadingRegion({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
