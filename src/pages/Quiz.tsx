import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { LocalizedProduct } from '../data/products'
import { useCatalog } from '../hooks/useCatalog'
import { useLanguage } from '../hooks/useLanguage'
import { useProgress } from '../hooks/useProgress'
import { PASS_SCORE } from '../lib/progress'
import { applyOrders, createOrders, initialQuizState, quizReducer, resultLevel } from '../lib/quiz'
import { ChevronLeftIcon, CheckIcon, CrossIcon } from '../components/Icons'
import { CtaButton } from '../components/Cta'
import NotFound from './NotFound'

export default function Quiz() {
  const { id } = useParams()
  const { getProduct } = useCatalog()
  const product = getProduct(id)
  const [attempt, setAttempt] = useState(0)
  if (!product) return <NotFound messageKey="quiz.notFound" />
  return <QuizRunner key={`${product.id}-${attempt}`} product={product} onRetry={() => setAttempt((a) => a + 1)} />
}

function QuizRunner({ product, onRetry }: { product: LocalizedProduct; onRetry: () => void }) {
  // De volgorde wordt één keer per poging bepaald, zodat wisselen van taal de quiz niet door elkaar haalt.
  const [orders] = useState(() => createOrders(product.quiz))
  const questions = useMemo(() => applyOrders(product.quiz, orders), [product, orders])
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)
  const { recordResult } = useProgress()
  const { t } = useLanguage()
  const nextRef = useRef<HTMLButtonElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const total = questions.length

  useEffect(() => {
    if (state.finished) {
      recordResult(product.id, state.score, total)
      headingRef.current?.focus()
    }
  }, [state.finished, state.score, total, product.id, recordResult])

  useEffect(() => {
    if (state.selected !== null) nextRef.current?.focus({ preventScroll: false })
  }, [state.selected])

  if (state.finished) {
    const level = resultLevel(state.score, total)
    const passed = state.score >= PASS_SCORE
    return (
      <div className="container-page max-w-2xl py-10 sm:py-16">
        <div className="animate-rise rounded-2xl border border-mist p-6 text-center shadow-card sm:p-10">
          <p className="font-display text-7xl font-bold sm:text-8xl" aria-label={t('quiz.scoreAria', { score: state.score, total })}>
            <span className={passed ? 'text-success' : 'text-kyocera-red'}>{state.score}</span>
            <span className="text-steel">/{total}</span>
          </p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-3xl outline-none sm:text-4xl">{t(`result.${level}.title`)}</h1>
          <p className="mx-auto mt-2 max-w-[44ch] text-graphite">{t(`result.${level}.text`)}</p>
          <p className="mt-2 text-sm text-steel">{t('quiz.passNote', { name: product.naam, min: PASS_SCORE, total })}</p>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className="btn-primary" onClick={onRetry}>{t('quiz.retry')}</button>
            <Link to={`/product/${product.id}`} className="btn-secondary">{t('quiz.backProduct')}</Link>
            <Link to="/" className="btn-ghost">{t('quiz.toOverview')}</Link>
          </div>
        </div>
      </div>
    )
  }

  const q = questions[state.index]
  const answered = state.selected !== null
  const isLast = state.index + 1 === total
  const pct = ((state.index + (answered ? 1 : 0)) / total) * 100

  return (
    <div className="container-page max-w-2xl py-6 sm:py-12">
      <Link to={`/product/${product.id}`} className="btn-ghost -ml-3">
        <ChevronLeftIcon className="h-5 w-5" />
        {t('quiz.stop')}
      </Link>
      <p className="mt-4 font-semibold text-kyocera-red-dark">{t('quiz.title', { name: product.naam })}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="font-display text-xl font-semibold">{t('quiz.question', { n: state.index + 1, total })}</p>
      </div>
      <div role="progressbar" aria-label={t('quiz.progressAria')} aria-valuemin={0} aria-valuemax={total} aria-valuenow={state.index + 1} aria-valuetext={t('quiz.question', { n: state.index + 1, total })}
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-kyocera-red transition-[width] duration-500" style={{ width: `${Math.max(pct, 100 / total / 2)}%` }} />
      </div>

      <fieldset key={state.index} className="mt-6 animate-rise">
        <legend className="font-display text-2xl font-bold leading-snug sm:text-3xl">{q.vraag}</legend>
        <div className="mt-5 flex flex-col gap-3">
          {q.opties.map((optie, i) => {
            const isCorrect = i === q.juisteAntwoord
            const isChosen = state.selected === i
            let style = 'border-mist bg-white hover:border-ink'
            if (answered && isCorrect) style = 'border-success bg-success-soft'
            else if (answered && isChosen) style = 'border-danger bg-danger-soft'
            else if (answered) style = 'border-mist bg-white text-steel'
            return (
              <button
                key={optie}
                type="button"
                aria-disabled={answered}
                onClick={() => !answered && dispatch({ type: 'answer', choice: i, correct: q.juisteAntwoord })}
                className={`flex min-h-14 w-full items-center gap-4 rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors ${style} ${answered ? 'cursor-default' : ''}`}
              >
                <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-display font-bold ${answered && isCorrect ? 'border-success bg-success text-white' : answered && isChosen ? 'border-danger bg-danger text-white' : 'border-current'}`}>
                  {answered && isCorrect ? <CheckIcon className="h-5 w-5" /> : answered && isChosen ? <CrossIcon className="h-5 w-5" /> : String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{optie}</span>
                {answered && isCorrect && <span className="sr-only">{t('quiz.correctSr')}</span>}
                {answered && isChosen && !isCorrect && <span className="sr-only">{t('quiz.wrongSr')}</span>}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div role="status" aria-live="polite" className="mt-5">
        {answered && (
          <div className={`animate-rise rounded-xl p-5 ${state.selected === q.juisteAntwoord ? 'bg-success-soft' : 'bg-danger-soft'}`}>
            <p className={`font-display text-xl font-bold ${state.selected === q.juisteAntwoord ? 'text-success' : 'text-danger'}`}>
              {state.selected === q.juisteAntwoord ? t('quiz.right') : t('quiz.wrong')}
            </p>
            {state.selected !== q.juisteAntwoord && (
              <p className="mt-1">{t('quiz.answerIs')} <strong>{q.opties[q.juisteAntwoord]}</strong></p>
            )}
            <p className="mt-1 text-graphite">{q.uitleg}</p>
          </div>
        )}
      </div>

      {answered && (
        <CtaButton buttonRef={nextRef} className="mt-5 w-full justify-between sm:w-auto sm:justify-center" onClick={() => dispatch({ type: 'next', total })}>
          {isLast ? t('quiz.results') : t('quiz.next')}
        </CtaButton>
      )}
    </div>
  )
}
