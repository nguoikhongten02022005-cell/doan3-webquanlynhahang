import { z } from 'zod'

export const listTablesQuerySchema = z.object({
  areaId: z.string().trim().optional(),
  status: z.enum(['AVAILABLE', 'HELD', 'OCCUPIED', 'DIRTY']).optional(),
  minCapacity: z.coerce.number().int().positive().optional(),
})
