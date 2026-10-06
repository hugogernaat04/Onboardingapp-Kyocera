import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCatalog } from '../hooks/useCatalog'
import { useLanguage } from '../hooks/useLanguage'
import { LanguageSwitch } from './LanguageSwitch'
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
  const { products } = useCatalog()
  const { t } = useLanguage()
  const { profile, user, isAdmin, signOut } = useAuth()
  const displayName = profile?.naam || user?.email || ''
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
  const items = [
    { to: '/', label: t('nav.overview') },
    ...(next ? [{ to: `/product/${next.slug}`, label: t('nav.continue') }] : []),
    ...(isAdmin ? [{ to: '/admin', label: t('nav.admin') }] : []),
  ]
  const links = (stagger: boolean) =>
    items.map((item, i) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to !== '/admin'}
        className={(s) => `${navClass(s)} ${stagger ? 'animate-rise' : ''}`}
        style={stagger ? { animationDelay: `${60 + i * 70}ms` } : undefined}
      >
        {item.label}
      </NavLink>
    ))

  return (
    <header className="pointer-events-none sticky top-0 z-40 px-3 pt-3 text-ink sm:px-6">
      <div className="pointer-events-auto mx-auto max-w-6xl rounded-[1.75rem] border border-white/60 bg-white/80 shadow-[0_8px_30px_-12px_rgb(17_17_17/0.35),inset_0_1px_0_rgb(255_255_255/0.8)] ring-1 ring-ink/10 backdrop-blur-xl supports-[not(backdrop-filter)]:bg-white">
      <div className="flex h-14 items-center justify-between gap-4 pl-5 pr-2 sm:pl-6">
        <Link to="/" className="flex min-h-12 items-center gap-3 rounded-full" aria-label={t('nav.homeAria')}>
          <Logo className="h-8" />
          <span className="hidden border-l border-mist pl-3 font-display text-lg font-semibold text-graphite sm:inline">{t('nav.brand')}</span>
        </Link>

        <nav aria-label={t('nav.main')} className="hidden items-center gap-1 md:flex">
          {links(false)}
          <span className="ml-3 rounded-full bg-kyocera-red px-4 py-2 text-sm font-semibold text-white" aria-label={t('home.progressTitle', { n: passedCount, total })}>
            {t('nav.passedShort', { n: passedCount, total })}
          </span>
          <LanguageSwitch className="ml-2" />
          <span className="ml-3 hidden max-w-[10rem] truncate text-sm font-medium text-graphite lg:inline" title={t('nav.loggedInAs', { naam: displayName })}>{displayName}</span>
          <button type="button" onClick={() => void signOut()} className={`${navClass({ isActive: false })} ml-1`}>{t('nav.logout')}</button>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
        <LanguageSwitch />
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full hover:bg-fog"
          aria-expanded={open}
          aria-controls="mobiel-menu"
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true" className="relative block h-6 w-6">
            <span className={`absolute left-0.5 h-0.5 w-5 rounded-full bg-current transition-transform duration-500 top-[6px] ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`absolute left-0.5 top-[11px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute left-0.5 h-0.5 w-5 rounded-full bg-current transition-transform duration-500 top-[16px] ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
          </span>
        </button>
        </div>
      </div>

      {open && (
        <nav id="mobiel-menu" aria-label={t('nav.main')} onClick={() => setOpen(false)} className="animate-rise border-t border-mist/70 md:hidden">
          <div className="flex flex-col gap-1 p-3">
            {links(true)}
            <p className="px-4 py-3 text-graphite">{t('home.progressTitle', { n: passedCount, total })}</p>
            <p className="px-4 text-sm text-steel">{t('nav.loggedInAs', { naam: displayName })}</p>
            <button type="button" onClick={() => void signOut()} className={`${navClass({ isActive: false })} justify-start`}>{t('nav.logout')}</button>
          </div>
        </nav>
      )}
      </div>
    </header>
  )
}
