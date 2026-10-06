import { Link } from 'react-router-dom'
import { CtaLink } from './Cta'
import { Reveal } from './Reveal'
import { ProductImage } from './ProductImage'
import { VideoPlayer } from './VideoPlayer'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ChevronLeftIcon } from './Icons'
import { useLanguage } from '../hooks/useLanguage'
import { isPassed, PASS_SCORE, type ScoreRecord } from '../lib/progress'
import type { LocalizedProduct } from '../lib/catalog'

const Check = () => <CheckIcon className="mt-1.5 h-5 w-5 shrink-0 text-kyocera-red" />

interface Props {
  product: LocalizedProduct
  prev?: LocalizedProduct
  next?: LocalizedProduct
  record?: ScoreRecord
  /** Voorbeeldmodus in het beheer: geen vaste knoppenbalk onderaan; de aanroeper zet het geheel op `inert`. */
  preview?: boolean
}

/** De productpagina zelf, los van routing en data, zodat het beheer hem ook als voorbeeld kan tonen. */
export function ProductView({ product, prev, next, record, preview = false }: Props) {
  const { t } = useLanguage()
  const passed = isPassed(record)
  const quizPath = `/product/${product.slug}/quiz`

  return (
    <article className={preview ? '' : 'pb-28 md:pb-0'}>
      <div className="container-page pt-4 sm:pt-6">
        <Link to="/" className="btn-ghost -ml-3">
          <ChevronLeftIcon className="h-5 w-5" />
          {t('product.back')}
        </Link>
      </div>

      <header className="container-page grid gap-6 py-4 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-8">
        <div className="overflow-hidden rounded-2xl border border-mist shadow-card">
          <ProductImage product={product} priority sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
        <div>
          <p className="font-semibold text-kyocera-red-dark">{product.categorie}</p>
          <h1 className="mt-1 text-4xl sm:text-5xl">{product.naam}</h1>
          <p className="mt-4 text-xl text-graphite">{product.korteOmschrijving}</p>
          {record && (
            <p className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold ${passed ? 'bg-success-soft text-success' : 'bg-fog text-graphite'}`}>
              {passed ? t('product.passed') : t('product.notPassed')}: {t('product.bestScore', { score: record.score, total: product.quiz.length })}
            </p>
          )}
          <div className="mt-6 hidden gap-3 md:flex">
            <CtaLink to={quizPath}>{t('product.startQuiz')}</CtaLink>
            <a href="#video" className="btn-secondary">{t('product.watchVideo')}</a>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-10 py-8 lg:grid-cols-[3fr_2fr] lg:gap-14 lg:py-12">
        <div className="space-y-10">
          <Reveal as="section" labelledBy="omschrijving">
            <h2 id="omschrijving" className="text-2xl sm:text-3xl">{t('product.description')}</h2>
            <p className="prose-limit mt-3">{product.omschrijving}</p>
          </Reveal>
          <Reveal as="section" labelledBy="kenmerken">
            <h2 id="kenmerken" className="text-2xl sm:text-3xl">{t('product.features')}</h2>
            <ul className="prose-limit mt-3 space-y-3">
              {product.kenmerken.map((k, i) => (<li key={`${i}-${k}`} className="flex gap-3"><Check /><span>{k}</span></li>))}
            </ul>
          </Reveal>
          <Reveal as="section" labelledBy="doelgroep">
            <h2 id="doelgroep" className="text-2xl sm:text-3xl">{t('product.audience')}</h2>
            <p className="prose-limit mt-3">{product.doelgroep}</p>
          </Reveal>
        </div>

        <aside className="h-fit rounded-2xl bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24" aria-labelledby="usp">
          <h2 id="usp" className="text-2xl text-white sm:text-3xl">{t('product.usps')}</h2>
          <ul className="mt-4 space-y-4">
            {product.verkoopargumenten.map((v, i) => (
              <li key={`${i}-${v}`} className="border-l-4 border-kyocera-red pl-4">{v}</li>
            ))}
          </ul>
        </aside>
      </div>

      <Reveal as="section" id="video" className="container-page scroll-mt-20 pb-10" labelledBy="video-titel">
        <h2 id="video-titel" className="text-2xl sm:text-3xl">{t('product.video')}</h2>
        <div className="mt-4 max-w-4xl">
          <VideoPlayer source={product.video} title={product.naam} />
        </div>
      </Reveal>

      <section className="container-page pb-10" aria-label={t('product.readyTitle')}>
        <div className="flex flex-col gap-4 rounded-2xl bg-kyocera-red-soft p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">{t('product.readyTitle')}</h2>
            <p className="mt-1 text-graphite">{t('product.readyText', { total: product.quiz.length, min: PASS_SCORE })}</p>
          </div>
          <CtaLink to={quizPath}>{t('product.startQuiz')}</CtaLink>
        </div>
      </section>

      {(prev || next) && (
        <nav aria-label={t('product.others')} className="container-page grid gap-3 border-t border-mist py-8 sm:grid-cols-2">
          {prev ? (
            <Link to={`/product/${prev.slug}`} className="btn-secondary h-auto justify-start py-3 text-left">
              <ArrowLeftIcon className="h-5 w-5 shrink-0" />
              <span><span className="block text-sm font-medium text-steel">{t('product.prev')}</span>{prev.naam}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link to={`/product/${next.slug}`} className="btn-secondary h-auto justify-end py-3 text-right sm:col-start-2">
              <span><span className="block text-sm font-medium text-steel">{t('product.next')}</span>{next.naam}</span>
              <ArrowRightIcon className="h-5 w-5 shrink-0" />
            </Link>
          )}
        </nav>
      )}

      {!preview && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-mist bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <CtaLink to={quizPath} className="w-full justify-between">{t('product.startQuiz')}</CtaLink>
        </div>
      )}
    </article>
  )
}
