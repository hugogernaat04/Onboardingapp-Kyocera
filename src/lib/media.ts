/** Maakt van een bestandsnaam in public/ een URL die ook onder de GitHub Pages-basis werkt. */
export const publicUrl = (folder: 'images' | 'videos', file: string): string =>
  /^(https?:)?\/\//.test(file) ? file : `${import.meta.env.BASE_URL}${folder}/${file}`

export type VideoSource =
  | { kind: 'youtube'; id: string }
  | { kind: 'file'; src: string }
  | { kind: 'none' }

const YOUTUBE_ID = /^[\w-]{11}$/

/** Herkent of het video-veld een YouTube-link, een mp4-bestand of leeg is. */
export function parseVideo(value: string): VideoSource {
  const v = value.trim()
  if (!v) return { kind: 'none' }
  try {
    const url = new URL(v)
    const host = url.hostname.replace(/^www\.|^m\./, '')
    let id: string | null = null
    if (host === 'youtu.be') id = url.pathname.slice(1)
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] ?? null
    }
    if (id && YOUTUBE_ID.test(id)) return { kind: 'youtube', id }
  } catch {
    // geen absolute URL: behandel als bestandsnaam
  }
  return { kind: 'file', src: publicUrl('videos', v) }
}

/** Mogelijke bestandsnamen van het officiële logo, in volgorde van voorkeur. */
export const LOGO_SOURCES = ['kyocera-logo.svg', 'kyocera-logo.png'].map(
  (f) => `${import.meta.env.BASE_URL}brand/${f}`,
)
