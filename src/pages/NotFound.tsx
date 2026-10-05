import { Link } from 'react-router-dom'

export default function NotFound({ melding = 'Deze pagina bestaat niet.' }: { melding?: string }) {
  return (
    <div className="container-page py-16 text-center sm:py-24">
      <p className="font-display text-8xl font-bold text-kyocera-red">404</p>
      <h1 className="mt-2 text-3xl">Pagina niet gevonden</h1>
      <p className="mx-auto mt-3 max-w-[44ch] text-graphite">{melding} Ga terug naar het overzicht om een product te kiezen.</p>
      <Link to="/" className="btn-primary mt-8">Naar overzicht</Link>
    </div>
  )
}
