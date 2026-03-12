import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'

const isVoucherUsable = (voucher: {
  isActive: boolean
  startsAt: Date | null
  endsAt: Date | null
  usageLimit: number | null
  usedCount: number
}) => {
  const now = new Date()

  if (!voucher.isActive) return false
  if (voucher.startsAt && voucher.startsAt > now) return false
  if (voucher.endsAt && voucher.endsAt < now) return false
  if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) return false

  return true
}

export const listVouchers = () => prisma.voucher.findMany({ orderBy: { id: 'desc' } })

export const getVoucherByCode = async (code: string) => {
  const voucher = await prisma.voucher.findFirst({
    where: { code: code.toUpperCase() },
  })

  if (!voucher || !isVoucherUsable(voucher)) {
    return null
  }

  return voucher
}

export const validateVoucherCode = async (code: string, orderAmount = 0) => {
  const voucher = await getVoucherByCode(code)

  if (!voucher) {
    throw new HttpError(404, 'Mã giảm giá không hợp lệ.')
  }

  if (orderAmount < voucher.minOrderAmount.toNumber()) {
    throw new HttpError(400, 'Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá.')
  }

  return voucher
}

export const createVoucher = async (payload: {
  code: string
  name: string
  description: string
  discountType: 'FIXED' | 'PERCENTAGE'
  discountValue: number
  minOrderAmount?: number
  maxDiscountAmount?: number | null
  startsAt?: string | null
  endsAt?: string | null
  usageLimit?: number | null
  isActive?: boolean
}) => {
  const code = payload.code.trim().toUpperCase()
  const existing = await prisma.voucher.findFirst({ where: { code } })

  if (existing) {
    throw new HttpError(409, 'Mã giảm giá đã tồn tại.')
  }

  return prisma.voucher.create({
    data: {
      code,
      name: payload.name.trim(),
      description: payload.description.trim(),
      discountType: payload.discountType,
      discountValue: payload.discountValue,
      minOrderAmount: payload.minOrderAmount ?? 0,
      maxDiscountAmount: payload.maxDiscountAmount ?? null,
      startsAt: payload.startsAt ? new Date(payload.startsAt) : null,
      endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
      usageLimit: payload.usageLimit ?? null,
      isActive: payload.isActive ?? true,
    },
  })
}

export const updateVoucher = async (id: number, payload: Partial<{
  code: string
  name: string
  description: string
  discountType: 'FIXED' | 'PERCENTAGE'
  discountValue: number
  minOrderAmount: number
  maxDiscountAmount: number | null
  startsAt: string | null
  endsAt: string | null
  usageLimit: number | null
  isActive: boolean
}>) => {
  const voucher = await prisma.voucher.findUnique({ where: { id } })

  if (!voucher) {
    throw new HttpError(404, 'Không tìm thấy mã giảm giá.')
  }

  return prisma.voucher.update({
    where: { id },
    data: {
      ...(payload.code !== undefined ? { code: payload.code.trim().toUpperCase() } : {}),
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      ...(payload.description !== undefined ? { description: payload.description.trim() } : {}),
      ...(payload.discountType !== undefined ? { discountType: payload.discountType } : {}),
      ...(payload.discountValue !== undefined ? { discountValue: payload.discountValue } : {}),
      ...(payload.minOrderAmount !== undefined ? { minOrderAmount: payload.minOrderAmount } : {}),
      ...(payload.maxDiscountAmount !== undefined ? { maxDiscountAmount: payload.maxDiscountAmount } : {}),
      ...(payload.startsAt !== undefined ? { startsAt: payload.startsAt ? new Date(payload.startsAt) : null } : {}),
      ...(payload.endsAt !== undefined ? { endsAt: payload.endsAt ? new Date(payload.endsAt) : null } : {}),
      ...(payload.usageLimit !== undefined ? { usageLimit: payload.usageLimit } : {}),
      ...(payload.isActive !== undefined ? { isActive: payload.isActive } : {}),
    },
  })
}

export const deleteVoucher = async (id: number) => {
  const voucher = await prisma.voucher.findUnique({ where: { id } })

  if (!voucher) {
    throw new HttpError(404, 'Không tìm thấy mã giảm giá.')
  }

  await prisma.voucher.delete({ where: { id } })
}
