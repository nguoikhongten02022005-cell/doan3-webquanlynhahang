import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { AccessTokenPayload, AuthUser, RefreshTokenPayload } from '../auth.js'
import { env } from '../../config/env.js'

export const signAccessToken = (user: AuthUser) => jwt.sign(
  {
    ...user,
    type: 'access',
  } satisfies AccessTokenPayload,
  env.JWT_SECRET,
  { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
)

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload

export const signRefreshToken = (user: AuthUser) => jwt.sign(
  {
    ...user,
    type: 'refresh',
  } satisfies RefreshTokenPayload,
  env.JWT_REFRESH_SECRET,
  { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions,
)

export const verifyRefreshToken = (token: string) => jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload

export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex')
