import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export type Rol = 'admin' | 'gebruiker'

export interface Profile {
  id: string
  naam: string
  email: string
  rol: Rol
  created_at: string
}

export type SignInError = 'invalid' | 'other'

export interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  rol: Rol | null
  isAdmin: boolean
  /** True zolang we nog niet weten of er een sessie is (en welk profiel erbij hoort). */
  loading: boolean
  /** True na een uitnodigings- of resetlink: de gebruiker moet eerst een wachtwoord kiezen. */
  needsPassword: boolean
  signIn: (email: string, password: string) => Promise<SignInError | null>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<boolean>
  /** Geeft true bij succes. `naam` wordt optioneel meegeslagen in het profiel. */
  setPassword: (password: string, naam?: string) => Promise<boolean>
  /** Wisselt de token_hash uit een uitnodigings- of resetmail in voor een sessie. */
  verifyToken: (tokenHash: string, type: 'invite' | 'recovery' | 'magiclink' | 'email') => Promise<boolean>
}

const unavailable = async () => {
  throw new Error('useAuth moet binnen een AuthProvider gebruikt worden')
}

export const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  rol: null,
  isAdmin: false,
  loading: true,
  needsPassword: false,
  signIn: unavailable,
  signOut: unavailable,
  requestPasswordReset: unavailable,
  setPassword: unavailable,
  verifyToken: unavailable,
})
