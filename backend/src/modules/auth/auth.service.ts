import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'
import { hashPassword, verifyPassword } from '../../common/utils/password.js'
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

export const loginUser = async (identifier: string, password: string, options?: { allowedRoles?: UserRole[] }) => {
  const normalizedIdentifier = identifier.trim()
  const user = await findByIdentifier(normalizedIdentifier)

  if (!user) {
    throw new HttpError(401, 'Tên tài khoản/email hoặc mật khẩu không đúng.')
  }

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
