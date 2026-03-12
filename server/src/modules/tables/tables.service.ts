import type { TableStatus } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'

export const listTables = (filters?: { areaId?: string, status?: TableStatus, minCapacity?: number }) => prisma.table.findMany({
  where: {
    ...(filters?.areaId ? { areaId: filters.areaId } : {}),
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.minCapacity ? { capacity: { gte: filters.minCapacity } } : {}),
  },
  orderBy: { code: 'asc' },
})

export const getTableById = async (id: string) => {
  const table = await prisma.table.findUnique({ where: { id } })

  if (!table) {
    throw new HttpError(404, 'Không tìm thấy bàn.')
  }

  return table
}

export const createTable = async (payload: {
  id: string
  code: string
  name: string
  areaId: string
  capacity: number
  note?: string
}) => prisma.table.create({
  data: {
    id: payload.id,
    code: payload.code,
    name: payload.name,
    areaId: payload.areaId,
    capacity: payload.capacity,
    note: payload.note ?? '',
    status: 'AVAILABLE',
  },
})

export const updateTable = async (id: string, payload: Partial<{
  code: string
  name: string
  areaId: string
  capacity: number
  note: string
}>) => {
  await getTableById(id)

  return prisma.table.update({
    where: { id },
    data: {
      ...(payload.code !== undefined ? { code: payload.code } : {}),
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.areaId !== undefined ? { areaId: payload.areaId } : {}),
      ...(payload.capacity !== undefined ? { capacity: payload.capacity } : {}),
      ...(payload.note !== undefined ? { note: payload.note } : {}),
    },
  })
}

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

export const getAvailableTablesForBooking = async (bookingId: number) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })

  if (!booking) {
    throw new HttpError(404, 'Không tìm thấy booking.')
  }

  return prisma.table.findMany({
    where: {
      status: { in: ['AVAILABLE', 'HELD'] },
      capacity: { gte: booking.guests },
      ...(booking.seatingArea && booking.seatingArea !== 'KHONG_UU_TIEN' ? { areaId: booking.seatingArea } : {}),
      OR: [
        { activeBookingId: null },
        { activeBookingId: booking.id },
      ],
    },
    orderBy: { code: 'asc' },
  })
}
