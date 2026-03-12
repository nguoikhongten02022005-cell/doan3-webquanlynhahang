import { z } from 'zod'

const orderItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1),
  price: z.number(),
  quantity: z.number().int().positive(),
  selectedSize: z.string().optional().default('M'),
  selectedToppings: z.array(z.string()).optional().default([]),
  specialNote: z.string().optional().default(''),
  variantKey: z.string().optional().default(''),
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  subtotal: z.number(),
  serviceFee: z.number(),
  discountAmount: z.number(),
  voucherCode: z.string().optional().default(''),
  total: z.number(),
  status: z.string().optional().default('Mới Đặt'),
  customer: z.object({
    fullName: z.string().optional().default(''),
    phone: z.string().optional().default(''),
    email: z.string().optional().default(''),
    address: z.string().optional().default(''),
  }),
  userEmail: z.string().optional().default(''),
  note: z.string().optional().default(''),
  tableNumber: z.string().optional().default(''),
  paymentMethod: z.string().optional().default('cash'),
})

export const updateOrderStatusSchema = z.object({
  status: z.string().trim().min(1),
})
