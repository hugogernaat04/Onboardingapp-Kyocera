import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { products } from '../data/products'
import { useProgress } from '../hooks/useProgress'
import { isPassed } from '../lib/progress'
import { Logo } from './Logo'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-12 items-center rounded-lg px-4 font-semibold transition-colors ${
    isActive ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'
  }`

export function Header() {
  const [open, setOpen] = useState(false)
  const { progress, passedCount, total } = useProgress()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const next = products.find((p) => !isPassed(progress[p.id]))
  const links = (
    <>
      <NavLink to="/" end className={navClass}>Overzicht</NavLink>
      {next && <NavLink to={`/product/${next.id}`} className={navClass} end>Verder leren</NavLink>}
    </>
  )

  return (
    <header className="on-dark sticky top-0 z-40 bg-ink text-white">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex min-h-12 items-center gap-3 rounded-lg" aria-label="Kyocera productonboarding, naar overzicht">
          <span className="rounded bg-white px-2.5 py-1.5"><Logo className="h-6" /></span>
          <span className="hidden font-display text-lg font-semibold sm:inline">Productonboarding</span>
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-1 md:flex">
          {links}
          <span className="ml-3 rounded-full bg-kyocera-red px-4 py-2 text-sm font-semibold" aria-label={`${passedCount} van ${total} quizzen gehaald`}>
            {passedCount}/{total} gehaald
          </span>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-lg hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobiel-menu"
          aria-label={open ? 'Sluit menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobiel-menu" aria-label="Hoofdnavigatie" onClick={() => setOpen(false)} className="animate-rise border-t border-white/15 md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links}
            <p className="px-4 py-3 text-white/85">{passedCount} van {total} quizzen gehaald</p>
          </div>
        </nav>
      )}
    </header>
  )
}
