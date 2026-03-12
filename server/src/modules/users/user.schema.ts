import { z } from 'zod'

export const updateUserRoleSchema = z.object({
  role: z.enum(['customer', 'staff', 'admin']),
})

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']),
})
