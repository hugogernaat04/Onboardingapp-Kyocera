export const talen = ['nl', 'en'] as const
export type Taal = (typeof talen)[number]

export interface QuizQuestion {
  vraag: string
  /** Precies 4 antwoordopties */
  opties: string[]
  /** Index (0-3) van de juiste optie */
  juisteAntwoord: number
  uitleg: string
}

export interface QuizQuestionText {
  vraag: string
  opties: string[]
  uitleg: string
}

/** Engelse vertaling van een product, bewaard in de kolom `products.en`. */
export interface ProductTranslation {
  categorie: string
  korteOmschrijving: string
  omschrijving: string
  kenmerken: string[]
  doelgroep: string
  verkoopargumenten: string[]
  quiz?: QuizQuestionText[]
}

export interface Product {
  id: string
  slug: string
  naam: string
  categorie: string
  korteOmschrijving: string
  omschrijving: string
  kenmerken: string[]
  doelgroep: string
  verkoopargumenten: string[]
  /** Volledige URL (Storage) of bestandsnaam in public/images/ */
  afbeelding: string
  /** YouTube-link, URL van een mp4 of "" */
  video: string
  quiz: QuizQuestion[]
  en: ProductTranslation | null
}

/** Een product in één taal, klaar om te tonen. `categorieId` is de vaste (Nederlandse) sleutel voor het filter. */
export type LocalizedProduct = Omit<Product, 'en'> & { categorieId: string }

/** Rijen zoals ze uit Supabase komen. */
export interface ProductRow {
  id: string
  slug: string
  naam: string
  categorie: string
  korte_omschrijving: string
  omschrijving: string
  kenmerken: string[]
  doelgroep: string
  verkoopargumenten: string[]
  afbeelding_url: string
  video_url: string
  volgorde: number
  gepubliceerd: boolean
  en: ProductTranslation | null
  created_at: string
  updated_at: string
}

export interface QuestionRow {
  id: string
  product_id: string
  vraag: string
  opties: string[]
  juiste_antwoord: number
  uitleg: string
  volgorde: number
}

export function rowToProduct(row: ProductRow & { quiz_questions?: QuestionRow[] }): Product {
  const questions = [...(row.quiz_questions ?? [])].sort((a, b) => a.volgorde - b.volgorde)
  return {
    id: row.id,
    slug: row.slug,
    naam: row.naam,
    categorie: row.categorie,
    korteOmschrijving: row.korte_omschrijving,
    omschrijving: row.omschrijving,
    kenmerken: row.kenmerken,
    doelgroep: row.doelgroep,
    verkoopargumenten: row.verkoopargumenten,
    afbeelding: row.afbeelding_url,
    video: row.video_url,
    quiz: questions.map((q) => ({
      vraag: q.vraag,
      opties: q.opties,
      juisteAntwoord: q.juiste_antwoord,
      uitleg: q.uitleg,
    })),
    en: row.en,
  }
}

export function localizeProduct(product: Product, taal: Taal): LocalizedProduct {
  const { en, ...base } = product
  const tekst = taal === 'en' ? en : null
  if (!tekst) return { ...base, categorieId: product.categorie }
  const { quiz: quizTekst, ...rest } = tekst
  // De Engelse quiz hoort bij de vragen in dezelfde volgorde; wijkt het aantal af, dan blijft de Nederlandse quiz staan.
  const quiz =
    quizTekst && quizTekst.length === product.quiz.length
      ? product.quiz.map((q, i) => ({ ...q, ...quizTekst[i] }))
      : product.quiz
  return { ...base, ...rest, categorieId: product.categorie, quiz }
}
