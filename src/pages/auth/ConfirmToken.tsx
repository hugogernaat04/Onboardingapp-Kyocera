import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'

type TokenType = 'invite' | 'recovery' | 'magiclink' | 'email'
const TYPES: TokenType[] = ['invite', 'recovery', 'magiclink', 'email']

/**
 * Landingspagina voor links uit de uitnodigings- en resetmail: #/auth/bevestigen?token_hash=...&type=invite|recovery
 * (zie README voor de e-mailtemplates). Wisselt de token in voor een sessie en stuurt door naar het wachtwoordscherm.
 */
export default function ConfirmToken() {
  const [params] = useSearchParams()
  const { verifyToken } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)
  const started = useRef(false)
  const tokenHash = params.get('token_hash')
  const type = params.get('type') as TokenType | null
  const valid = !!tokenHash && !!type && TYPES.includes(type)

  useEffect(() => {
    if (!valid || started.current) return // een token is maar één keer bruikbaar (ook niet bij dubbele effecten in dev)
    started.current = true
    void verifyToken(tokenHash, type).then((ok) => {
      if (ok) navigate(type === 'invite' || type === 'recovery' ? '/wachtwoord-instellen' : '/', { replace: true })
      else setFailed(true)
    })
  }, [valid, tokenHash, type, verifyToken, navigate])

  if (failed || !valid) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl">{t('auth.confirmFailedTitle')}</h1>
        <p role="alert" className="text-graphite">{t('auth.confirmFailedText')}</p>
        <Link to="/login" className="btn-primary w-full">{t('auth.back')}</Link>
      </div>
    )
  }
  return <p role="status">{t('auth.confirmWorking')}</p>
}
