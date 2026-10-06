import { describe, expect, it } from 'vitest'
import { emptyProductForm, hasErrors, isValidVideo, slugify, validateProduct, validateQuestion, type ProductFormValues } from './productForm'

const valid: ProductFormValues = {
  slug: 'a3-kleuren-mfp',
  naam: 'KX-5500ci',
  categorie: 'Multifunctionals',
  korteOmschrijving: 'Snelle A3-kleuren-MFP.',
  omschrijving: 'Een uitgebreide omschrijving.',
  kenmerken: ['Snel'],
  doelgroep: 'Werkgroepen',
  verkoopargumenten: ['Lage kosten'],
  afbeelding: 'https://example.supabase.co/storage/v1/object/public/product-media/afbeeldingen/x.jpg',
  video: '',
  gepubliceerd: true,
}

describe('slugify', () => {
  it('maakt een URL-vriendelijke slug', () => {
    expect(slugify('Kleuren-MFP A3 (nieuw)')).toBe('kleuren-mfp-a3-nieuw')
    expect(slugify('  Café één  ')).toBe('cafe-een')
    expect(slugify('KX Pro 15000c!')).toBe('kx-pro-15000c')
  })
})

describe('validateProduct', () => {
  it('accepteert een volledig product', () => {
    expect(validateProduct(valid)).toEqual({})
  })
  it('geeft Nederlandse meldingen voor verplichte velden', () => {
    const errors = validateProduct(emptyProductForm)
    expect(errors.naam).toBe('Vul de naam van het product in.')
    expect(errors.categorie).toBeDefined()
    expect(errors.korteOmschrijving).toBeDefined()
    expect(errors.omschrijving).toBeDefined()
    expect(errors.kenmerken).toBe('Voeg minimaal één kenmerk toe.')
    expect(errors.doelgroep).toBeDefined()
    expect(errors.verkoopargumenten).toBeDefined()
    expect(errors.slug).toBeDefined()
  })
  it('telt lege regels in lijsten niet mee', () => {
    expect(validateProduct({ ...valid, kenmerken: ['  ', ''] }).kenmerken).toBeDefined()
  })
  it('weigert een ongeldige slug', () => {
    expect(validateProduct({ ...valid, slug: 'Fout Spatie' }).slug).toMatch(/kleine letters/)
    expect(validateProduct({ ...valid, slug: '-begin' }).slug).toBeDefined()
  })
  it('begrenst de korte omschrijving op 160 tekens', () => {
    expect(validateProduct({ ...valid, korteOmschrijving: 'x'.repeat(161) }).korteOmschrijving).toMatch(/160/)
  })
  it('vraagt om een afbeelding alleen bij publiceren', () => {
    expect(validateProduct({ ...valid, afbeelding: '', gepubliceerd: true }).afbeelding).toBeDefined()
    expect(validateProduct({ ...valid, afbeelding: '', gepubliceerd: false }).afbeelding).toBeUndefined()
  })
  it('controleert de videolink', () => {
    expect(validateProduct({ ...valid, video: 'geen link' }).video).toMatch(/YouTube/)
    expect(validateProduct({ ...valid, video: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' }).video).toBeUndefined()
  })
})

describe('isValidVideo', () => {
  it('accepteert leeg, YouTube en mp4-URL’s', () => {
    expect(isValidVideo('')).toBe(true)
    expect(isValidVideo('https://youtu.be/aqz-KE-bpKQ')).toBe(true)
    expect(isValidVideo('https://x.supabase.co/storage/v1/object/public/product-media/video/a.mp4')).toBe(true)
  })
  it('weigt andere links en tekst', () => {
    expect(isValidVideo('https://example.com/pagina')).toBe(false)
    expect(isValidVideo('https://www.youtube.com/watch?v=kort')).toBe(false)
    expect(isValidVideo('video.mp4')).toBe(false)
  })
})

describe('validateQuestion', () => {
  const q = { id: '1', vraag: 'Vraag?', opties: ['a', 'b', 'c', 'd'], juisteAntwoord: 0, uitleg: 'Omdat.' }
  it('accepteert een complete vraag', () => expect(hasErrors(validateQuestion(q))).toBe(false))
  it('markeert lege vraag, lege opties en lege uitleg', () => {
    const errors = validateQuestion({ ...q, vraag: ' ', opties: ['a', '', 'c', ''], uitleg: '' })
    expect(errors.vraag).toBeDefined()
    expect(errors.uitleg).toBeDefined()
    expect(errors.opties?.map(Boolean)).toEqual([false, true, false, true])
  })
})
