import type { Response } from 'express'

export type MetaPhanHoi = Record<string, unknown> | null

export const phanHoiThanhCong = <T>(
  res: Response,
  {
    statusCode = 200,
    message = 'Thành công.',
    data = null,
    meta = null,
  }: {
    statusCode?: number
    message?: string
    data?: T | null
    meta?: MetaPhanHoi
  } = {},
) => res.status(statusCode).json({
  success: true,
  message,
  data,
  meta,
})

export const phanHoiLoi = (
  res: Response,
  {
    statusCode = 500,
    message = 'Có lỗi xảy ra.',
    errors = [],
  }: {
    statusCode?: number
    message?: string
    errors?: unknown
  } = {},
) => res.status(statusCode).json({
  success: false,
  message,
  errors,
})
