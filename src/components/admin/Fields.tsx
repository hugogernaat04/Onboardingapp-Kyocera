import type { ReactNode } from 'react'

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: ReactNode
  multiline?: boolean
  rows?: number
  type?: string
  maxLength?: number
  required?: boolean
  placeholder?: string
  autoComplete?: string
}

/** Label, invoer, hint en foutmelding in één, met de juiste aria-koppelingen. */
export function TextField({ id, label, value, onChange, error, hint, multiline, rows = 4, type = 'text', maxLength, required, placeholder, autoComplete }: TextFieldProps) {
  const describedBy = [error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined
  const common = {
    id,
    value,
    maxLength,
    placeholder,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    'aria-required': required || undefined,
    className: 'field',
  } as const
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span aria-hidden="true" className="text-kyocera-red-dark"> *</span>}
      </label>
      {multiline ? (
        <textarea {...common} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  )
}

interface ListProps {
  id: string
  legend: string
  /** Enkelvoud, voor de knoplabels: "Kenmerk" */
  itemLabel: string
  values: string[]
  onChange: (values: string[]) => void
  error?: string
  hint?: string
}

const iconBtn =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-graphite hover:bg-fog disabled:opacity-40 disabled:hover:bg-transparent'

/** Lijst met tekstregels waar je regels kunt toevoegen, verwijderen en verplaatsen. */
export function StringListEditor({ id, legend, itemLabel, values, onChange, error, hint }: ListProps) {
  const set = (i: number, v: string) => onChange(values.map((x, j) => (j === i ? v : x)))
  const move = (i: number, d: -1 | 1) => {
    const next = [...values]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  const describedBy = [error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined
  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="field-label">{legend}<span aria-hidden="true" className="text-kyocera-red-dark"> *</span></legend>
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      <ul className="mt-2 space-y-2">
        {values.map((value, i) => (
          <li key={i} className="flex items-center gap-1">
            <input
              aria-label={`${itemLabel} ${i + 1}`}
              value={value}
              onChange={(e) => set(i, e.target.value)}
              aria-invalid={error && !value.trim() ? true : undefined}
              className="field !mt-0"
            />
            <button type="button" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`${itemLabel} ${i + 1} omhoog verplaatsen`}>
              <Arrow dir="up" />
            </button>
            <button type="button" className={iconBtn} disabled={i === values.length - 1} onClick={() => move(i, 1)} aria-label={`${itemLabel} ${i + 1} omlaag verplaatsen`}>
              <Arrow dir="down" />
            </button>
            <button type="button" className={iconBtn} disabled={values.length === 1} onClick={() => onChange(values.filter((_, j) => j !== i))} aria-label={`${itemLabel} ${i + 1} verwijderen`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn-secondary mt-3" onClick={() => onChange([...values, ''])}>{itemLabel} toevoegen</button>
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </fieldset>
  )
}

function Arrow({ dir }: { dir: 'up' | 'down' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === 'up' ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
    </svg>
  )
}
