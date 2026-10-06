import { useId, useRef, useState } from 'react'
import { VideoPlayer } from '../VideoPlayer'
import { publicUrl } from '../../lib/media'
import { isValidVideo } from '../../lib/productForm'
import { parseVideo } from '../../lib/media'
import { MAX_BYTES, uploadMedia, validateMediaFile, type MediaKind } from '../../lib/storage'

interface UploadProps {
  kind: MediaKind
  label: string
  onUploaded: (url: string) => void
  onBusyChange?: (busy: boolean) => void
}

/** Bestandskiezer met voortgangsbalk en duidelijke foutmeldingen. */
export function MediaUploadButton({ kind, label, onUploaded, onBusyChange }: UploadProps) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const accept = kind === 'image' ? 'image/jpeg,image/png,image/webp,image/svg+xml' : 'video/mp4'
  const maxMb = MAX_BYTES[kind] / 1024 / 1024

  async function onPick(file: File | undefined) {
    if (!file) return
    setError(null)
    const invalid = validateMediaFile(file, kind)
    if (invalid) return setError(invalid)
    setProgress(0)
    onBusyChange?.(true)
    try {
      onUploaded(await uploadMedia(file, kind, setProgress))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Uploaden is niet gelukt.')
    } finally {
      setProgress(null)
      onBusyChange?.(false)
      if (input.current) input.current.value = ''
    }
  }

  const busy = progress !== null
  return (
    <div>
      <input ref={input} id={id} type="file" accept={accept} className="sr-only" disabled={busy} onChange={(e) => void onPick(e.target.files?.[0])} aria-describedby={`${id}-hint ${error ? `${id}-error` : ''}`} />
      <label htmlFor={id} className={`btn-secondary cursor-pointer has-[:focus-visible]:outline ${busy ? 'pointer-events-none opacity-60' : ''}`}>{label}</label>
      <p id={`${id}-hint`} className="field-hint">Maximaal {maxMb} MB.</p>
      {busy && (
        <div className="mt-2" role="progressbar" aria-label="Voortgang van het uploaden" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-valuetext={`${progress}%`}>
          <div className="h-2.5 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-kyocera-red transition-[width]" style={{ width: `${progress}%` }} /></div>
          <p className="mt-1 text-sm text-graphite">Uploaden… {progress}%</p>
        </div>
      )}
      {error && <p id={`${id}-error`} role="alert" className="field-error">{error}</p>}
    </div>
  )
}

interface ImageFieldProps {
  value: string
  onChange: (url: string) => void
  onBusyChange?: (busy: boolean) => void
  error?: string
}

export function ImageField({ value, onChange, onBusyChange, error }: ImageFieldProps) {
  return (
    <fieldset aria-describedby={error ? 'afbeelding-error' : undefined}>
      <legend className="field-label">Afbeelding</legend>
      <div className="mt-2 grid gap-4 sm:grid-cols-[14rem_1fr] sm:items-start">
        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-mist bg-fog">
          {value ? (
            <img src={publicUrl('images', value)} alt="Voorbeeld van de gekozen afbeelding" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-steel">Nog geen afbeelding gekozen</div>
          )}
        </div>
        <div className="space-y-3">
          <MediaUploadButton kind="image" label={value ? 'Afbeelding vervangen' : 'Afbeelding uploaden'} onUploaded={onChange} onBusyChange={onBusyChange} />
          {value && <button type="button" className="btn-ghost -ml-3" onClick={() => onChange('')}>Afbeelding verwijderen</button>}
          <p className="field-hint">Bij voorkeur 4:3, ongeveer 1200 x 900 pixels.</p>
        </div>
      </div>
      {error && <p id="afbeelding-error" className="field-error">{error}</p>}
    </fieldset>
  )
}

type VideoMode = 'youtube' | 'mp4' | 'geen'
const modeOf = (value: string): VideoMode => (!value.trim() ? 'geen' : parseVideo(value).kind === 'youtube' ? 'youtube' : 'mp4')

interface VideoFieldProps {
  value: string
  onChange: (url: string) => void
  onBusyChange?: (busy: boolean) => void
  error?: string
  /** Titel voor de voorbeeldspeler */
  title: string
}

export function VideoField({ value, onChange, onBusyChange, error, title }: VideoFieldProps) {
  const name = useId()
  const [mode, setMode] = useState<VideoMode>(() => modeOf(value))
  const choose = (next: VideoMode) => {
    if (next === mode) return
    setMode(next)
    onChange('') // een YouTube-link en een mp4 sluiten elkaar uit
  }
  const radio = (m: VideoMode, label: string) => (
    <label className="inline-flex min-h-12 cursor-pointer items-center gap-2 pr-4">
      <input type="radio" name={name} checked={mode === m} onChange={() => choose(m)} className="h-5 w-5 accent-kyocera-red" />
      {label}
    </label>
  )
  return (
    <fieldset aria-describedby={error ? 'video-error' : undefined}>
      <legend className="field-label">Video</legend>
      <div className="mt-1 flex flex-wrap">
        {radio('youtube', 'YouTube-link')}
        {radio('mp4', 'Eigen video (mp4)')}
        {radio('geen', 'Geen video')}
      </div>
      {mode === 'youtube' && (
        <div className="mt-2">
          <label htmlFor="video-url" className="sr-only">YouTube-link</label>
          <input id="video-url" type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="field !mt-0" aria-invalid={error ? true : undefined} aria-describedby={error ? 'video-error' : undefined} />
        </div>
      )}
      {mode === 'mp4' && (
        <div className="mt-2 space-y-2">
          <MediaUploadButton kind="video" label={value ? 'Andere video uploaden' : 'Video uploaden'} onUploaded={onChange} onBusyChange={onBusyChange} />
          {value && <p className="break-all text-sm text-graphite">Geüpload: {value.split('/').pop()}</p>}
        </div>
      )}
      {mode === 'geen' && <p className="field-hint">Bij de productpagina verschijnt dan de melding “Video volgt binnenkort”.</p>}
      {value && isValidVideo(value) && (
        <div className="mt-3 max-w-xl">
          <p className="mb-1 text-sm font-semibold text-graphite">Voorbeeld</p>
          <VideoPlayer source={value} title={title || 'Video'} />
        </div>
      )}
      {error && <p id="video-error" className="field-error">{error}</p>}
    </fieldset>
  )
}
