import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ProductCard } from '../components/ProductCard'
import { useCatalog } from '../hooks/useCatalog'
import { useLanguage } from '../hooks/useLanguage'
import { useProgress } from '../hooks/useProgress'
import { isPassed, PASS_SCORE } from '../lib/progress'

export default function Home() {
  const { progress, passedCount, total, resetProgress } = useProgress()
  const { products, categories } = useCatalog()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (!category || p.categorie === category) &&
        (!q || [p.naam, p.categorie, p.korteOmschrijving].some((t) => t.toLowerCase().includes(q))),
    )
  }, [products, query, category])

  const pct = total ? Math.round((passedCount / total) * 100) : 0
  const chip = (active: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center rounded-full border-2 px-4 font-semibold transition-colors ${
      active ? 'border-ink bg-ink text-white' : 'border-mist bg-white text-graphite hover:border-ink'
    }`

  return (
    <>
      <section className="on-dark -mt-[4.25rem] bg-ink pt-[4.25rem] text-white">
        <div className="container-page grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:py-16">
          <div>
            <h1 className="max-w-[18ch] text-4xl text-white sm:text-5xl">
              {t('home.title')}
            </h1>
            <p className="mt-4 max-w-[52ch] text-lg text-white/85">
              {t('home.intro', { min: PASS_SCORE, total: 5 })}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-5 sm:p-6">
            <p className="font-display text-3xl font-bold" aria-live="polite">
              {t('home.progressTitle', { n: passedCount, total })}
            </p>
            <div
              role="progressbar"
              aria-label={t('home.progressAria')}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={passedCount}
              aria-valuetext={t('home.progressValue', { n: passedCount, total })}
              className="mt-4 h-3 overflow-hidden rounded-full bg-white/20"
            >
              <div className="h-full rounded-full bg-kyocera-red transition-[width] duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-3 text-white/85">
              {passedCount === total && total > 0 ? t('home.progressDone') : t('home.progressStart')}
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-8 sm:py-12" aria-labelledby="producten-titel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 id="producten-titel" className="text-3xl">{t('home.products')}</h2>
          <div className="relative lg:w-96">
            <label htmlFor="zoek" className="sr-only">{t('home.searchLabel')}</label>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-steel" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="zoek"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="min-h-12 w-full rounded-lg border-2 border-mist bg-white pl-12 pr-4 text-base placeholder:text-steel focus-visible:border-ink"
              autoComplete="off"
              enterKeyHint="search"
            />
          </div>
        </div>

        <div role="group" aria-label={t('home.filterLabel')} className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          <button type="button" className={chip(category === null)} aria-pressed={category === null} onClick={() => setCategory(null)}>
            {t('home.all')}
          </button>
          {categories.map((c) => (
            <button key={c.id} type="button" className={chip(category === c.id)} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <p className="sr-only" role="status">{t(visible.length === 1 ? 'home.countOne' : 'home.countMany', { n: visible.length })}</p>

        {visible.length > 0 ? (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} passed={isPassed(progress[p.id])} delay={(i % 4) * 90} />
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-xl border-2 border-dashed border-mist p-8 text-center sm:p-12">
            <p className="font-display text-2xl font-semibold">{t('home.emptyTitle')}</p>
            <p className="mt-2 text-graphite">{t('home.emptyText')}</p>
            <button type="button" className="btn-secondary mt-5" onClick={() => { setQuery(''); setCategory(null) }}>
              {t('home.clearFilters')}
            </button>
          </div>
        )}

        <div className="mt-12 flex flex-col items-start gap-2 border-t border-mist pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-steel">{t('home.storedNote')}</p>
          <button type="button" className="btn-ghost -ml-5 sm:ml-0" onClick={() => setConfirming(true)} disabled={passedCount === 0 && Object.keys(progress).length === 0}>
            {t('home.reset')}
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={confirming}
        title={t('home.resetTitle')}
        confirmLabel={t('home.resetConfirm')}
        cancelLabel={t('common.cancel')}
        onCancel={() => setConfirming(false)}
        onConfirm={() => { resetProgress(); setConfirming(false) }}
      >
        <p>{t('home.resetText')}</p>
      </ConfirmDialog>
    </>
  )
}
