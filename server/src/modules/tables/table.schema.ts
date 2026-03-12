import { z } from 'zod'

export const updateTableStatusSchema = z.object({
  status: z.enum(['AVAILABLE', 'HELD', 'OCCUPIED', 'DIRTY']),
})
