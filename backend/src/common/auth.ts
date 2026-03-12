import type { UserRole } from '@prisma/client'

export type AuthUser = {
  id: number
  email: string
  username: string
  role: UserRole
}

export type AuthTokenPayload = AuthUser & {
  type: 'access'
}