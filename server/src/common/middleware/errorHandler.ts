import { Prisma } from '@prisma/client'
import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { env } from '../../config/env.js'
import { logger } from '../../lib/logger.js'
import { HttpError } from '../http-error.js'
import { phanHoiLoi } from '../phan-hoi.js'

const mapZodErrors = (error: ZodError) => error.issues.map((issue) => ({
  path: issue.path.join('.'),
  message: issue.message,
  code: issue.code,
}))

const mapPrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
  if (error.code === 'P2002') {
    const fields = Array.isArray(error.meta?.target) ? error.meta.target : []
    return new HttpError(409, 'Dữ liệu đã tồn tại.', fields.length > 0
      ? fields.map((field) => ({ path: String(field), message: 'Giá trị đã được sử dụng.' }))
      : undefined)
  }

  if (error.code === 'P2003') {
    return new HttpError(400, 'Dữ liệu tham chiếu không hợp lệ.', [{ message: 'Không thể thực hiện do ràng buộc dữ liệu.' }])
  }

  if (error.code === 'P2025') {
    return new HttpError(404, 'Không tìm thấy dữ liệu yêu cầu.')
  }

  return null
}

export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return phanHoiLoi(res, {
      statusCode: 400,
      message: 'Dữ liệu gửi lên không hợp lệ.',
      errors: mapZodErrors(error),
    })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = mapPrismaError(error)

    if (prismaError) {
      return phanHoiLoi(res, {
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        errors: prismaError.errors ?? [],
      })
    }
  }

  if (error instanceof HttpError) {
    if (error.statusCode >= 500) {
      logger.error('Operational error', {
        method: req.method,
        url: req.originalUrl,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
      })
    }

    return phanHoiLoi(res, {
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors ?? [],
    })
  }

  logger.error('Unhandled error', {
    method: req.method,
    url: req.originalUrl,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: env.NODE_ENV === 'production' ? undefined : (error instanceof Error ? error.stack : undefined),
  })

  return phanHoiLoi(res, {
    statusCode: 500,
    message: 'Lỗi hệ thống nội bộ.',
    errors: env.NODE_ENV === 'production'
      ? []
      : [{ message: error instanceof Error ? error.message : 'Unknown error' }],
  })
}
