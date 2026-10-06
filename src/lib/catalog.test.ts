import { describe, expect, it } from 'vitest'
import { localizeProduct, rowToProduct, type ProductRow, type QuestionRow } from './catalog'

const question = (volgorde: number, vraag: string): QuestionRow => ({
  id: `q${volgorde}`, product_id: 'p1', vraag, opties: ['a', 'b', 'c', 'd'], juiste_antwoord: 2, uitleg: 'u', volgorde,
})
const row: ProductRow & { quiz_questions: QuestionRow[] } = {
  id: 'p1', slug: 'mfp', naam: 'MFP', categorie: 'Multifunctionals', korte_omschrijving: 'kort', omschrijving: 'lang',
  kenmerken: ['k'], doelgroep: 'd', verkoopargumenten: ['v'], afbeelding_url: 'x.svg', video_url: '', volgorde: 0,
  gepubliceerd: true, created_at: '', updated_at: '',
  en: { categorie: 'MFPs', korteOmschrijving: 'short', omschrijving: 'long', kenmerken: ['f'], doelgroep: 'g', verkoopargumenten: ['s'],
    quiz: [{ vraag: 'Q2?', opties: ['1', '2', '3', '4'], uitleg: 'e' }, { vraag: 'Q1?', opties: ['1', '2', '3', '4'], uitleg: 'e' }] },
  quiz_questions: [question(1, 'Vraag 2?'), question(0, 'Vraag 1?')],
}

describe('rowToProduct', () => {
  it('zet databasevelden om en sorteert de vragen op volgorde', () => {
    const p = rowToProduct(row)
    expect(p.slug).toBe('mfp')
    expect(p.afbeelding).toBe('x.svg')
    expect(p.quiz.map((q) => q.vraag)).toEqual(['Vraag 1?', 'Vraag 2?'])
    expect(p.quiz[0].juisteAntwoord).toBe(2)
  })
})

describe('localizeProduct', () => {
  it('toont Engelse tekst met behoud van het juiste antwoord', () => {
    const en = localizeProduct(rowToProduct(row), 'en')
    expect(en.naam).toBe('MFP')
    expect(en.korteOmschrijving).toBe('short')
    expect(en.quiz[0].vraag).toBe('Q2?')
    expect(en.quiz[0].juisteAntwoord).toBe(2)
  })
  it('valt terug op Nederlands als het aantal vragen niet meer klopt met de vertaling', () => {
    const p = rowToProduct({ ...row, quiz_questions: [question(0, 'Enige vraag?')] })
    expect(localizeProduct(p, 'en').quiz[0].vraag).toBe('Enige vraag?')
  })
  it('valt terug op Nederlands zonder vertaling', () => {
    expect(localizeProduct(rowToProduct({ ...row, en: null }), 'en').korteOmschrijving).toBe('kort')
  })
})
