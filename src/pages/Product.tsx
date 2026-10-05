import { Link, useParams } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { ProductImage } from '../components/ProductImage'
import { VideoPlayer } from '../components/VideoPlayer'
import { getProduct, products } from '../data/products'
import { useProgress } from '../hooks/useProgress'
import { isPassed, PASS_SCORE } from '../lib/progress'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ChevronLeftIcon } from '../components/Icons'
import NotFound from './NotFound'

const Check = () => <CheckIcon className="mt-1.5 h-5 w-5 shrink-0 text-kyocera-red" />

export default function Product() {
  const { id } = useParams()
  const { progress } = useProgress()
  const product = getProduct(id)
  if (!product) return <NotFound melding="Dit product bestaat niet (meer)." />

  const index = products.findIndex((p) => p.id === product.id)
  const prev = products[index - 1]
  const next = products[index + 1]
  const record = progress[product.id]
  const passed = isPassed(record)

  return (
    <article className="pb-28 md:pb-0">
      <div className="container-page pt-4 sm:pt-6">
        <Link to="/" className="btn-ghost -ml-3">
          <ChevronLeftIcon className="h-5 w-5" />
          Terug naar overzicht
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
              {passed ? 'Quiz gehaald' : 'Nog niet gehaald'}: beste score {record.score}/{record.total}
            </p>
          )}
          <div className="mt-6 hidden gap-3 md:flex">
            <Link to={`/product/${product.id}/quiz`} className="btn-primary">Start de quiz</Link>
            <a href="#video" className="btn-secondary">Bekijk de video</a>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-10 py-8 lg:grid-cols-[3fr_2fr] lg:gap-14 lg:py-12">
        <div className="space-y-10">
          <Reveal as="section" labelledBy="omschrijving">
            <h2 id="omschrijving" className="text-2xl sm:text-3xl">Omschrijving</h2>
            <p className="prose-limit mt-3">{product.omschrijving}</p>
          </Reveal>
          <Reveal as="section" labelledBy="kenmerken">
            <h2 id="kenmerken" className="text-2xl sm:text-3xl">Belangrijkste kenmerken</h2>
            <ul className="prose-limit mt-3 space-y-3">
              {product.kenmerken.map((k) => (<li key={k} className="flex gap-3"><Check /><span>{k}</span></li>))}
            </ul>
          </Reveal>
          <Reveal as="section" labelledBy="doelgroep">
            <h2 id="doelgroep" className="text-2xl sm:text-3xl">Voor wie is dit geschikt?</h2>
            <p className="prose-limit mt-3">{product.doelgroep}</p>
          </Reveal>
        </div>

        <aside className="h-fit rounded-2xl bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-24" aria-labelledby="usp">
          <h2 id="usp" className="text-2xl text-white sm:text-3xl">Verkoopargumenten</h2>
          <ul className="mt-4 space-y-4">
            {product.verkoopargumenten.map((v) => (
              <li key={v} className="border-l-4 border-kyocera-red pl-4">{v}</li>
            ))}
          </ul>
        </aside>
      </div>

      <Reveal as="section" id="video" className="container-page scroll-mt-20 pb-10" labelledBy="video-titel">
        <h2 id="video-titel" className="text-2xl sm:text-3xl">Uitlegvideo</h2>
        <div className="mt-4 max-w-4xl">
          <VideoPlayer source={product.video} title={product.naam} />
        </div>
      </Reveal>

      <section className="container-page pb-10" aria-label="Klaar voor de quiz?">
        <div className="flex flex-col gap-4 rounded-2xl bg-kyocera-red-soft p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">Klaar voor de quiz?</h2>
            <p className="mt-1 text-graphite">5 vragen. Je haalt de quiz met minimaal {PASS_SCORE} goede antwoorden.</p>
          </div>
          <Link to={`/product/${product.id}/quiz`} className="btn-primary">Start de quiz</Link>
        </div>
      </section>

      <nav aria-label="Andere producten" className="container-page grid gap-3 border-t border-mist py-8 sm:grid-cols-2">
        {prev ? (
          <Link to={`/product/${prev.id}`} className="btn-secondary h-auto justify-start py-3 text-left">
            <ArrowLeftIcon className="h-5 w-5 shrink-0" />
            <span><span className="block text-sm font-medium text-steel">Vorig product</span>{prev.naam}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link to={`/product/${next.id}`} className="btn-secondary h-auto justify-end py-3 text-right sm:col-start-2">
            <span><span className="block text-sm font-medium text-steel">Volgend product</span>{next.naam}</span>
            <ArrowRightIcon className="h-5 w-5 shrink-0" />
          </Link>
        )}
      </nav>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-mist bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <Link to={`/product/${product.id}/quiz`} className="btn-primary w-full">Start de quiz</Link>
      </div>
    </article>
  )
}
