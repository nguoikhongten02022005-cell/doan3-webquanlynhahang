import jwt from 'jsonwebtoken'
import type { AuthTokenPayload, AuthUser } from '../auth.js'
import { env } from '../../config/env.js'

export const signAccessToken = (user: AuthUser) => jwt.sign(
  {
    ...user,
    type: 'access',
  } satisfies AuthTokenPayload,
  env.JWT_SECRET,
  { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
)

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload