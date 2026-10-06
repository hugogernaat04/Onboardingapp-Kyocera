import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { LoadingRegion, Skeleton } from './Skeleton'

/** Alleen voor admins. Niet-ingelogd gaat naar /login, een gewone gebruiker ziet "geen toegang". De database dwingt dit zelf ook af via RLS. */
export function AdminRoute() {
  const { user, isAdmin, loading } = useAuth()
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="container-page py-16">
        <LoadingRegion label={t('common.loading')}>
          <Skeleton className="h-10 w-64" />
        </LoadingRegion>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) {
    return (
      <div className="container-page py-16 text-center sm:py-24">
        <h1 className="text-3xl">{t('admin.forbiddenTitle')}</h1>
        <p className="mx-auto mt-3 max-w-[44ch] text-graphite">{t('admin.forbiddenText')}</p>
        <Link to="/" className="btn-primary mt-8">{t('notfound.cta')}</Link>
      </div>
    )
  }
  return <Outlet />
}
