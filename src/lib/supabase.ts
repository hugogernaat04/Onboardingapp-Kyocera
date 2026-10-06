import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False zolang VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY ontbreken; de app toont dan een uitleg in plaats van te crashen. */
export const isSupabaseConfigured = Boolean(url && key)

/**
 * Uitnodigings- en resetlinks van Supabase kunnen het type (invite/recovery) in de URL-hash zetten.
 * We onthouden dat vóór de client de hash opruimt, zodat de app daarna het wachtwoordscherm kan tonen.
 */
export const initialAuthType = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('type')

// Gebruik alleen de anon key: de service_role key hoort nooit in de frontend.
export const supabase = createClient(url ?? 'http://localhost:54321', key ?? 'niet-ingesteld')

export const MEDIA_BUCKET = 'product-media'
export const SUPABASE_URL = url ?? ''
export const SUPABASE_ANON_KEY = key ?? ''
