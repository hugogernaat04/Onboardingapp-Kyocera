import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearProgress, countPassed, isPassed, loadProgress, recordScore, saveProgress, STORAGE_KEY } from './progress'

beforeEach(() => localStorage.clear())

describe('isPassed', () => {
  it('is gehaald vanaf 4 van 5', () => {
    expect(isPassed({ score: 4, total: 5, datum: '' })).toBe(true)
    expect(isPassed({ score: 3, total: 5, datum: '' })).toBe(false)
    expect(isPassed(undefined)).toBe(false)
  })
})

describe('recordScore', () => {
  it('bewaart alleen een betere score', () => {
    const a = recordScore({}, 'x', 4, 5)
    expect(a.x.score).toBe(4)
    expect(recordScore(a, 'x', 2, 5)).toBe(a)
    expect(recordScore(a, 'x', 5, 5).x.score).toBe(5)
  })
  it('telt gehaalde producten', () => {
    const p = recordScore(recordScore({}, 'a', 5, 5), 'b', 1, 5)
    expect(countPassed(p, ['a', 'b', 'c'])).toBe(1)
  })
})

describe('opslag', () => {
  it('bewaart en herstelt voortgang via localStorage', () => {
    saveProgress(recordScore({}, 'a', 5, 5))
    expect(loadProgress().a.score).toBe(5)
    clearProgress()
    expect(loadProgress()).toEqual({})
  })
  it('negeert ongeldige of kapotte data', () => {
    localStorage.setItem(STORAGE_KEY, '{kapot')
    expect(loadProgress()).toEqual({})
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ a: 'nee', b: { score: 4, total: 5, datum: '' } }))
    expect(Object.keys(loadProgress())).toEqual(['b'])
  })
  it('crasht niet als localStorage niet beschikbaar is', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('geblokkeerd') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('geblokkeerd') })
    expect(loadProgress()).toEqual({})
    expect(() => saveProgress({})).not.toThrow()
    vi.restoreAllMocks()
  })
})
