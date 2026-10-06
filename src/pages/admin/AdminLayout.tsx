import { NavLink, Outlet } from 'react-router-dom'

const tab = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-12 items-center rounded-full px-5 font-semibold transition-colors ${isActive ? 'bg-ink text-white' : 'text-graphite hover:bg-fog'}`

export default function AdminLayout() {
  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-3xl sm:text-4xl">Beheer</h1>
      <nav aria-label="Beheer" className="mt-4 flex gap-2 overflow-x-auto border-b border-mist pb-4">
        <NavLink to="/admin" end className={tab}>Producten</NavLink>
        <NavLink to="/admin/gebruikers" className={tab}>Gebruikers</NavLink>
      </nav>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  )
}
