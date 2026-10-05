import { useState } from 'react'
import { parseVideo } from '../lib/media'

/** Detecteert zelf of het veld een YouTube-link of een eigen mp4 is. Leeg = placeholder. */
export function VideoPlayer({ source, title }: { source: string; title: string }) {
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
        <p className="font-display text-xl font-semibold">Video volgt binnenkort</p>
      </div>
    )
  }

  if (video.kind === 'youtube') {
    return (
      <div className={frame}>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
          title={`Uitlegvideo: ${title}`}
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
        aria-label={`Uitlegvideo: ${title}`}
        onError={() => setFailed(true)}
      >
        <source src={video.src} type="video/mp4" />
        Je browser kan deze video niet afspelen.
      </video>
    </div>
  )
}
