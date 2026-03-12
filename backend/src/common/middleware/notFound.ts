import type { Request, Response, NextFunction } from 'express'
import { HttpError } from '../http-error.js'

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError(404, 'Route not found'))
}
