import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../http-error.js'
import { verifyAccessToken } from '../utils/jwt.js'
import { getAuthUserById } from '../../modules/auth/auth.service.js'

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

const napNguoiDungXacThuc = async (token: string) => {
  const payload = verifyAccessToken(token)
  const nguoiDung = await getAuthUserById(payload.id)

  if (nguoiDung.status !== 'ACTIVE') {
    throw new HttpError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')
  }

  return {
    id: nguoiDung.id,
    email: nguoiDung.email,
    username: nguoiDung.username,
    role: nguoiDung.role,
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req)

    if (!token) {
      throw new HttpError(401, 'Bạn cần đăng nhập để tiếp tục.')
    }

    req.authUser = await napNguoiDungXacThuc(token)
    next()
  } catch {
    next(new HttpError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'))
  }
}

export const optionalAuthenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req)

    if (!token) {
      next()
      return
    }

    req.authUser = await napNguoiDungXacThuc(token)
    next()
  } catch {
    next(new HttpError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'))
  }
}
