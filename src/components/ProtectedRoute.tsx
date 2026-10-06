import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'
import { LoadingRegion, Skeleton } from './Skeleton'

/** Alles binnen deze route is alleen toegankelijk na inloggen. */
export function ProtectedRoute() {
  const { user, loading, needsPassword } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  if (loading) {
    return (
      <div className="container-page py-16">
        <LoadingRegion label={t('common.loading')}>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-4 h-5 w-96 max-w-full" />
        </LoadingRegion>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (needsPassword) return <Navigate to="/wachtwoord-instellen" replace />
  return <Outlet />
}
