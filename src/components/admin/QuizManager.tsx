import { useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from '../ConfirmDialog'
import { TextField } from './Fields'
import { errorMessage, saveQuestions } from '../../lib/adminApi'
import type { ProductTranslation, QuestionRow } from '../../lib/catalog'
import { hasErrors, newQuestion, QUIZ_SIZE, validateQuestion, type QuestionDraft, type QuestionErrors } from '../../lib/productForm'

interface Props {
  productId: string
  questions: QuestionRow[]
  en: ProductTranslation | null
  /** Wordt aangeroepen na het opslaan, zodat de pagina de nieuwe stand kan laden. */
  onSaved: () => void
  onDirtyChange: (dirty: boolean) => void
  onChange: (questions: QuestionDraft[]) => void
}

const toDrafts = (rows: QuestionRow[]): QuestionDraft[] =>
  [...rows].sort((a, b) => a.volgorde - b.volgorde).map((r) => ({ id: r.id, vraag: r.vraag, opties: r.opties, juisteAntwoord: r.juiste_antwoord, uitleg: r.uitleg }))

const iconBtn = 'inline-flex h-12 w-12 items-center justify-center rounded-full text-graphite hover:bg-fog disabled:opacity-40 disabled:hover:bg-transparent'

export function QuizManager({ productId, questions, en, onSaved, onDirtyChange, onChange }: Props) {
  const saved = useMemo(() => toDrafts(questions), [questions])
  const [drafts, setDrafts] = useState<QuestionDraft[]>(saved)
  const [showErrors, setShowErrors] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)

  const dirty = JSON.stringify(drafts) !== JSON.stringify(saved)
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange])
  useEffect(() => onChange(drafts), [drafts, onChange])

  const errors: QuestionErrors[] = drafts.map(validateQuestion)
  const update = (i: number, patch: Partial<QuestionDraft>) => {
    setMessage(null)
    setDrafts((d) => d.map((q, j) => (j === i ? { ...q, ...patch } : q)))
  }
  const move = (i: number, dir: -1 | 1) =>
    setDrafts((d) => {
      const next = [...d]
      ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
      return next
    })

  async function save() {
    setShowErrors(true)
    setMessage(null)
    if (errors.some(hasErrors)) return setMessage({ kind: 'error', text: 'Niet opgeslagen: controleer de gemarkeerde velden.' })
    setBusy(true)
    try {
      await saveQuestions(productId, drafts, saved.map((q) => q.id), en)
      setMessage({ kind: 'ok', text: 'Quizvragen opgeslagen.' })
      setShowErrors(false)
      onSaved()
    } catch (e) {
      setMessage({ kind: 'error', text: errorMessage(e, 'De quizvragen konden niet worden opgeslagen.') })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="quiz-titel" className="rounded-2xl border border-mist p-4 sm:p-6">
      <h2 id="quiz-titel" className="text-2xl">Quizvragen</h2>
      {drafts.length < QUIZ_SIZE && (
        <p role="status" className="mt-3 rounded-xl bg-kyocera-red-soft p-4 text-graphite">
          Dit product heeft {drafts.length} van de {QUIZ_SIZE} quizvragen. De quiz werkt met {QUIZ_SIZE} vragen en een product is gehaald bij minimaal 4 goed.
        </p>
      )}

      {drafts.length === 0 && <p className="mt-4 text-graphite">Er zijn nog geen vragen. Voeg de eerste toe.</p>}

      <ol className="mt-4 space-y-5">
        {drafts.map((q, i) => {
          const err = showErrors ? errors[i] : {}
          const fid = `vraag-${q.id}`
          return (
            <li key={q.id} className="rounded-xl bg-fog p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl">Vraag {i + 1}</h3>
                <div className="flex">
                  <button type="button" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Vraag ${i + 1} omhoog verplaatsen`}>↑</button>
                  <button type="button" className={iconBtn} disabled={i === drafts.length - 1} onClick={() => move(i, 1)} aria-label={`Vraag ${i + 1} omlaag verplaatsen`}>↓</button>
                  <button type="button" className={iconBtn} onClick={() => setRemoving(i)} aria-label={`Vraag ${i + 1} verwijderen`}>✕</button>
                </div>
              </div>
              <div className="mt-3 space-y-4">
                <TextField id={`${fid}-tekst`} label="Vraag" value={q.vraag} onChange={(v) => update(i, { vraag: v })} error={err.vraag} multiline rows={2} required />
                <fieldset>
                  <legend className="field-label">Antwoordopties <span className="font-normal text-steel">(kies bij de juiste optie de radioknop)</span></legend>
                  <ul className="mt-2 space-y-2">
                    {q.opties.map((optie, o) => (
                      <li key={o} className="flex items-center gap-2">
                        <label className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-white">
                          <input type="radio" name={`${fid}-juist`} checked={q.juisteAntwoord === o} onChange={() => update(i, { juisteAntwoord: o })} aria-label={`Optie ${o + 1} is het juiste antwoord`} className="h-5 w-5 accent-kyocera-red" />
                        </label>
                        <div className="flex-1">
                          <input aria-label={`Antwoordoptie ${o + 1} van vraag ${i + 1}`} value={optie} onChange={(e) => update(i, { opties: q.opties.map((x, k) => (k === o ? e.target.value : x)) })} aria-invalid={err.opties?.[o] ? true : undefined} className="field !mt-0" />
                          {err.opties?.[o] && <p className="field-error">{err.opties[o]}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <TextField id={`${fid}-uitleg`} label="Uitleg" value={q.uitleg} onChange={(v) => update(i, { uitleg: v })} error={err.uitleg} hint="Dit ziet de verkoper na het beantwoorden." multiline rows={2} required />
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" onClick={() => { setMessage(null); setDrafts((d) => [...d, newQuestion(crypto.randomUUID())]) }}>Vraag toevoegen</button>
        <button type="button" className="btn-primary" onClick={() => void save()} disabled={busy || !dirty}>Quizvragen opslaan</button>
        {dirty && <span className="text-sm text-steel">Niet-opgeslagen wijzigingen</span>}
      </div>
      <div role="status" aria-live="polite" className="mt-3">
        {message && <p className={`rounded-xl p-3 font-semibold ${message.kind === 'ok' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'}`}>{message.text}</p>}
      </div>

      <ConfirmDialog
        open={removing !== null}
        title="Vraag verwijderen?"
        confirmLabel="Verwijderen"
        cancelLabel="Annuleren"
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          if (removing !== null) setDrafts((d) => d.filter((_, j) => j !== removing))
          setRemoving(null)
        }}
      >
        <p>De vraag verdwijnt pas definitief als je daarna op “Quizvragen opslaan” klikt.</p>
      </ConfirmDialog>
    </section>
  )
}
