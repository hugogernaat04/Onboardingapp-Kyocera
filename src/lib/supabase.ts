import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False zolang VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY ontbreken; de app toont dan een uitleg in plaats van te crashen. */
export const isSupabaseConfigured = Boolean(url && key)

/**
 * Links uit e-mails komen op twee manieren binnen die niet bij HashRouter passen:
 * - een foutmelding in de hash (#error=access_denied&error_code=otp_expired), bv. bij een link die al gebruikt is;
 * - ?token_hash=... in de query (zonder #/ route).
 * We zetten beide om naar een gewone route, vóórdat de router start.
 */
function normalizeAuthLink() {
  const { pathname, search, hash } = window.location
  if (new URLSearchParams(hash.replace(/^#/, '')).get('error_code')) {
    window.history.replaceState(null, '', `${pathname}#/link-verlopen`)
  } else if (new URLSearchParams(search).get('token_hash')) {
    window.history.replaceState(null, '', `${pathname}#/auth/bevestigen${search}`)
  }
}
normalizeAuthLink()

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
