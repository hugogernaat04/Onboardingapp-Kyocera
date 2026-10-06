import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'

export default function Login() {
  const { user, loading, needsPassword, signIn, requestPasswordReset } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()
  const [mode, setMode] = useState<'in' | 'reset'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  if (!loading && user) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={needsPassword ? '/wachtwoord-instellen' : from && from !== '/login' ? from : '/'} replace />
  }

  async function onSignIn(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await signIn(email.trim(), password)
    if (result) setError(t(result === 'invalid' ? 'auth.invalid' : 'auth.error'))
    setBusy(false)
  }

  async function onReset(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    // Toon altijd dezelfde melding, zodat niet te achterhalen is welke adressen bestaan.
    await requestPasswordReset(email.trim())
    setSent(true)
    setBusy(false)
  }

  if (mode === 'reset') {
    return (
      <form onSubmit={onReset} noValidate={false} className="space-y-4">
        <h1 className="text-3xl">{t('auth.resetTitle')}</h1>
        <p className="text-graphite">{t('auth.resetIntro')}</p>
        <div>
          <label htmlFor="reset-email" className="field-label">{t('auth.email')}</label>
          <input id="reset-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
        </div>
        {sent && <p role="status" className="rounded-xl bg-success-soft p-4 text-success">{t('auth.resetSent')}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">{t('auth.resetSend')}</button>
        <button type="button" className="btn-ghost w-full" onClick={() => { setMode('in'); setSent(false) }}>{t('auth.back')}</button>
      </form>
    )
  }

  return (
    <form onSubmit={onSignIn} className="space-y-4">
      <h1 className="text-3xl">{t('auth.title')}</h1>
      <p className="text-graphite">{t('auth.intro')}</p>
      <div>
        <label htmlFor="login-email" className="field-label">{t('auth.email')}</label>
        <input id="login-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
      </div>
      <div>
        <label htmlFor="login-password" className="field-label">{t('auth.password')}</label>
        <input id="login-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" aria-invalid={error ? true : undefined} aria-describedby={error ? 'login-error' : undefined} />
      </div>
      {error && <p id="login-error" role="alert" className="field-error">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? t('auth.signingIn') : t('auth.signIn')}</button>
      <button type="button" className="btn-ghost w-full" onClick={() => { setMode('reset'); setError(null) }}>{t('auth.forgot')}</button>
    </form>
  )
}
