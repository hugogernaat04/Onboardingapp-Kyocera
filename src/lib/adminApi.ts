import { cleanList, type ProductFormValues, type QuestionDraft } from './productForm'
import { removeMedia } from './storage'
import type { ProductRow, ProductTranslation, QuestionRow } from './catalog'
import type { Profile, Rol } from '../context/AuthContext'
import { supabase } from './supabase'

export interface AdminProductRow extends ProductRow {
  quiz_questions: { count: number }[]
}

export type AdminProductDetail = ProductRow & { quiz_questions: QuestionRow[] }

const UNIQUE_VIOLATION = '23505'

export class SlugTakenError extends Error {
  constructor() {
    super('Deze slug is al in gebruik. Kies een andere.')
  }
}

export async function listAdminProducts(): Promise<AdminProductRow[]> {
  const { data, error } = await supabase.from('products').select('*, quiz_questions(count)').order('volgorde', { ascending: true })
  if (error) throw error
  return (data ?? []) as AdminProductRow[]
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail | null> {
  const { data, error } = await supabase.from('products').select('*, quiz_questions(*)').eq('id', id).maybeSingle()
  if (error) throw error
  return (data as AdminProductDetail | null) ?? null
}

const toRowValues = (v: ProductFormValues) => ({
  slug: v.slug.trim(),
  naam: v.naam.trim(),
  categorie: v.categorie.trim(),
  korte_omschrijving: v.korteOmschrijving.trim(),
  omschrijving: v.omschrijving.trim(),
  kenmerken: cleanList(v.kenmerken),
  doelgroep: v.doelgroep.trim(),
  verkoopargumenten: cleanList(v.verkoopargumenten),
  afbeelding_url: v.afbeelding.trim(),
  video_url: v.video.trim(),
  gepubliceerd: v.gepubliceerd,
})

/** Maakt een product aan (achteraan in de volgorde) of werkt het bij. Geeft het opgeslagen product terug. */
export async function saveProduct(values: ProductFormValues, id?: string): Promise<ProductRow> {
  if (id) {
    const { data, error } = await supabase.from('products').update(toRowValues(values)).eq('id', id).select().single()
    if (error) throw error.code === UNIQUE_VIOLATION ? new SlugTakenError() : error
    return data as ProductRow
  }
  const { data: last } = await supabase.from('products').select('volgorde').order('volgorde', { ascending: false }).limit(1)
  const volgorde = ((last?.[0] as { volgorde: number } | undefined)?.volgorde ?? -1) + 1
  const { data, error } = await supabase.from('products').insert({ ...toRowValues(values), volgorde }).select().single()
  if (error) throw error.code === UNIQUE_VIOLATION ? new SlugTakenError() : error
  return data as ProductRow
}

export async function setPublished(id: string, gepubliceerd: boolean): Promise<void> {
  const { error } = await supabase.from('products').update({ gepubliceerd }).eq('id', id)
  if (error) throw error
}

/** Verwijdert het product (de quizvragen en resultaten verdwijnen mee) en ruimt zijn bestanden in Storage op. */
export async function deleteProduct(product: Pick<ProductRow, 'id' | 'afbeelding_url' | 'video_url'>): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', product.id)
  if (error) throw error
  await Promise.all([removeMedia(product.afbeelding_url), removeMedia(product.video_url)])
}

/** Zet de producten in de gegeven volgorde (alleen rijen waarvan het nummer verandert worden bijgewerkt). */
export async function saveOrder(ordered: Pick<ProductRow, 'id' | 'volgorde'>[]): Promise<void> {
  const changes = ordered.map((p, i) => ({ id: p.id, volgorde: i, was: p.volgorde })).filter((p) => p.volgorde !== p.was)
  const results = await Promise.all(changes.map((c) => supabase.from('products').update({ volgorde: c.volgorde }).eq('id', c.id)))
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

/** Slaat alle quizvragen van een product op: verwijdert wat weg is, voegt toe en werkt bij, met de volgorde van de lijst. */
export async function saveQuestions(
  productId: string,
  drafts: QuestionDraft[],
  existingIds: string[],
  en: ProductTranslation | null,
): Promise<void> {
  const keep = new Set(drafts.map((d) => d.id))
  const removed = existingIds.filter((id) => !keep.has(id))
  if (removed.length) {
    const { error } = await supabase.from('quiz_questions').delete().in('id', removed)
    if (error) throw error
  }
  if (drafts.length) {
    const { error } = await supabase.from('quiz_questions').upsert(
      drafts.map((d, i) => ({
        id: d.id,
        product_id: productId,
        vraag: d.vraag.trim(),
        opties: d.opties.map((o) => o.trim()),
        juiste_antwoord: d.juisteAntwoord,
        uitleg: d.uitleg.trim(),
        volgorde: i,
      })),
    )
    if (error) throw error
  }
  // De Engelse quizteksten horen bij de oude vragen en volgorde; na een wijziging laten we ze vervallen.
  if (en?.quiz) {
    const { quiz: _verouderd, ...rest } = en
    void _verouderd
    const { error } = await supabase.from('products').update({ en: rest }).eq('id', productId)
    if (error) throw error
  }
}

export async function listProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as Profile[]
}

export interface AdminResult {
  user_id: string
  product_id: string
  score: number
  gehaald: boolean
  created_at: string
}

export async function listAllResults(): Promise<AdminResult[]> {
  const { data, error } = await supabase.from('quiz_results').select('user_id,product_id,score,gehaald,created_at')
  if (error) throw error
  return (data ?? []) as AdminResult[]
}

export async function listProductNames(): Promise<{ id: string; naam: string; gepubliceerd: boolean }[]> {
  const { data, error } = await supabase.from('products').select('id,naam,gepubliceerd').order('volgorde', { ascending: true })
  if (error) throw error
  return (data ?? []) as { id: string; naam: string; gepubliceerd: boolean }[]
}

export async function setUserRole(userId: string, rol: Rol): Promise<void> {
  const { error } = await supabase.from('profiles').update({ rol }).eq('id', userId)
  if (error) throw error
}

/** Foutmelding voor de gebruiker. Supabase-fouten zijn gewone objecten met een `message`, geen Error-instanties. */
export function errorMessage(e: unknown, fallback: string): string {
  if (e instanceof SlugTakenError) return e.message
  const detail = typeof e === 'object' && e !== null && 'message' in e ? String((e as { message: unknown }).message) : ''
  return detail ? `${fallback} (${detail})` : fallback
}
