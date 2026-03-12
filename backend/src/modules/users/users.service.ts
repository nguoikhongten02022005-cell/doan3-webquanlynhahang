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
