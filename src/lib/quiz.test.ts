import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { initialQuizState, prepareQuestions, quizReducer, resultLevel } from './quiz'

describe('productdata', () => {
  it('heeft per product 5 vragen met 4 opties en een geldig juist antwoord', () => {
    expect(products).toHaveLength(8)
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length)
    for (const p of products) {
      expect(p.quiz).toHaveLength(5)
      for (const q of p.quiz) {
        expect(q.opties).toHaveLength(4)
        expect(q.juisteAntwoord).toBeGreaterThanOrEqual(0)
        expect(q.juisteAntwoord).toBeLessThan(4)
      }
    }
  })
})

describe('prepareQuestions', () => {
  it('behoudt het juiste antwoord na het schudden', () => {
    const source = products[0].quiz
    for (const rnd of [() => 0, () => 0.5, () => 0.99, Math.random]) {
      const prepared = prepareQuestions(source, rnd)
      prepared.forEach((q, i) => {
        expect(q.opties[q.juisteAntwoord]).toBe(source[i].opties[source[i].juisteAntwoord])
        expect([...q.opties].sort()).toEqual([...source[i].opties].sort())
      })
    }
  })
})

describe('quizReducer', () => {
  const play = (choices: number[], correct = 1) => {
    let s = initialQuizState
    for (const choice of choices) {
      s = quizReducer(s, { type: 'answer', choice, correct })
      s = quizReducer(s, { type: 'next', total: choices.length })
    }
    return s
  }

  it('telt goede antwoorden en eindigt na de laatste vraag', () => {
    const s = play([1, 1, 0, 1, 1])
    expect(s.score).toBe(4)
    expect(s.finished).toBe(true)
  })

  it('staat maar één antwoord per vraag toe', () => {
    let s = quizReducer(initialQuizState, { type: 'answer', choice: 0, correct: 1 })
    s = quizReducer(s, { type: 'answer', choice: 1, correct: 1 })
    expect(s.selected).toBe(0)
    expect(s.score).toBe(0)
  })

  it('gaat niet door zonder antwoord en kan herstarten', () => {
    expect(quizReducer(initialQuizState, { type: 'next', total: 5 })).toBe(initialQuizState)
    expect(quizReducer(play([1, 1, 1]), { type: 'restart' })).toEqual(initialQuizState)
  })
})

describe('resultLevel', () => {
  it('kiest een niveau afhankelijk van de score', () => {
    expect(resultLevel(5, 5)).toBe('perfect')
    expect(resultLevel(4, 5)).toBe('passed')
    expect(resultLevel(3, 5)).toBe('almost')
    expect(resultLevel(1, 5)).toBe('failed')
  })
})
