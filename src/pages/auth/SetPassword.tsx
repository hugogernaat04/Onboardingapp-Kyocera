import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'

export default function SetPassword() {
  const { user, profile, loading, setPassword } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [naam, setNaam] = useState<string | null>(null)
  const [password, setPasswordValue] = useState('')
  const [repeat, setRepeat] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (loading) return <p role="status">{t('common.loading')}</p>
  if (!user) return <Navigate to="/login" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) return setError(t('auth.tooShort'))
    if (password !== repeat) return setError(t('auth.mismatch'))
    setBusy(true)
    const ok = await setPassword(password, (naam ?? profile?.naam ?? '').trim() || undefined)
    setBusy(false)
    if (ok) navigate('/', { replace: true })
    else setError(t('auth.setError'))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-3xl">{t('auth.setTitle')}</h1>
      <p className="text-graphite">{t('auth.setIntro')}</p>
      <div>
        <label htmlFor="set-naam" className="field-label">{t('auth.naam')}</label>
        <input id="set-naam" type="text" autoComplete="name" value={naam ?? profile?.naam ?? ''} onChange={(e) => setNaam(e.target.value)} className="field" />
      </div>
      <div>
        <label htmlFor="set-password" className="field-label">{t('auth.newPassword')}</label>
        <input id="set-password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPasswordValue(e.target.value)} className="field" aria-describedby="set-hint" />
        <p id="set-hint" className="field-hint">{t('auth.passwordHint')}</p>
      </div>
      <div>
        <label htmlFor="set-repeat" className="field-label">{t('auth.repeatPassword')}</label>
        <input id="set-repeat" type="password" required autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} className="field" />
      </div>
      {error && <p role="alert" className="field-error">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full">{t('auth.setSave')}</button>
    </form>
  )
}
