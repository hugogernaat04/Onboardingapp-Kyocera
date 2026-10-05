import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, type Product } from '../data/products'
import { useProgress } from '../hooks/useProgress'
import { PASS_SCORE } from '../lib/progress'
import { initialQuizState, prepareQuestions, quizReducer, resultMessage } from '../lib/quiz'
import { ChevronLeftIcon, CheckIcon, CrossIcon } from '../components/Icons'
import NotFound from './NotFound'

export default function Quiz() {
  const { id } = useParams()
  const product = getProduct(id)
  const [attempt, setAttempt] = useState(0)
  if (!product) return <NotFound melding="Deze quiz bestaat niet (meer)." />
  return <QuizRunner key={`${product.id}-${attempt}`} product={product} onRetry={() => setAttempt((a) => a + 1)} />
}

function QuizRunner({ product, onRetry }: { product: Product; onRetry: () => void }) {
  const questions = useMemo(() => prepareQuestions(product.quiz), [product])
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)
  const { recordResult } = useProgress()
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
    const { titel, tekst } = resultMessage(state.score, total)
    const passed = state.score >= PASS_SCORE
    return (
      <div className="container-page max-w-2xl py-10 sm:py-16">
        <div className="animate-rise rounded-2xl border border-mist p-6 text-center shadow-card sm:p-10">
          <p className="font-display text-7xl font-bold sm:text-8xl" aria-label={`Score: ${state.score} van ${total}`}>
            <span className={passed ? 'text-success' : 'text-kyocera-red'}>{state.score}</span>
            <span className="text-steel">/{total}</span>
          </p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-3xl outline-none sm:text-4xl">{titel}</h1>
          <p className="mx-auto mt-2 max-w-[44ch] text-graphite">{tekst}</p>
          <p className="mt-2 text-sm text-steel">{product.naam}: gehaald bij minimaal {PASS_SCORE} van {total}.</p>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className="btn-primary" onClick={onRetry}>Opnieuw proberen</button>
            <Link to={`/product/${product.id}`} className="btn-secondary">Terug naar product</Link>
            <Link to="/" className="btn-ghost">Naar overzicht</Link>
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
        Stop quiz
      </Link>
      <p className="mt-4 font-semibold text-kyocera-red-dark">Quiz: {product.naam}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="font-display text-xl font-semibold">Vraag {state.index + 1} van {total}</p>
      </div>
      <div role="progressbar" aria-label="Voortgang quiz" aria-valuemin={0} aria-valuemax={total} aria-valuenow={state.index + 1} aria-valuetext={`Vraag ${state.index + 1} van ${total}`}
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
                {answered && isCorrect && <span className="sr-only">Juiste antwoord</span>}
                {answered && isChosen && !isCorrect && <span className="sr-only">Jouw antwoord, onjuist</span>}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div role="status" aria-live="polite" className="mt-5">
        {answered && (
          <div className={`animate-rise rounded-xl p-5 ${state.selected === q.juisteAntwoord ? 'bg-success-soft' : 'bg-danger-soft'}`}>
            <p className={`font-display text-xl font-bold ${state.selected === q.juisteAntwoord ? 'text-success' : 'text-danger'}`}>
              {state.selected === q.juisteAntwoord ? 'Goed!' : 'Helaas, dat is niet juist.'}
            </p>
            {state.selected !== q.juisteAntwoord && (
              <p className="mt-1">Het juiste antwoord is: <strong>{q.opties[q.juisteAntwoord]}</strong></p>
            )}
            <p className="mt-1 text-graphite">{q.uitleg}</p>
          </div>
        )}
      </div>

      {answered && (
        <button ref={nextRef} type="button" className="btn-primary mt-5 w-full sm:w-auto" onClick={() => dispatch({ type: 'next', total })}>
          {isLast ? 'Bekijk resultaat' : 'Volgende vraag'}
        </button>
      )}
    </div>
  )
}
