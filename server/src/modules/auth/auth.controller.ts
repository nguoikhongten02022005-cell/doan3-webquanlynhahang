import type { Request, Response } from 'express'
import { env } from '../../config/env.js'
import { loginSchema, registerSchema, updateProfileSchema } from './auth.schema.js'
import { mapCurrentUser, mapUser } from '../users/user.mapper.js'
import {
  createSessionTokens,
  getAuthUserById,
  loginUser,
  refreshSessionTokens,
  registerUser,
  revokeRefreshToken,
  updateAuthUserProfile,
} from './auth.service.js'

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.NODE_ENV === 'production',
  path: '/api',
}

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...refreshCookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })
}

const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions)
}

export const login = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body)
  const user = await loginUser(payload.identifier, payload.password)
  const { accessToken, refreshToken } = await createSessionTokens(user)

  setRefreshTokenCookie(res, refreshToken)

  res.json({
    success: true,
    message: 'Đăng nhập thành công.',
    accessToken,
    tokenType: 'Bearer',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const internalLogin = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body)
  const user = await loginUser(payload.identifier, payload.password, { allowedRoles: ['admin', 'staff'] })
  const { accessToken, refreshToken } = await createSessionTokens(user)

  setRefreshTokenCookie(res, refreshToken)

  res.json({
    success: true,
    message: 'Đăng nhập nội bộ thành công.',
    accessToken,
    tokenType: 'Bearer',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const register = async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body)
  const user = await registerUser(payload)
  const { accessToken, refreshToken } = await createSessionTokens(user)

  setRefreshTokenCookie(res, refreshToken)

  res.status(201).json({
    success: true,
    message: 'Đăng ký tài khoản thành công.',
    accessToken,
    tokenType: 'Bearer',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const getMe = async (req: Request, res: Response) => {
  const user = await getAuthUserById(req.authUser!.id)

  res.json({
    success: true,
    message: 'Lấy thông tin người dùng thành công.',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const patchMe = async (req: Request, res: Response) => {
  const payload = updateProfileSchema.parse(req.body)
  const user = await updateAuthUserProfile(req.authUser!.id, payload)

  res.json({
    success: true,
    message: 'Cập nhật hồ sơ thành công.',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME]

  if (!refreshToken) {
    clearRefreshTokenCookie(res)
    res.status(401).json({
      success: false,
      message: 'Không tìm thấy refresh token.',
    })
    return
  }

  const { user, accessToken, refreshToken: nextRefreshToken } = await refreshSessionTokens(refreshToken)
  setRefreshTokenCookie(res, nextRefreshToken)

  res.json({
    success: true,
    message: 'Làm mới phiên đăng nhập thành công.',
    accessToken,
    tokenType: 'Bearer',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME]

  if (refreshToken) {
    await revokeRefreshToken(refreshToken)
  }

  clearRefreshTokenCookie(res)

  res.json({
    success: true,
    message: 'Đăng xuất thành công.',
  })
}
