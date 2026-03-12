import { z } from 'zod'

const menuPayloadSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.union([z.string(), z.number()]),
  category: z.string().trim().min(1),
  badge: z.string().optional().default('Mới'),
  tone: z.string().optional().default('tone-amber'),
  image: z.string().optional().default(''),
  isAvailable: z.boolean().optional().default(true),
})

export const createMenuItemSchema = menuPayloadSchema
export const updateMenuItemSchema = menuPayloadSchema.partial()
