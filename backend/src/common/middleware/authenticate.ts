import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../http-error.js'
import { verifyAccessToken } from '../utils/jwt.js'

const extractBearerToken = (request: Request) => {
  const authorization = request.header('authorization')

  if (!authorization) {
    return null
  }

  const [scheme, token] = authorization.split(' ')

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null
  }

  return token.trim()
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req)

    if (!token) {
      throw new HttpError(401, 'Bạn cần đăng nhập để tiếp tục.')
    }

    const payload = verifyAccessToken(token)

    req.authUser = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    }

    next()
  } catch {
    next(new HttpError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'))
  }
}

export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req)

    if (!token) {
      next()
      return
    }

    const payload = verifyAccessToken(token)
    req.authUser = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    }
    next()
  } catch {
    next(new HttpError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'))
  }
}