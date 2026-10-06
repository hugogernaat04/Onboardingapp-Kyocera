import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/** Ingelogde gebruiker, profiel, rol en isAdmin. */
export function useAuth() {
  return useContext(AuthContext)
}
