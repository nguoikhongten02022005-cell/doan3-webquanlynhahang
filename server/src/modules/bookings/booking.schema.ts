import { z } from 'zod'

const trangThaiBookingCongKhai = z.enum([
  'YEU_CAU_DAT_BAN',
  'CHO_XAC_NHAN',
])

const bookingStatusSchema = z.enum([
  'YEU_CAU_DAT_BAN',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
  'TU_CHOI_HET_CHO',
  'DA_HUY',
  'KHONG_DEN',
  'DA_HOAN_THANH',
])

export const createBookingSchema = z.object({
  guests: z.union([z.string(), z.number()]).transform((value) => String(value)),
  date: z.string().trim().min(1),
  time: z.string().trim().min(1),
  seatingArea: z.string().trim().default('KHONG_UU_TIEN'),
  notes: z.string().optional().default(''),
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim().optional().default(''),
  status: trangThaiBookingCongKhai.optional(),
  source: z.string().optional().default('web'),
  bookingCode: z.string().trim().optional(),
  userEmail: z.string().trim().nullable().optional(),
  occasion: z.string().optional().default(''),
  confirmationChannel: z.array(z.string()).optional().default([]),
  internalNote: z.string().optional().default(''),
  createdBy: z.string().optional().default(''),
})

export const updateBookingSchema = createBookingSchema.partial()

export const updateBookingStatusSchema = z.object({
  status: bookingStatusSchema,
})

export const assignTablesSchema = z.object({
  tableIds: z.array(z.string().trim().min(1)).min(1),
})
