import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { products } from '../data/products'
import { useProgress } from '../hooks/useProgress'
import { isPassed } from '../lib/progress'
import { Logo } from './Logo'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-12 items-center rounded-full px-4 font-semibold transition-colors ${
    isActive ? 'bg-fog text-ink' : 'text-graphite hover:bg-fog hover:text-ink'
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
    <header className="pointer-events-none sticky top-0 z-40 px-3 pt-3 text-ink sm:px-6">
      <div className="pointer-events-auto mx-auto max-w-6xl rounded-[1.75rem] border border-white/60 bg-white/80 shadow-[0_8px_30px_-12px_rgb(17_17_17/0.35),inset_0_1px_0_rgb(255_255_255/0.8)] ring-1 ring-ink/10 backdrop-blur-xl supports-[not(backdrop-filter)]:bg-white">
      <div className="flex h-14 items-center justify-between gap-4 pl-5 pr-2 sm:pl-6">
        <Link to="/" className="flex min-h-12 items-center gap-3 rounded-full" aria-label="Kyocera productonboarding, naar overzicht">
          <Logo className="h-8" />
          <span className="hidden border-l border-mist pl-3 font-display text-lg font-semibold text-graphite sm:inline">Productonboarding</span>
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-1 md:flex">
          {links}
          <span className="ml-3 rounded-full bg-kyocera-red px-4 py-2 text-sm font-semibold text-white" aria-label={`${passedCount} van ${total} quizzen gehaald`}>
            {passedCount}/{total} gehaald
          </span>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full hover:bg-fog md:hidden"
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
        <nav id="mobiel-menu" aria-label="Hoofdnavigatie" onClick={() => setOpen(false)} className="animate-rise border-t border-mist/70 md:hidden">
          <div className="flex flex-col gap-1 p-3">
            {links}
            <p className="px-4 py-3 text-graphite">{passedCount} van {total} quizzen gehaald</p>
          </div>
        </nav>
      )}
      </div>
    </header>
  )
}
