import { talen, type Taal } from '../data/products'
import { useLanguage } from '../hooks/useLanguage'

const labels: Record<Taal, { kort: string; naam: string }> = {
  nl: { kort: 'NL', naam: 'Nederlands' },
  en: { kort: 'EN', naam: 'English' },
}

/** Keuze tussen talen. Elke knop heeft de taal zelf als lang-attribuut en volledige naam voor screenreaders. */
export function LanguageSwitch({ className = '' }: { className?: string }) {
  const { taal, setTaal, t } = useLanguage()
  return (
    <div role="group" aria-label={t('lang.label')} className={`inline-flex rounded-full bg-fog p-1 ${className}`}>
      {talen.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={taal === code}
          aria-label={labels[code].naam}
          onClick={() => setTaal(code)}
          className={`inline-flex h-10 min-w-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors duration-300 ${
            taal === code ? 'bg-ink text-white' : 'text-graphite hover:text-ink'
          }`}
        >
          {labels[code].kort}
        </button>
      ))}
    </div>
  )
}
