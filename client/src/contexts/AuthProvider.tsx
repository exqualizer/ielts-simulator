import { useCallback, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'
import type { AuthUser } from './useAuth'
import { AuthContext, type AuthContextValue } from './AuthContext'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refreshMe = useCallback(async () => {
    setError(null)
    try {
      const data = await apiFetch<{ user: AuthUser }>('/api/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    const data = await apiFetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      json: { email, password },
    })
    setUser(data.user)
  }, [])

  const register = useCallback(async (payload: {
    email: string
    firstName: string
    lastName: string
    address: string
    contactNo: string
    password: string
  }) => {
    setError(null)
    const data = await apiFetch<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      json: payload,
    })
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, error, refreshMe, login, register, logout }),
    [user, error, refreshMe, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

