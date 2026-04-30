import { useContext } from 'react'
import type { AuthContextValue } from './AuthContext'
import { AuthContext } from './AuthContext'

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

