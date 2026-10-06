import type { QuizQuestion } from './catalog'
import { PASS_SCORE } from './progress'

export interface PreparedQuestion extends QuizQuestion {
  /** Opties in een willekeurige volgorde; juisteAntwoord wijst hierop */
  opties: string[]
}

/** Willekeurige volgorde (Fisher-Yates) van de antwoordopties per vraag. */
export function createOrders(questions: QuizQuestion[], random: () => number = Math.random): number[][] {
  return questions.map((q) => {
    const order = q.opties.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    return order
  })
}

/** Past een vaste volgorde toe en verplaatst de index van het juiste antwoord mee. */
export function applyOrders(questions: QuizQuestion[], orders: number[][]): PreparedQuestion[] {
  return questions.map((q, n) => ({
    ...q,
    opties: orders[n].map((i) => q.opties[i]),
    juisteAntwoord: orders[n].indexOf(q.juisteAntwoord),
  }))
}

/** Schudt de antwoordopties en past de index van het juiste antwoord aan. */
export function prepareQuestions(questions: QuizQuestion[], random: () => number = Math.random): PreparedQuestion[] {
  return applyOrders(questions, createOrders(questions, random))
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

export type ResultLevel = 'perfect' | 'passed' | 'almost' | 'failed'

/** Welk bericht hoort bij de score; de tekst zelf staat in src/i18n/translations.ts. */
export function resultLevel(score: number, total: number): ResultLevel {
  if (score === total) return 'perfect'
  if (score >= PASS_SCORE) return 'passed'
  if (score >= PASS_SCORE - 1) return 'almost'
  return 'failed'
}
