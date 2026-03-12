import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
})

export const registerSchema = z.object({
  fullName: z.string().trim().min(1),
  username: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(6),
})

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).optional(),
  phone: z.string().trim().optional(),
})
