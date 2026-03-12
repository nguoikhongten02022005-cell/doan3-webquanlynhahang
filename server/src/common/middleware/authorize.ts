import type { NextFunction, Request, Response } from 'express'
import type { UserRole } from '@prisma/client'
import { HttpError } from '../http-error.js'

export const authorize = (...roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.authUser) {
    next(new HttpError(401, 'Bạn cần đăng nhập để tiếp tục.'))
    return
  }

  if (!roles.includes(req.authUser.role)) {
    next(new HttpError(403, 'Bạn không có quyền thực hiện thao tác này.'))
    return
  }

  next()
}