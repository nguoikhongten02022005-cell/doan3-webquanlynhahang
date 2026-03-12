import { z } from 'zod'

export const createTableSchema = z.object({
  id: z.string().trim().min(1),
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  areaId: z.string().trim().min(1),
  capacity: z.number().int().positive(),
  note: z.string().optional().default(''),
})

export const updateTableSchema = createTableSchema.partial().omit({ id: true })
