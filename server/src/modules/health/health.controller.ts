import type { Request, Response } from 'express'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'

export const getHealth = (_req: Request, res: Response) => phanHoiThanhCong(res, {
  message: 'Kiểm tra sức khỏe hệ thống thành công.',
  data: { status: 'ok' },
})
