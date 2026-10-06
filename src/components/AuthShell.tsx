import { Link, Outlet } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { LanguageSwitch } from './LanguageSwitch'
import { Logo } from './Logo'

/** Eenvoudige pagina zonder navigatie voor inloggen en wachtwoord instellen. */
export function AuthShell() {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-dvh flex-col bg-fog">
      <header className="container-page flex items-center justify-between py-4">
        <Link to="/" className="flex min-h-12 items-center rounded-full" aria-label={t('nav.homeAria')}>
          <Logo className="h-8" />
        </Link>
        <LanguageSwitch />
      </header>
      <main id="main" className="container-page flex flex-1 items-start justify-center py-8 sm:items-center sm:py-12">
        <div className="w-full max-w-md rounded-2xl border border-mist bg-white p-6 shadow-card sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
