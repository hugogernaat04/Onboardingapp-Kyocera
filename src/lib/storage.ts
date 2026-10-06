import { MEDIA_BUCKET, SUPABASE_ANON_KEY, SUPABASE_URL, supabase } from './supabase'

export type MediaKind = 'image' | 'video'

export const MAX_BYTES: Record<MediaKind, number> = { image: 5 * 1024 * 1024, video: 50 * 1024 * 1024 }
const TYPES: Record<MediaKind, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  video: ['video/mp4'],
}
const EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
}

const mb = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`

/** Controleert type en grootte vóór het uploaden. Geeft een Nederlandse foutmelding of null. */
export function validateMediaFile(file: { type: string; size: number }, kind: MediaKind): string | null {
  if (!TYPES[kind].includes(file.type)) {
    return kind === 'image' ? 'Kies een afbeelding in JPG-, PNG-, WebP- of SVG-formaat.' : 'Kies een video in mp4-formaat.'
  }
  if (file.size > MAX_BYTES[kind]) {
    return `Het bestand is te groot (${mb(file.size)}). De maximale grootte is ${mb(MAX_BYTES[kind])}.`
  }
  return null
}

export const publicMediaUrl = (path: string) => `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`

/** Pad in de bucket als de URL naar product-media verwijst, anders null (bv. een YouTube-link of een bestand in public/). */
export function mediaPathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`
  const i = url.indexOf(marker)
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split('?')[0])
}

/**
 * Uploadt naar de bucket product-media en meldt de voortgang (0-100). Gebruikt XMLHttpRequest,
 * omdat fetch geen uploadvoortgang geeft. Geeft de publieke URL terug.
 */
export async function uploadMedia(file: File, kind: MediaKind, onProgress: (percent: number) => void): Promise<string> {
  const invalid = validateMediaFile(file, kind)
  if (invalid) throw new Error(invalid)
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Je bent niet meer ingelogd. Log opnieuw in en probeer het nog eens.')

  const path = `${kind === 'image' ? 'afbeeldingen' : 'video'}/${crypto.randomUUID()}.${EXTENSION[file.type]}`
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/${MEDIA_BUCKET}/${path}`)
    xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.setRequestHeader('cache-control', 'max-age=31536000')
    xhr.setRequestHeader('x-upsert', 'false')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve(publicMediaUrl(path))
      if (xhr.status === 413) return reject(new Error(`Het bestand is te groot voor de opslag (maximaal ${mb(MAX_BYTES[kind])}).`))
      if (xhr.status === 401 || xhr.status === 403) return reject(new Error('Je hebt geen rechten om te uploaden. Alleen admins mogen dat.'))
      reject(new Error('Uploaden is niet gelukt. Probeer het opnieuw.'))
    }
    xhr.onerror = () => reject(new Error('Uploaden is mislukt door een netwerkfout. Controleer je verbinding en probeer het opnieuw.'))
    xhr.onabort = () => reject(new Error('Uploaden is afgebroken.'))
    xhr.send(file)
  })
}

/** Verwijdert een bestand uit de bucket als het daar staat. Fouten worden genegeerd: het gaat om opruimen. */
export async function removeMedia(url: string): Promise<void> {
  const path = mediaPathFromUrl(url)
  if (path) await supabase.storage.from(MEDIA_BUCKET).remove([path])
}
