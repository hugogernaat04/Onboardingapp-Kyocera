import { parseVideo } from './media'

export const QUIZ_SIZE = 5

export interface ProductFormValues {
  slug: string
  naam: string
  categorie: string
  korteOmschrijving: string
  omschrijving: string
  kenmerken: string[]
  doelgroep: string
  verkoopargumenten: string[]
  afbeelding: string
  video: string
  gepubliceerd: boolean
}

export const emptyProductForm: ProductFormValues = {
  slug: '',
  naam: '',
  categorie: '',
  korteOmschrijving: '',
  omschrijving: '',
  kenmerken: [''],
  doelgroep: '',
  verkoopargumenten: [''],
  afbeelding: '',
  video: '',
  gepubliceerd: false,
}

export type ProductFormErrors = Partial<Record<Exclude<keyof ProductFormValues, 'gepubliceerd'>, string>>

/** "Kleuren-MFP A3" -> "kleuren-mfp-a3" */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Een lege video mag; verder een YouTube-link of de URL van een mp4-bestand. */
export function isValidVideo(value: string): boolean {
  const v = value.trim()
  if (!v) return true
  if (parseVideo(v).kind === 'youtube') return true
  try {
    const url = new URL(v)
    return (url.protocol === 'https:' || url.protocol === 'http:') && /\.mp4$/i.test(url.pathname)
  } catch {
    return false
  }
}

export const cleanList = (list: string[]): string[] => list.map((x) => x.trim()).filter(Boolean)

export function validateProduct(v: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {}
  if (!v.naam.trim()) errors.naam = 'Vul de naam van het product in.'
  else if (v.naam.trim().length > 100) errors.naam = 'De naam mag maximaal 100 tekens zijn.'
  if (!v.slug.trim()) errors.slug = 'Vul een slug in (het deel van de URL).'
  else if (!SLUG.test(v.slug)) errors.slug = 'Gebruik alleen kleine letters, cijfers en koppeltekens, bijvoorbeeld a3-kleuren-mfp.'
  if (!v.categorie.trim()) errors.categorie = 'Vul een categorie in.'
  if (!v.korteOmschrijving.trim()) errors.korteOmschrijving = 'Vul een korte omschrijving in.'
  else if (v.korteOmschrijving.trim().length > 160) errors.korteOmschrijving = 'De korte omschrijving mag maximaal 160 tekens zijn.'
  if (!v.omschrijving.trim()) errors.omschrijving = 'Vul de omschrijving in.'
  if (cleanList(v.kenmerken).length === 0) errors.kenmerken = 'Voeg minimaal één kenmerk toe.'
  if (!v.doelgroep.trim()) errors.doelgroep = 'Vul de doelgroep in.'
  if (cleanList(v.verkoopargumenten).length === 0) errors.verkoopargumenten = 'Voeg minimaal één verkoopargument toe.'
  if (v.gepubliceerd && !v.afbeelding.trim()) errors.afbeelding = 'Voeg een afbeelding toe voordat je het product publiceert.'
  if (!isValidVideo(v.video)) errors.video = 'Vul een geldige YouTube-link in (bijvoorbeeld https://www.youtube.com/watch?v=...) of upload een mp4-bestand.'
  return errors
}

export interface QuestionDraft {
  id: string
  vraag: string
  opties: string[]
  juisteAntwoord: number
  uitleg: string
}

export interface QuestionErrors {
  vraag?: string
  /** Eén foutmelding per optie (undefined = in orde) */
  opties?: (string | undefined)[]
  uitleg?: string
}

export const newQuestion = (id: string): QuestionDraft => ({ id, vraag: '', opties: ['', '', '', ''], juisteAntwoord: 0, uitleg: '' })

export function validateQuestion(q: QuestionDraft): QuestionErrors {
  const errors: QuestionErrors = {}
  if (!q.vraag.trim()) errors.vraag = 'Vul de vraag in.'
  const opties = q.opties.map((o, i) => (o.trim() ? undefined : `Vul antwoordoptie ${i + 1} in.`))
  if (opties.some(Boolean)) errors.opties = opties
  if (!q.uitleg.trim()) errors.uitleg = 'Vul een uitleg in; die zie je na het beantwoorden.'
  return errors
}

export const hasErrors = (errors: object): boolean => Object.keys(errors).length > 0
