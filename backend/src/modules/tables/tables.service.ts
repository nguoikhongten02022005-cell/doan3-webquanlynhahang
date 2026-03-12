import type { TableStatus } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'

export const listTables = () => prisma.table.findMany({ orderBy: { code: 'asc' } })

export const updateTableStatus = async (id: string, status: TableStatus) => {
  const table = await prisma.table.findUnique({ where: { id } })

  if (!table) {
    throw new HttpError(404, 'Không tìm thấy bàn.')
  }

  return prisma.table.update({
    where: { id },
    data: {
      status,
      activeBookingId: status === 'DIRTY' ? null : table.activeBookingId,
      activeBookingCode: status === 'DIRTY' ? '' : table.activeBookingCode,
      occupiedAt: status === 'AVAILABLE' || status === 'DIRTY' ? null : table.occupiedAt,
      releasedAt: status === 'AVAILABLE' ? new Date() : table.releasedAt,
    },
  })
}
