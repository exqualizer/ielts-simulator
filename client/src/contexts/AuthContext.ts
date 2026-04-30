import { createContext } from 'react'
import type { AuthUser } from './useAuth'

export type AuthContextValue = {
  user: AuthUser | null
  error: string | null
  refreshMe: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (payload: {
    email: string
    firstName: string
    lastName: string
    address: string
    contactNo: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

