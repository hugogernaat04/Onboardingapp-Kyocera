import { useMemo, useState } from 'react'
import { LoadingRegion, Skeleton } from '../../components/Skeleton'
import { errorMessage, listAllResults, listProductNames, listProfiles, setUserRole } from '../../lib/adminApi'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '../../hooks/useQuery'
import type { Rol } from '../../context/AuthContext'
import { progressFromResults } from '../../lib/progress'

async function loadAll() {
  const [profiles, results, products] = await Promise.all([listProfiles(), listAllResults(), listProductNames()])
  return { profiles, results, products }
}

export default function AdminUsers() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useQuery(loadAll, [])
  const [open, setOpen] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const progressByUser = useMemo(() => {
    const map = new Map<string, ReturnType<typeof progressFromResults>>()
    if (!data) return map
    for (const p of data.profiles) {
      map.set(p.id, progressFromResults(data.results.filter((r) => r.user_id === p.id)))
    }
    return map
  }, [data])

  async function changeRole(id: string, rol: Rol) {
    setBusy(id)
    setMessage(null)
    try {
      await setUserRole(id, rol)
      reload()
    } catch (e) {
      setMessage(errorMessage(e, 'De rol kon niet worden gewijzigd.'))
    } finally {
      setBusy(null)
    }
  }

  if (loading && !data) {
    return (
      <LoadingRegion label="Gebruikers laden">
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      </LoadingRegion>
    )
  }
  if (error && !data) {
    return (
      <div role="alert" className="rounded-xl border-2 border-dashed border-mist p-8 text-center">
        <p className="font-display text-xl font-semibold">De gebruikers konden niet worden geladen</p>
        <button type="button" className="btn-primary mt-4" onClick={reload}>Opnieuw proberen</button>
      </div>
    )
  }
  const { profiles = [], products = [] } = data ?? {}
  const published = products.filter((p) => p.gepubliceerd)

  return (
    <section aria-labelledby="gebruikers-titel">
      <h2 id="gebruikers-titel" className="text-2xl">Gebruikers</h2>
      <p className="mt-1 text-graphite">Nieuwe gebruikers nodig je uit via het Supabase-dashboard (zie de README). Hier zie je hun voortgang en pas je rollen aan.</p>
      <div role="status" aria-live="polite">
        {message && <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-4 font-semibold text-danger">{message}</p>}
      </div>
      <ul className="mt-6 space-y-3">
        {profiles.map((p) => {
          const progress = progressByUser.get(p.id) ?? {}
          const passed = published.filter((pr) => progress[pr.id]?.gehaald).length
          const isSelf = p.id === user?.id
          const expanded = open === p.id
          return (
            <li key={p.id} className="rounded-2xl border border-mist p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold">{p.naam || p.email}{isSelf && <span className="ml-2 text-sm font-normal text-steel">(jij)</span>}</p>
                  <p className="truncate text-sm text-graphite">{p.email}</p>
                </div>
                <p className="text-graphite" aria-label={`${passed} van ${published.length} quizzen gehaald`}>{passed} van {published.length} gehaald</p>
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor={`rol-${p.id}`} className="sr-only">Rol van {p.naam || p.email}</label>
                  <select id={`rol-${p.id}`} value={p.rol} disabled={isSelf || busy === p.id} onChange={(e) => void changeRole(p.id, e.target.value as Rol)} className="field !mt-0 !w-auto" aria-describedby={isSelf ? `rol-hint-${p.id}` : undefined}>
                    <option value="gebruiker">Gebruiker</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="button" className="btn-ghost" aria-expanded={expanded} aria-controls={`voortgang-${p.id}`} onClick={() => setOpen(expanded ? null : p.id)}>
                    {expanded ? 'Voortgang verbergen' : 'Voortgang bekijken'}
                  </button>
                </div>
              </div>
              {isSelf && <p id={`rol-hint-${p.id}`} className="field-hint">Je kunt je eigen rol niet wijzigen, zodat er altijd een admin overblijft.</p>}
              {expanded && (
                <div id={`voortgang-${p.id}`} className="mt-4 border-t border-mist pt-4">
                  {products.length === 0 ? <p className="text-graphite">Er zijn nog geen producten.</p> : (
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {products.map((pr) => {
                        const r = progress[pr.id]
                        return (
                          <li key={pr.id} className="flex items-center justify-between gap-3 rounded-lg bg-fog px-3 py-2">
                            <span className="truncate">{pr.naam}{!pr.gepubliceerd && <span className="text-sm text-steel"> (concept)</span>}</span>
                            <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${r?.gehaald ? 'bg-success-soft text-success' : 'bg-white text-graphite'}`}>
                              {r ? `${r.gehaald ? 'Gehaald' : 'Niet gehaald'}, beste score ${r.score}` : 'Nog niet gemaakt'}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
