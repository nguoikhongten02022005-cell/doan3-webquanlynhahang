import type { User } from '@prisma/client'

export const mapUser = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  username: user.username,
  email: user.email,
  role: user.role,
  phone: user.phone ?? '',
})

export const mapCurrentUser = (user: User) => ({
  id: user.id,
  fullName: user.fullName,
  username: user.username,
  email: user.email,
  role: user.role,
  phone: user.phone ?? '',
})
