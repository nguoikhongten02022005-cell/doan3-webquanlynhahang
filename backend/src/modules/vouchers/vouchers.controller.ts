import type { Request, Response } from 'express'
import { HttpError } from '../../common/http-error.js'
import { decimalToNumber } from '../../common/serializers.js'
import { getVoucherByCode } from './vouchers.service.js'

export const getVoucher = async (req: Request, res: Response) => {
  const voucher = await getVoucherByCode(String(req.params.code))

  if (!voucher) {
    throw new HttpError(404, 'Mã giảm giá không hợp lệ.')
  }

  res.json({
    code: voucher.code,
    amount: decimalToNumber(voucher.amount),
  })
}
