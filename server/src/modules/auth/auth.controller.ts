import type { Request, Response } from 'express'
import { HttpError } from '../../common/http-error.js'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'
import { cauHinhAuth, ganCookieRefreshToken, xoaCookieRefreshToken } from '../../config/auth.js'
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

const taoDuLieuAuth = (user: Parameters<typeof mapUser>[0], accessToken: string) => ({
  accessToken,
  tokenType: 'Bearer',
  user: mapUser(user),
  currentUser: mapCurrentUser(user),
})

export const login = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body)
  const user = await loginUser(payload.identifier, payload.password)
  const { accessToken, refreshToken } = await createSessionTokens(user)

  ganCookieRefreshToken(res, refreshToken)

  return phanHoiThanhCong(res, {
    message: 'Đăng nhập thành công.',
    data: taoDuLieuAuth(user, accessToken),
  })
}

export const internalLogin = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body)
  const user = await loginUser(payload.identifier, payload.password, { allowedRoles: ['admin', 'staff'] })
  const { accessToken, refreshToken } = await createSessionTokens(user)

  ganCookieRefreshToken(res, refreshToken)

  return phanHoiThanhCong(res, {
    message: 'Đăng nhập nội bộ thành công.',
    data: taoDuLieuAuth(user, accessToken),
  })
}

export const register = async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body)
  const user = await registerUser(payload)
  const { accessToken, refreshToken } = await createSessionTokens(user)

  ganCookieRefreshToken(res, refreshToken)

  return phanHoiThanhCong(res, {
    statusCode: 201,
    message: 'Đăng ký tài khoản thành công.',
    data: taoDuLieuAuth(user, accessToken),
  })
}

export const getMe = async (req: Request, res: Response) => {
  const user = await getAuthUserById(req.authUser!.id)

  return phanHoiThanhCong(res, {
    message: 'Lấy thông tin người dùng thành công.',
    data: {
      user: mapUser(user),
      currentUser: mapCurrentUser(user),
    },
  })
}

export const patchMe = async (req: Request, res: Response) => {
  const payload = updateProfileSchema.parse(req.body)
  const user = await updateAuthUserProfile(req.authUser!.id, payload)

  return phanHoiThanhCong(res, {
    message: 'Cập nhật hồ sơ thành công.',
    data: {
      user: mapUser(user),
      currentUser: mapCurrentUser(user),
    },
  })
}

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[cauHinhAuth.cookie.ten]

  if (!refreshToken) {
    xoaCookieRefreshToken(res)
    throw new HttpError(401, 'Không tìm thấy refresh token.')
  }

  const { user, accessToken, refreshToken: nextRefreshToken } = await refreshSessionTokens(refreshToken)
  ganCookieRefreshToken(res, nextRefreshToken)

  return phanHoiThanhCong(res, {
    message: 'Làm mới phiên đăng nhập thành công.',
    data: taoDuLieuAuth(user, accessToken),
  })
}

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[cauHinhAuth.cookie.ten]

  if (refreshToken) {
    await revokeRefreshToken(refreshToken)
  }

  xoaCookieRefreshToken(res)

  return phanHoiThanhCong(res, {
    message: 'Đăng xuất thành công.',
    data: null,
  })
}
