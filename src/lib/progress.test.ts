import { describe, expect, it } from 'vitest'
import { addResult, countPassed, isPassed, PASS_SCORE, progressFromResults } from './progress'

describe('isPassed', () => {
  it('volgt het veld gehaald', () => {
    expect(isPassed({ score: 4, gehaald: true, datum: '' })).toBe(true)
    expect(isPassed({ score: 3, gehaald: false, datum: '' })).toBe(false)
    expect(isPassed(undefined)).toBe(false)
  })
  it('haalt een quiz vanaf 4 goed', () => expect(PASS_SCORE).toBe(4))
})

describe('addResult', () => {
  it('bewaart alleen een betere score', () => {
    const a = addResult({}, 'x', 4, true, '2026-01-01')
    expect(a.x.score).toBe(4)
    expect(addResult(a, 'x', 2, false, '2026-01-02')).toBe(a)
    expect(addResult(a, 'x', 5, true, '2026-01-03').x.score).toBe(5)
  })
  it('behoudt gehaald als een latere, hogere score dat ook is', () => {
    const a = addResult({}, 'x', 3, false, '2026-01-01')
    expect(addResult(a, 'x', 4, true, '2026-01-02').x.gehaald).toBe(true)
  })
})

describe('progressFromResults', () => {
  it('neemt per product de beste score uit alle pogingen', () => {
    const p = progressFromResults([
      { product_id: 'a', score: 2, gehaald: false, created_at: '1' },
      { product_id: 'a', score: 5, gehaald: true, created_at: '2' },
      { product_id: 'a', score: 3, gehaald: false, created_at: '3' },
      { product_id: 'b', score: 1, gehaald: false, created_at: '4' },
    ])
    expect(p.a).toMatchObject({ score: 5, gehaald: true })
    expect(p.b).toMatchObject({ score: 1, gehaald: false })
  })
  it('telt gehaalde producten', () => {
    const p = progressFromResults([
      { product_id: 'a', score: 5, gehaald: true, created_at: '1' },
      { product_id: 'b', score: 1, gehaald: false, created_at: '2' },
    ])
    expect(countPassed(p, ['a', 'b', 'c'])).toBe(1)
  })
})
