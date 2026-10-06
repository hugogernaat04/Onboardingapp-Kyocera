import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

/** Getoond als een link uit een e-mail verlopen of al gebruikt is. */
export default function LinkExpired() {
  const { t } = useLanguage()
  return (
    <div className="space-y-4">
      <h1 className="text-3xl">{t('auth.confirmFailedTitle')}</h1>
      <p role="alert" className="text-graphite">{t('auth.confirmFailedText')}</p>
      <Link to="/login" className="btn-primary w-full">{t('auth.back')}</Link>
    </div>
  )
}
