import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { LoadingRegion, Skeleton } from '../../components/Skeleton'
import { deleteProduct, errorMessage, listAdminProducts, saveOrder, setPublished, type AdminProductRow } from '../../lib/adminApi'
import { useQuery } from '../../hooks/useQuery'
import { publicUrl } from '../../lib/media'
import { QUIZ_SIZE } from '../../lib/productForm'

const iconBtn = 'inline-flex h-12 w-12 items-center justify-center rounded-full text-graphite hover:bg-fog disabled:opacity-40 disabled:hover:bg-transparent'

export default function AdminProducts() {
  const { data, loading, error, reload } = useQuery(listAdminProducts, [])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<AdminProductRow | null>(null)

  const products = useMemo(() => data ?? [], [data])
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.categorie))).sort(), [products])
  const filtering = query.trim() !== '' || category !== ''
  const visible = products.filter(
    (p) =>
      (!category || p.categorie === category) &&
      (!query.trim() || [p.naam, p.categorie, p.slug].some((x) => x.toLowerCase().includes(query.trim().toLowerCase()))),
  )

  async function run(action: () => Promise<void>, failure: string) {
    setBusy(true)
    setMessage(null)
    try {
      await action()
      reload()
    } catch (e) {
      setMessage(errorMessage(e, failure))
    } finally {
      setBusy(false)
    }
  }

  const move = (index: number, dir: -1 | 1) => {
    const next = [...products]
    ;[next[index], next[index + dir]] = [next[index + dir], next[index]]
    void run(() => saveOrder(next), 'De volgorde kon niet worden opgeslagen.')
  }

  return (
    <section aria-labelledby="producten-beheer">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="producten-beheer" className="text-2xl">Producten</h2>
        <Link to="/admin/producten/nieuw" className="btn-primary">Nieuw product</Link>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_16rem]">
        <div>
          <label htmlFor="admin-zoek" className="sr-only">Zoek een product</label>
          <input id="admin-zoek" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op naam, categorie of slug" className="field !mt-0" autoComplete="off" />
        </div>
        <div>
          <label htmlFor="admin-categorie" className="sr-only">Filter op categorie</label>
          <select id="admin-categorie" value={category} onChange={(e) => setCategory(e.target.value)} className="field !mt-0">
            <option value="">Alle categorieën</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {filtering && <p className="field-hint">De volgorde aanpassen kan alleen zonder zoekterm of filter.</p>}

      <div role="status" aria-live="polite">
        {message && <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-4 font-semibold text-danger">{message}</p>}
      </div>

      {loading && !data ? (
        <LoadingRegion label="Producten laden">
          <div className="mt-6 space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
        </LoadingRegion>
      ) : error && !data ? (
        <div role="alert" className="mt-6 rounded-xl border-2 border-dashed border-mist p-8 text-center">
          <p className="font-display text-xl font-semibold">De producten konden niet worden geladen</p>
          <button type="button" className="btn-primary mt-4" onClick={reload}>Opnieuw proberen</button>
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-6 rounded-xl border-2 border-dashed border-mist p-8 text-center text-graphite">
          {products.length === 0 ? 'Er zijn nog geen producten. Voeg het eerste product toe.' : 'Geen producten gevonden voor deze zoekopdracht.'}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((p) => {
            const index = products.findIndex((x) => x.id === p.id)
            const vragen = p.quiz_questions[0]?.count ?? 0
            return (
              <li key={p.id} className="flex flex-col gap-4 rounded-2xl border border-mist p-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-4">
                  <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg bg-fog sm:w-28">
                    {p.afbeelding_url && <img src={publicUrl('images', p.afbeelding_url)} alt="" className="h-full w-full object-cover" loading="lazy" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-semibold">{p.naam}</p>
                    <p className="text-sm text-graphite">{p.categorie}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      <span className={`rounded-full px-3 py-1 font-semibold ${p.gepubliceerd ? 'bg-success-soft text-success' : 'bg-fog text-graphite'}`}>{p.gepubliceerd ? 'Gepubliceerd' : 'Concept'}</span>
                      <span className={vragen < QUIZ_SIZE ? 'font-semibold text-danger' : 'text-steel'}>
                        {vragen} {vragen === 1 ? 'quizvraag' : 'quizvragen'}{vragen < QUIZ_SIZE ? ` (minder dan ${QUIZ_SIZE})` : ''}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <button type="button" className={iconBtn} disabled={busy || filtering || index === 0} onClick={() => move(index, -1)} aria-label={`${p.naam} omhoog verplaatsen`}>↑</button>
                  <button type="button" className={iconBtn} disabled={busy || filtering || index === products.length - 1} onClick={() => move(index, 1)} aria-label={`${p.naam} omlaag verplaatsen`}>↓</button>
                  <Link to={`/admin/producten/${p.id}`} className="btn-secondary" aria-label={`${p.naam} bewerken`}>Bewerken</Link>
                  <button type="button" className="btn-ghost" disabled={busy} onClick={() => void run(() => setPublished(p.id, !p.gepubliceerd), 'De status kon niet worden gewijzigd.')} aria-label={`${p.naam} ${p.gepubliceerd ? 'verbergen' : 'publiceren'}`}>
                    {p.gepubliceerd ? 'Verbergen' : 'Publiceren'}
                  </button>
                  <button type="button" className="btn-ghost text-danger" disabled={busy} onClick={() => setDeleting(p)} aria-label={`${p.naam} verwijderen`}>Verwijderen</button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Product verwijderen?"
        confirmLabel="Definitief verwijderen"
        cancelLabel="Annuleren"
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          const target = deleting
          setDeleting(null)
          if (target) void run(() => deleteProduct(target), 'Het product kon niet worden verwijderd.')
        }}
      >
        <p>
          <strong>{deleting?.naam}</strong> wordt verwijderd, samen met de quizvragen, de quizresultaten van alle gebruikers en de geüploade bestanden. Dit kun je niet ongedaan maken.
          Wil je het alleen even verbergen, kies dan “Verbergen”.
        </p>
      </ConfirmDialog>
    </section>
  )
}
