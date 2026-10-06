/** Getoond als VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY ontbreken (alleen relevant voor wie de app bouwt). */
export function ConfigMissing() {
  return (
    <main className="container-page max-w-2xl py-16">
      <h1 className="text-3xl">Supabase is nog niet ingesteld</h1>
      <p className="mt-3 text-graphite">
        Deze app heeft een Supabase-project nodig. Kopieer <code>.env.example</code> naar <code>.env</code>, vul{' '}
        <code>VITE_SUPABASE_URL</code> en <code>VITE_SUPABASE_ANON_KEY</code> in en start de app opnieuw. Op GitHub Pages
        stel je deze waarden in als repository secrets. De stappen staan in de README.
      </p>
    </main>
  )
}
