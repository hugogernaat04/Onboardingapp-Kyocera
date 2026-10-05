import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { parseVideo } from '../lib/media'

/** Detecteert zelf of het veld een YouTube-link of een eigen mp4 is. Leeg = placeholder. */
export function VideoPlayer({ source, title }: { source: string; title: string }) {
  const { t } = useLanguage()
  const video = parseVideo(source)
  const [failed, setFailed] = useState(false)
  const frame = 'aspect-video w-full overflow-hidden rounded-xl bg-ink'

  if (video.kind === 'none' || failed) {
    return (
      <div className={`${frame} flex flex-col items-center justify-center gap-3 p-6 text-center text-white`}>
        <svg aria-hidden="true" viewBox="0 0 48 48" className="h-12 w-12 text-kyocera-red">
          <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M20 16.5v15l12-7.5z" fill="currentColor" />
        </svg>
        <p className="font-display text-xl font-semibold">{t('video.soon')}</p>
      </div>
    )
  }

  if (video.kind === 'youtube') {
    return (
      <div className={frame}>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
          title={t('video.title', { name: title })}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  return (
    <div className={frame}>
      <video
        className="h-full w-full"
        controls
        playsInline
        preload="metadata"
        aria-label={t('video.title', { name: title })}
        onError={() => setFailed(true)}
      >
        <source src={video.src} type="video/mp4" />
        {t('video.unsupported')}
      </video>
    </div>
  )
}
