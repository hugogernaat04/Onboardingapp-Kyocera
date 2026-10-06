import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { StringListEditor, TextField } from '../../components/admin/Fields'
import { ImageField, VideoField } from '../../components/admin/MediaFields'
import { PreviewDialog } from '../../components/admin/PreviewDialog'
import { QuizManager } from '../../components/admin/QuizManager'
import { ProductView } from '../../components/ProductView'
import { LoadingRegion, Skeleton } from '../../components/Skeleton'
import { errorMessage, getAdminProduct, saveProduct, type AdminProductDetail } from '../../lib/adminApi'
import type { LocalizedProduct } from '../../lib/catalog'
import { cleanList, emptyProductForm, hasErrors, slugify, validateProduct, type ProductFormValues, type QuestionDraft } from '../../lib/productForm'
import { removeMedia } from '../../lib/storage'
import { useQuery } from '../../hooks/useQuery'

const fromRow = (r: AdminProductDetail): ProductFormValues => ({
  slug: r.slug,
  naam: r.naam,
  categorie: r.categorie,
  korteOmschrijving: r.korte_omschrijving,
  omschrijving: r.omschrijving,
  kenmerken: r.kenmerken.length ? r.kenmerken : [''],
  doelgroep: r.doelgroep,
  verkoopargumenten: r.verkoopargumenten.length ? r.verkoopargumenten : [''],
  afbeelding: r.afbeelding_url,
  video: r.video_url,
  gepubliceerd: r.gepubliceerd,
})

export default function ProductEdit() {
  const { id } = useParams()
  const { data, loading, error, reload } = useQuery(() => (id ? getAdminProduct(id) : Promise.resolve(null)), [id])

  if (id && (loading || data?.id !== id) && !error) {
    return (
      <LoadingRegion label="Product laden">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-6 h-64 w-full" />
      </LoadingRegion>
    )
  }
  if (id && error) {
    return (
      <div role="alert" className="rounded-xl border-2 border-dashed border-mist p-8 text-center">
        <p className="font-display text-xl font-semibold">Het product kon niet worden geladen</p>
        <button type="button" className="btn-primary mt-4" onClick={reload}>Opnieuw proberen</button>
      </div>
    )
  }
  if (id && !data) {
    return (
      <div className="rounded-xl border-2 border-dashed border-mist p-8 text-center">
        <p className="font-display text-xl font-semibold">Dit product bestaat niet (meer)</p>
        <Link to="/admin" className="btn-primary mt-4">Terug naar de producten</Link>
      </div>
    )
  }
  return <ProductEditor key={data?.id ?? 'nieuw'} product={data ?? null} reload={reload} />
}

function ProductEditor({ product, reload }: { product: AdminProductDetail | null; reload: () => void }) {
  const navigate = useNavigate()
  const [initial] = useState<ProductFormValues>(() => (product ? fromRow(product) : emptyProductForm))
  const [values, setValues] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const persistedMedia = useRef({ afbeelding: initial.afbeelding, video: initial.video })
  const [slugTouched, setSlugTouched] = useState(!!product)
  const [showErrors, setShowErrors] = useState(false)
  const [busy, setBusy] = useState(false)
  const [mediaBusy, setMediaBusy] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [quizDirty, setQuizDirty] = useState(false)
  const [drafts, setDrafts] = useState<QuestionDraft[]>([])
  const [preview, setPreview] = useState(false)
  const summary = useRef<HTMLDivElement>(null)

  const errors = validateProduct(values)
  const shown = showErrors ? errors : {}
  const dirty = JSON.stringify(values) !== JSON.stringify(saved)
  const unsaved = dirty || quizDirty

  // Waarschuwing bij het verlaten van de pagina met niet-opgeslagen wijzigingen.
  const unsavedRef = useRef(unsaved)
  const skipBlock = useRef(false)
  useEffect(() => {
    unsavedRef.current = unsaved
  })
  const blocker = useBlocker(() => unsavedRef.current && !skipBlock.current)
  useEffect(() => {
    if (!unsaved) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [unsaved])

  const patch = (p: Partial<ProductFormValues>) => {
    setMessage(null)
    setValues((v) => ({ ...v, ...p }))
  }
  const setNaam = (naam: string) => patch(slugTouched ? { naam } : { naam, slug: slugify(naam) })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setShowErrors(true)
    setMessage(null)
    if (hasErrors(errors)) {
      setMessage({ kind: 'error', text: `Niet opgeslagen: controleer ${Object.keys(errors).length === 1 ? 'het gemarkeerde veld' : `de ${Object.keys(errors).length} gemarkeerde velden`}.` })
      summary.current?.focus()
      return
    }
    setBusy(true)
    try {
      const row = await saveProduct(values, product?.id)
      const old = persistedMedia.current
      if (old.afbeelding && old.afbeelding !== values.afbeelding) void removeMedia(old.afbeelding)
      if (old.video && old.video !== values.video) void removeMedia(old.video)
      persistedMedia.current = { afbeelding: values.afbeelding, video: values.video }
      setSaved(values)
      setShowErrors(false)
      if (!product) {
        skipBlock.current = true
        navigate(`/admin/producten/${row.id}`, { replace: true })
      } else {
        setMessage({ kind: 'ok', text: 'Product opgeslagen.' })
        reload()
      }
    } catch (err) {
      setMessage({ kind: 'error', text: errorMessage(err, 'Het product kon niet worden opgeslagen.') })
    } finally {
      setBusy(false)
    }
  }

  const onDrafts = useCallback((d: QuestionDraft[]) => setDrafts(d), [])
  const previewProduct: LocalizedProduct = {
    id: product?.id ?? 'voorbeeld',
    slug: values.slug || 'voorbeeld',
    naam: values.naam || 'Productnaam',
    categorie: values.categorie || 'Categorie',
    categorieId: values.categorie,
    korteOmschrijving: values.korteOmschrijving,
    omschrijving: values.omschrijving,
    kenmerken: cleanList(values.kenmerken),
    doelgroep: values.doelgroep,
    verkoopargumenten: cleanList(values.verkoopargumenten),
    afbeelding: values.afbeelding,
    video: values.video,
    quiz: drafts.map((d) => ({ vraag: d.vraag, opties: d.opties, juisteAntwoord: d.juisteAntwoord, uitleg: d.uitleg })),
  }

  return (
    <div>
      <Link to="/admin" className="btn-ghost -ml-3">← Terug naar de producten</Link>
      <h2 className="mt-2 text-3xl">{product ? `Product bewerken: ${product.naam}` : 'Nieuw product'}</h2>

      <form onSubmit={(e) => void onSubmit(e)} noValidate className="mt-6 space-y-6" aria-label="Productgegevens">
        <div ref={summary} tabIndex={-1} className="outline-none" role="status" aria-live="polite">
          {message && <p className={`rounded-xl p-4 font-semibold ${message.kind === 'ok' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'}`}>{message.text}</p>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <TextField id="naam" label="Naam" value={values.naam} onChange={setNaam} error={shown.naam} required maxLength={100} />
          <TextField id="categorie" label="Categorie" value={values.categorie} onChange={(v) => patch({ categorie: v })} error={shown.categorie} required hint="Een nieuwe naam maakt automatisch een nieuw filter op de homepagina." />
          <TextField
            id="slug"
            label="Slug"
            value={values.slug}
            onChange={(v) => { setSlugTouched(true); patch({ slug: v }) }}
            error={shown.slug}
            required
            hint={<>Adres van de productpagina: <code>#/product/{values.slug || '…'}</code>.{product ? ' Wijzig dit niet als er al links naar bestaan.' : ' Wordt automatisch gemaakt uit de naam.'}</>}
          />
          <TextField id="korte" label="Korte omschrijving" value={values.korteOmschrijving} onChange={(v) => patch({ korteOmschrijving: v })} error={shown.korteOmschrijving} required maxLength={160} hint="Maximaal 160 tekens; staat op de kaart op de homepagina." />
        </div>
        <TextField id="omschrijving" label="Omschrijving" value={values.omschrijving} onChange={(v) => patch({ omschrijving: v })} error={shown.omschrijving} multiline rows={5} required />
        <StringListEditor id="kenmerken" legend="Kenmerken" itemLabel="Kenmerk" values={values.kenmerken} onChange={(v) => patch({ kenmerken: v })} error={shown.kenmerken} />
        <TextField id="doelgroep" label="Doelgroep" value={values.doelgroep} onChange={(v) => patch({ doelgroep: v })} error={shown.doelgroep} multiline rows={3} required />
        <StringListEditor id="verkoopargumenten" legend="Verkoopargumenten" itemLabel="Verkoopargument" values={values.verkoopargumenten} onChange={(v) => patch({ verkoopargumenten: v })} error={shown.verkoopargumenten} />
        <ImageField value={values.afbeelding} onChange={(url) => patch({ afbeelding: url })} onBusyChange={setMediaBusy} error={shown.afbeelding} />
        <VideoField value={values.video} onChange={(url) => patch({ video: url })} onBusyChange={setMediaBusy} error={shown.video} title={values.naam} />

        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-fog p-4">
          <input type="checkbox" checked={values.gepubliceerd} onChange={(e) => patch({ gepubliceerd: e.target.checked })} className="h-5 w-5 accent-kyocera-red" />
          <span><span className="font-semibold">Gepubliceerd</span><span className="block text-sm text-graphite">Alleen gepubliceerde producten zijn zichtbaar voor verkopers.</span></span>
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary" disabled={busy || mediaBusy}>{busy ? 'Bezig met opslaan' : product ? 'Wijzigingen opslaan' : 'Product aanmaken'}</button>
          <button type="button" className="btn-secondary" onClick={() => setPreview(true)}>Voorbeeld</button>
          <Link to="/admin" className="btn-ghost">Annuleren</Link>
          {dirty && <span className="text-sm text-steel">Niet-opgeslagen wijzigingen</span>}
          {mediaBusy && <span className="text-sm text-steel">Wacht tot het uploaden klaar is.</span>}
        </div>
      </form>

      <div className="mt-10">
        {product ? (
          <QuizManager productId={product.id} questions={product.quiz_questions} en={product.en} onSaved={reload} onDirtyChange={setQuizDirty} onChange={onDrafts} />
        ) : (
          <p className="rounded-xl bg-fog p-5 text-graphite">Sla het product eerst op. Daarna kun je hier de quizvragen toevoegen.</p>
        )}
      </div>

      <PreviewDialog open={preview} onClose={() => setPreview(false)}>
        <ProductView product={previewProduct} preview />
      </PreviewDialog>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="Wijzigingen niet opgeslagen"
        confirmLabel="Pagina verlaten"
        cancelLabel="Blijven"
        onCancel={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
      >
        <p>Je hebt wijzigingen die nog niet zijn opgeslagen. Als je de pagina verlaat, gaan ze verloren.</p>
      </ConfirmDialog>
    </div>
  )
}
