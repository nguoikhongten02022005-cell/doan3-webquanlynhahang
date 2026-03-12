import { z } from 'zod'

export const validateVoucherSchema = z.object({
  code: z.string().trim().min(1),
  orderAmount: z.number().nonnegative().optional().default(0),
})

export const createVoucherSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().optional().default(''),
  discountType: z.enum(['FIXED', 'PERCENTAGE']).optional().default('FIXED'),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().optional().default(0),
  maxDiscountAmount: z.number().positive().nullable().optional(),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional().default(true),
})

export const updateVoucherSchema = createVoucherSchema.partial()
