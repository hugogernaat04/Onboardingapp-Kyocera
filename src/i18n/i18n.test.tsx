import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { localizeProduct, products, talen } from '../data/products'
import { useLanguage } from '../hooks/useLanguage'
import { LANGUAGE_KEY, LanguageProvider } from './LanguageProvider'
import { dictionaries } from './translations'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.lang = ''
})

function Probe() {
  const { taal, setTaal, t } = useLanguage()
  return (
    <>
      <p>{t('quiz.question', { n: 2, total: 5 })}</p>
      <p data-testid="taal">{taal}</p>
      <button onClick={() => setTaal('en')}>naar-en</button>
    </>
  )
}

describe('vertalingen', () => {
  it('bevat in elke taal dezelfde sleutels, zonder lege waarden', () => {
    const keys = Object.keys(dictionaries.nl).sort()
    for (const taal of talen) {
      expect(Object.keys(dictionaries[taal]).sort()).toEqual(keys)
      for (const value of Object.values(dictionaries[taal])) expect(value.trim()).not.toBe('')
    }
  })

  it('heeft voor elk product een complete Engelse vertaling', () => {
    for (const p of products) {
      const en = localizeProduct(p, 'en')
      expect(p.en, p.id).toBeDefined()
      expect(en.kenmerken).toHaveLength(p.kenmerken.length)
      expect(en.verkoopargumenten).toHaveLength(p.verkoopargumenten.length)
      expect(en.quiz).toHaveLength(p.quiz.length)
      en.quiz.forEach((q, i) => {
        expect(q.opties).toHaveLength(4)
        expect(q.juisteAntwoord).toBe(p.quiz[i].juisteAntwoord)
      })
      expect(en.categorieId).toBe(p.categorie)
    }
  })

  it('valt terug op Nederlands als een vertaling ontbreekt', () => {
    const zonderEn = { ...products[0], en: undefined }
    expect(localizeProduct(zonderEn, 'en').omschrijving).toBe(products[0].omschrijving)
  })
})

describe('LanguageProvider', () => {
  it('start in het Nederlands, wisselt van taal en onthoudt de keuze', async () => {
    const user = userEvent.setup()
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByText('Vraag 2 van 5')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('nl')

    await user.click(screen.getByText('naar-en'))
    expect(screen.getByText('Question 2 of 5')).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem(LANGUAGE_KEY)).toBe('en')
  })

  it('herstelt de opgeslagen taal', () => {
    localStorage.setItem(LANGUAGE_KEY, 'en')
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('taal')).toHaveTextContent('en')
  })
})
