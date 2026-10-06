import { rowToProduct, type Product, type ProductRow, type QuestionRow } from './catalog'
import { supabase } from './supabase'

/** Alle gepubliceerde producten met hun quizvragen, op volgorde. Ook admins zien hier alleen gepubliceerde producten. */
export async function fetchPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, quiz_questions(*)')
    .eq('gepubliceerd', true)
    .order('volgorde', { ascending: true })
  if (error) throw error
  return ((data ?? []) as (ProductRow & { quiz_questions: QuestionRow[] })[]).map(rowToProduct)
}
