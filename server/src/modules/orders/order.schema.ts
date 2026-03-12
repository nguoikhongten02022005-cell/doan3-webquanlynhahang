import { z } from 'zod'
import { phuongThucThanhToanHopLe, trangThaiDonHangHopLe } from './order-constants.js'

const orderItemSchema = z.object({
  menuItemId: z.number().int().positive().optional(),
  quantity: z.number().int().positive(),
  selectedSize: z.string().optional().default('M'),
  selectedToppings: z.array(z.string()).optional().default([]),
  specialNote: z.string().optional().default(''),
  variantKey: z.string().optional().default(''),
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  voucherCode: z.string().trim().optional().default(''),
  customer: z.object({
    fullName: z.string().trim().optional().default(''),
    phone: z.string().trim().optional().default(''),
    email: z.string().trim().optional().default(''),
    address: z.string().trim().optional().default(''),
  }).optional().default({}),
  note: z.string().optional().default(''),
  tableNumber: z.string().optional().default(''),
  paymentMethod: z.enum(phuongThucThanhToanHopLe).optional().default('TIEN_MAT'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(trangThaiDonHangHopLe),
})
