import type { Request, Response } from 'express'
import { HttpError } from '../../common/http-error.js'
import { decimalToNumber, toIsoString } from '../../common/serializers.js'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'
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
  name: string
  description: string
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
  name: voucher.name,
  description: voucher.description,
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

  return phanHoiThanhCong(res, {
    message: 'Lấy thông tin mã giảm giá thành công.',
    data: {
      code: voucher.code,
      name: voucher.name,
      amount: decimalToNumber(voucher.discountValue),
    },
  })
}

export const postValidateVoucher = async (req: Request, res: Response) => {
  const payload = validateVoucherSchema.parse(req.body)
  const voucher = await validateVoucherCode(payload.code, payload.orderAmount)

  return phanHoiThanhCong(res, {
    message: 'Kiểm tra mã giảm giá thành công.',
    data: mapVoucher(voucher),
  })
}

export const getVouchers = async (_req: Request, res: Response) => {
  const vouchers = await listVouchers()
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách mã giảm giá thành công.',
    data: vouchers.map(mapVoucher),
    meta: { total: vouchers.length },
  })
}

export const postVoucher = async (req: Request, res: Response) => {
  const payload = createVoucherSchema.parse(req.body)
  const voucher = await createVoucher(payload)
  return phanHoiThanhCong(res, {
    statusCode: 201,
    message: 'Tạo mã giảm giá thành công.',
    data: mapVoucher(voucher),
  })
}

export const patchVoucher = async (req: Request, res: Response) => {
  const payload = updateVoucherSchema.parse(req.body)
  const voucher = await updateVoucher(Number(req.params.id), payload)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật mã giảm giá thành công.',
    data: mapVoucher(voucher),
  })
}

export const removeVoucher = async (req: Request, res: Response) => {
  await deleteVoucher(Number(req.params.id))
  return phanHoiThanhCong(res, {
    message: 'Xóa mã giảm giá thành công.',
    data: null,
  })
}
