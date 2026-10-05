import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import type { TranslationKey } from '../i18n/translations'

export default function NotFound({ messageKey = 'notfound.default' }: { messageKey?: TranslationKey }) {
  const { t } = useLanguage()
  return (
    <div className="container-page py-16 text-center sm:py-24">
      <p className="font-display text-8xl font-bold text-kyocera-red">404</p>
      <h1 className="mt-2 text-3xl">{t('notfound.title')}</h1>
      <p className="mx-auto mt-3 max-w-[44ch] text-graphite">{t(messageKey)} {t('notfound.hint')}</p>
      <Link to="/" className="btn-primary mt-8">{t('notfound.cta')}</Link>
    </div>
  )
}
