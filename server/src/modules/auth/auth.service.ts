import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'
import { hashPassword, verifyPassword } from '../../common/utils/password.js'
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.js'
import type { AuthUser } from '../../common/auth.js'
import type { UserRole } from '@prisma/client'

const findByIdentifier = async (identifier: string) => prisma.user.findFirst({
  where: {
    OR: [
      { username: identifier },
      { email: identifier },
    ],
  },
})

const assertRoleAllowed = (role: UserRole, allowedRoles?: UserRole[]) => {
  if (allowedRoles && !allowedRoles.includes(role)) {
    throw new HttpError(403, 'Tài khoản này không có quyền truy cập khu vực nội bộ.')
  }
}

const assertUserActive = (status: string) => {
  if (status !== 'ACTIVE') {
    throw new HttpError(403, 'Tài khoản đã bị vô hiệu hóa.')
  }
}

const toAuthUser = (user: { id: number, email: string, username: string, role: UserRole }): AuthUser => ({
  id: user.id,
  email: user.email,
  username: user.username,
  role: user.role,
})

const parseRefreshExpiry = () => {
  const normalized = String(process.env.JWT_REFRESH_EXPIRES_IN || '7d').trim()
  const match = normalized.match(/^(\d+)([dhms])$/i)

  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }

  const value = Number(match[1])
  const unit = match[2].toLowerCase()
  const multipliers: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  }

  return new Date(Date.now() + value * multipliers[unit])
}

export const loginUser = async (identifier: string, password: string, options?: { allowedRoles?: UserRole[] }) => {
  const normalizedIdentifier = identifier.trim()
  const user = await findByIdentifier(normalizedIdentifier)

  if (!user) {
    throw new HttpError(401, 'Tên tài khoản/email hoặc mật khẩu không đúng.')
  }

  assertUserActive(user.status)

  const passwordMatched = await verifyPassword(password, user.password)

  if (!passwordMatched) {
    throw new HttpError(401, 'Tên tài khoản/email hoặc mật khẩu không đúng.')
  }

  assertRoleAllowed(user.role, options?.allowedRoles)

  return user
}

export const registerUser = async (payload: {
  fullName: string
  username: string
  email: string
  password: string
}) => {
  const username = payload.username.trim()
  const email = payload.email.trim().toLowerCase()

  const duplicate = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email },
      ],
    },
  })

  if (duplicate) {
    throw new HttpError(409, 'Tên tài khoản hoặc email đã tồn tại.')
  }

  const hashedPassword = await hashPassword(payload.password)

  return prisma.user.create({
    data: {
      fullName: payload.fullName.trim(),
      username,
      email,
      password: hashedPassword,
      role: 'customer',
      status: 'ACTIVE',
    },
  })
}

export const getAuthUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw new HttpError(404, 'Không tìm thấy người dùng.')
  }

  return user
}

export const updateAuthUserProfile = async (id: number, payload: { fullName?: string, phone?: string }) => {
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw new HttpError(404, 'Không tìm thấy người dùng.')
  }

  return prisma.user.update({
    where: { id },
    data: {
      ...(payload.fullName !== undefined ? { fullName: payload.fullName.trim() } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone.trim() } : {}),
    },
  })
}

export const createSessionTokens = async (user: { id: number, email: string, username: string, role: UserRole }) => {
  const authUser = toAuthUser(user)
  const accessToken = signAccessToken(authUser)
  const refreshToken = signRefreshToken(authUser)

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: parseRefreshExpiry(),
    },
  })

  return { accessToken, refreshToken }
}

export const refreshSessionTokens = async (refreshToken: string) => {
  verifyRefreshToken(refreshToken)
  const tokenHash = hashToken(refreshToken)

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
    throw new HttpError(401, 'Refresh token không hợp lệ hoặc đã hết hạn.')
  }

  assertUserActive(storedToken.user.status)

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  })

  const nextTokens = await createSessionTokens({
    id: storedToken.user.id,
    email: storedToken.user.email,
    username: storedToken.user.username,
    role: storedToken.user.role,
  })

  return {
    user: storedToken.user,
    ...nextTokens,
  }
}

export const revokeRefreshToken = async (refreshToken: string) => {
  const tokenHash = hashToken(refreshToken)

  await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })
}
