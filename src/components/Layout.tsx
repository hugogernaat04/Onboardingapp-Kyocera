import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Logo } from './Logo'

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold">
        Ga naar hoofdinhoud
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <footer className="border-t border-mist bg-fog">
        <div className="container-page flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo className="h-6" />
          <p className="text-sm text-steel">Interne onboarding voor nieuwe verkopers. Productinformatie is placeholder-inhoud.</p>
        </div>
      </footer>
    </div>
  )
}
