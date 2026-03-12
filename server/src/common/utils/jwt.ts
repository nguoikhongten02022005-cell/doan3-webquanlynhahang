import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { AccessTokenPayload, AuthUser, RefreshTokenPayload } from '../auth.js'
import { cauHinhAuth } from '../../config/auth.js'
import { env } from '../../config/env.js'
import { HttpError } from '../http-error.js'

const xacThucLoaiToken = <T extends { type: string }>(payload: unknown, loaiMongMuon: T['type']) => {
  if (!payload || typeof payload !== 'object' || (payload as { type?: string }).type !== loaiMongMuon) {
    throw new HttpError(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')
  }

  return payload as T
}

export const signAccessToken = (user: AuthUser) => jwt.sign(
  {
    ...user,
    type: 'access',
  } satisfies AccessTokenPayload,
  env.JWT_SECRET,
  { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
)

export const verifyAccessToken = (token: string) => xacThucLoaiToken<AccessTokenPayload>(
  jwt.verify(token, env.JWT_SECRET),
  'access',
)

export const signRefreshToken = (user: AuthUser) => jwt.sign(
  {
    ...user,
    type: 'refresh',
  } satisfies RefreshTokenPayload,
  env.JWT_REFRESH_SECRET,
  { expiresIn: cauHinhAuth.refreshToken.expiresIn } as jwt.SignOptions,
)

export const verifyRefreshToken = (token: string) => xacThucLoaiToken<RefreshTokenPayload>(
  jwt.verify(token, env.JWT_REFRESH_SECRET),
  'refresh',
)

export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex')
