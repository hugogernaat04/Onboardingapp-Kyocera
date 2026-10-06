import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthContext, type AuthContextValue, type Profile } from '../context/AuthContext'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { AdminRoute } from './AdminRoute'
import { ProtectedRoute } from './ProtectedRoute'

const noop = async () => {
  throw new Error('niet gebruikt in deze test')
}
const base: AuthContextValue = {
  session: null, user: null, profile: null, rol: null, isAdmin: false, loading: false, needsPassword: false,
  signIn: noop, signOut: noop, requestPasswordReset: noop, setPassword: noop, verifyToken: noop,
}
const as = (rol: Profile['rol'] | null, extra: Partial<AuthContextValue> = {}): AuthContextValue =>
  rol
    ? {
        ...base,
        user: { id: 'u1', email: 'a@b.nl' } as AuthContextValue['user'],
        profile: { id: 'u1', naam: 'Test', email: 'a@b.nl', rol, created_at: '' },
        rol,
        isAdmin: rol === 'admin',
        ...extra,
      }
    : { ...base, ...extra }

function setup(auth: AuthContextValue, path = '/admin') {
  return render(
    <LanguageProvider>
      <AuthContext.Provider value={auth}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/login" element={<p>Inlogpagina</p>} />
            <Route path="/wachtwoord-instellen" element={<p>Wachtwoord kiezen</p>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<p>Startpagina</p>} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<p>Beheerpagina</p>} />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </LanguageProvider>,
  )
}

describe('ProtectedRoute en AdminRoute', () => {
  it('stuurt een niet-ingelogde bezoeker naar /login', () => {
    setup(as(null))
    expect(screen.getByText('Inlogpagina')).toBeInTheDocument()
    expect(screen.queryByText('Beheerpagina')).not.toBeInTheDocument()
  })
  it('weigert een gewone gebruiker op /admin', () => {
    setup(as('gebruiker'))
    expect(screen.getByRole('heading', { name: 'Geen toegang' })).toBeInTheDocument()
    expect(screen.queryByText('Beheerpagina')).not.toBeInTheDocument()
  })
  it('laat een admin op /admin', () => {
    setup(as('admin'))
    expect(screen.getByText('Beheerpagina')).toBeInTheDocument()
  })
  it('laat een gewone gebruiker wel de startpagina zien', () => {
    setup(as('gebruiker'), '/')
    expect(screen.getByText('Startpagina')).toBeInTheDocument()
  })
  it('toont niets beschermds terwijl de sessie nog geladen wordt', () => {
    setup(as(null, { loading: true }))
    expect(screen.queryByText('Beheerpagina')).not.toBeInTheDocument()
    expect(screen.queryByText('Inlogpagina')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
  it('stuurt iemand die nog een wachtwoord moet kiezen daarheen', () => {
    setup(as('gebruiker', { needsPassword: true }), '/')
    expect(screen.getByText('Wachtwoord kiezen')).toBeInTheDocument()
  })
})
