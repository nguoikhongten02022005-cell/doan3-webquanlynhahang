import type { Request, Response } from 'express'
import { HttpError } from '../../common/http-error.js'
import { decimalToNumber, toIsoString } from '../../common/serializers.js'
import { createVoucherSchema, updateVoucherSchema, validateVoucherSchema } from './vouchers.schema.js'
import {
  createVoucher,
  deleteVoucher,
  getVoucherByCode,
  listVouchers,
  updateVoucher,
  validateVoucherCode,
} from './vouchers.service.js'

const mapVoucher = (voucher: {
  id: number
  code: string
  discountType: 'FIXED' | 'PERCENTAGE'
  discountValue: { toNumber(): number }
  minOrderAmount: { toNumber(): number }
  maxDiscountAmount: { toNumber(): number } | null
  startsAt: Date | null
  endsAt: Date | null
  usageLimit: number | null
  usedCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}) => ({
  id: voucher.id,
  code: voucher.code,
  discountType: voucher.discountType,
  discountValue: decimalToNumber(voucher.discountValue),
  minOrderAmount: decimalToNumber(voucher.minOrderAmount),
  maxDiscountAmount: decimalToNumber(voucher.maxDiscountAmount),
  usageLimit: voucher.usageLimit,
  usedCount: voucher.usedCount,
  isActive: voucher.isActive,
  startsAt: toIsoString(voucher.startsAt),
  endsAt: toIsoString(voucher.endsAt),
  createdAt: toIsoString(voucher.createdAt),
  updatedAt: toIsoString(voucher.updatedAt),
})

export const getVoucher = async (req: Request, res: Response) => {
  const voucher = await getVoucherByCode(String(req.params.code))

  if (!voucher) {
    throw new HttpError(404, 'Mã giảm giá không hợp lệ.')
  }

  res.json({
    code: voucher.code,
    amount: decimalToNumber(voucher.discountValue),
  })
}

export const postValidateVoucher = async (req: Request, res: Response) => {
  const payload = validateVoucherSchema.parse(req.body)
  const voucher = await validateVoucherCode(payload.code, payload.orderAmount)

  res.json({
    success: true,
    message: 'Kiểm tra mã giảm giá thành công.',
    data: mapVoucher(voucher),
  })
}

export const getVouchers = async (_req: Request, res: Response) => {
  const vouchers = await listVouchers()
  res.json(vouchers.map(mapVoucher))
}

export const postVoucher = async (req: Request, res: Response) => {
  const payload = createVoucherSchema.parse(req.body)
  const voucher = await createVoucher(payload)
  res.status(201).json(mapVoucher(voucher))
}

export const patchVoucher = async (req: Request, res: Response) => {
  const payload = updateVoucherSchema.parse(req.body)
  const voucher = await updateVoucher(Number(req.params.id), payload)
  res.json(mapVoucher(voucher))
}

export const removeVoucher = async (req: Request, res: Response) => {
  await deleteVoucher(Number(req.params.id))
  res.status(204).send()
}
