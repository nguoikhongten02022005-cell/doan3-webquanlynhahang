import type { CookieOptions, Response } from 'express'
import ms from 'ms'
import type { StringValue } from 'ms'
import { env } from './env.js'

const REFRESH_TOKEN_COOKIE_PATH = env.REFRESH_TOKEN_COOKIE_PATH

const tinhMsTuTtl = (ttl: string) => {
  const giaTri = ms(ttl as StringValue)

  if (giaTri === undefined) {
    throw new Error(`JWT_REFRESH_EXPIRES_IN không hợp lệ: ${ttl}`)
  }

  return giaTri
}

const refreshTokenTtlMs = tinhMsTuTtl(env.JWT_REFRESH_EXPIRES_IN)

export const cauHinhAuth = {
  refreshToken: {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    ttlMs: refreshTokenTtlMs,
    taoExpiresAt: (tuLuc = new Date()) => new Date(tuLuc.getTime() + refreshTokenTtlMs),
  },
  cookie: {
    ten: env.REFRESH_TOKEN_COOKIE_NAME,
    path: REFRESH_TOKEN_COOKIE_PATH,
    sameSite: 'lax' as const,
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: refreshTokenTtlMs,
    taoOptions: (tuLuc = new Date()): CookieOptions => ({
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      path: REFRESH_TOKEN_COOKIE_PATH,
      maxAge: refreshTokenTtlMs,
      expires: new Date(tuLuc.getTime() + refreshTokenTtlMs),
    }),
    xoaOptions: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: env.NODE_ENV === 'production',
      path: REFRESH_TOKEN_COOKIE_PATH,
    } satisfies CookieOptions,
  },
} as const

export const ganCookieRefreshToken = (res: Response, refreshToken: string, tuLuc = new Date()) => {
  res.cookie(cauHinhAuth.cookie.ten, refreshToken, cauHinhAuth.cookie.taoOptions(tuLuc))
}

export const xoaCookieRefreshToken = (res: Response) => {
  res.clearCookie(cauHinhAuth.cookie.ten, cauHinhAuth.cookie.xoaOptions)
}
