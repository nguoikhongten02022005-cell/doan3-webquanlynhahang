import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'

export const listUsers = () => prisma.user.findMany({
  orderBy: [
    { role: 'asc' },
    { fullName: 'asc' },
  ],
})

export const getCurrentUserProfile = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw new HttpError(404, 'Không tìm thấy người dùng.')
  }

  return user
}

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    throw new HttpError(404, 'Không tìm thấy người dùng.')
  }

  return user
}

export const updateUserRole = async (id: number, role: 'customer' | 'staff' | 'admin') => {
  await getUserById(id)
  return prisma.user.update({ where: { id }, data: { role } })
}

export const updateUserStatus = async (id: number, status: 'ACTIVE' | 'INACTIVE') => {
  await getUserById(id)
  return prisma.user.update({ where: { id }, data: { status } })
}
