import type { QuizQuestion } from '../data/products'
import { PASS_SCORE } from './progress'

export interface PreparedQuestion extends QuizQuestion {
  /** Opties in een willekeurige volgorde; juisteAntwoord wijst hierop */
  opties: string[]
}

/** Schudt de antwoordopties (Fisher-Yates) en past de index van het juiste antwoord aan. */
export function prepareQuestions(
  questions: QuizQuestion[],
  random: () => number = Math.random,
): PreparedQuestion[] {
  return questions.map((q) => {
    const order = q.opties.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    return {
      ...q,
      opties: order.map((i) => q.opties[i]),
      juisteAntwoord: order.indexOf(q.juisteAntwoord),
    }
  })
}

export interface QuizState {
  index: number
  /** Gekozen optie bij de huidige vraag, of null als nog niet beantwoord */
  selected: number | null
  score: number
  finished: boolean
}

export type QuizAction =
  | { type: 'answer'; choice: number; correct: number }
  | { type: 'next'; total: number }
  | { type: 'restart' }

export const initialQuizState: QuizState = { index: 0, selected: null, score: 0, finished: false }

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'answer':
      if (state.selected !== null || state.finished) return state // één poging per vraag
      return {
        ...state,
        selected: action.choice,
        score: state.score + (action.choice === action.correct ? 1 : 0),
      }
    case 'next':
      if (state.selected === null) return state
      return state.index + 1 >= action.total
        ? { ...state, finished: true }
        : { ...state, index: state.index + 1, selected: null }
    case 'restart':
      return initialQuizState
  }
}

export function resultMessage(score: number, total: number): { titel: string; tekst: string } {
  if (score === total) return { titel: 'Perfect!', tekst: 'Alles goed. Je kent dit product door en door.' }
  if (score >= PASS_SCORE) return { titel: 'Gehaald!', tekst: 'Sterk gedaan. Je bent klaar om dit product te verkopen.' }
  if (score >= PASS_SCORE - 1) return { titel: 'Bijna!', tekst: 'Nog één stap te gaan. Lees de productinfo nog eens door en probeer opnieuw.' }
  return { titel: 'Nog niet gehaald', tekst: 'Bekijk de productinfo en de video nog eens en probeer het opnieuw.' }
}
