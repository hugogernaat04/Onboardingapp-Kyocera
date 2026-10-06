import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { initialAuthType, supabase } from '../lib/supabase'
import { AuthContext, type AuthContextValue, type Profile } from './AuthContext'

/** Basis-URL van de app (ook onder /Onboardingapp-Kyocera/ op GitHub Pages), eindigend op een slash. */
const appBase = () => window.location.origin + import.meta.env.BASE_URL

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [profileState, setProfileState] = useState<{ userId: string; profile: Profile | null } | null>(null)
  const [needsPassword, setNeedsPassword] = useState(initialAuthType === 'invite' || initialAuthType === 'recovery')

  useEffect(() => {
    // Alleen state zetten in de callback; Supabase-aanroepen hier kunnen vastlopen.
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next)
      setSessionChecked(true)
      if (event === 'PASSWORD_RECOVERY') setNeedsPassword(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id ?? null

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfileState({ userId, profile: (data as Profile | null) ?? null })
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const profile = userId && profileState?.userId === userId ? profileState.profile : null
  const profileLoaded = !userId || profileState?.userId === userId

  const signIn = useCallback<AuthContextValue['signIn']>(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) return null
    return error.code === 'invalid_credentials' || error.status === 400 ? 'invalid' : 'other'
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfileState(null)
    setNeedsPassword(false)
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${appBase()}#/auth/bevestigen` })
    return !error
  }, [])

  const setPassword = useCallback<AuthContextValue['setPassword']>(
    async (password, naam) => {
      const { error } = await supabase.auth.updateUser({ password, ...(naam ? { data: { naam } } : {}) })
      if (error) return false
      if (naam && userId) {
        await supabase.from('profiles').update({ naam }).eq('id', userId)
        setProfileState((s) => (s && s.profile ? { ...s, profile: { ...s.profile, naam } } : s))
      }
      setNeedsPassword(false)
      return true
    },
    [userId],
  )

  const verifyToken = useCallback<AuthContextValue['verifyToken']>(async (tokenHash, type) => {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) return false
    if (type === 'invite' || type === 'recovery') setNeedsPassword(true)
    return true
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      rol: profile?.rol ?? null,
      isAdmin: profile?.rol === 'admin',
      loading: !sessionChecked || !profileLoaded,
      needsPassword,
      signIn,
      signOut,
      requestPasswordReset,
      setPassword,
      verifyToken,
    }),
    [session, profile, sessionChecked, profileLoaded, needsPassword, signIn, signOut, requestPasswordReset, setPassword, verifyToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
