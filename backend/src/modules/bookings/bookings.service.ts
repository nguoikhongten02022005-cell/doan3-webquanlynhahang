import type { BookingStatus, Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'

const bookingInclude = {
  bookingTables: {
    include: {
      table: true,
    },
  },
} satisfies Prisma.BookingInclude

const ACTIVE_STATUSES = new Set<BookingStatus>([
  'YEU_CAU_DAT_BAN',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])

const generateBookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'DB-'
  for (let index = 0; index < 6; index += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

const buildBookingStatusPatch = (status: BookingStatus) => {
  const now = new Date()

  return {
    status,
    checkedInAt: status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN' ? now : undefined,
    seatedAt: status === 'DA_XEP_BAN' ? now : undefined,
    completedAt: status === 'DA_HOAN_THANH' ? now : undefined,
    cancelledAt: status === 'DA_HUY' || status === 'TU_CHOI_HET_CHO' ? now : undefined,
    noShowAt: status === 'KHONG_DEN' ? now : undefined,
  }
}

const syncTablesForBooking = async (bookingId: number, bookingCode: string, status: BookingStatus, tableIds: string[]) => {
  const allTables = await prisma.table.findMany()
  const now = new Date()

  await Promise.all(allTables.map((table) => {
    const isAssigned = tableIds.includes(table.id)

    if (!isAssigned && table.activeBookingId === bookingId && !ACTIVE_STATUSES.has(status)) {
      return prisma.table.update({
        where: { id: table.id },
        data: {
          status: 'AVAILABLE',
          activeBookingId: null,
          activeBookingCode: '',
          occupiedAt: null,
          releasedAt: now,
        },
      })
    }

    if (!isAssigned) {
      return Promise.resolve(table)
    }

    if (!ACTIVE_STATUSES.has(status)) {
      return prisma.table.update({
        where: { id: table.id },
        data: {
          status: 'AVAILABLE',
          activeBookingId: null,
          activeBookingCode: '',
          occupiedAt: null,
          releasedAt: now,
        },
      })
    }

    return prisma.table.update({
      where: { id: table.id },
      data: {
        status: status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN' ? 'OCCUPIED' : 'HELD',
        activeBookingId: bookingId,
        activeBookingCode: bookingCode,
        occupiedAt: status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN' ? now : table.occupiedAt,
        releasedAt: null,
      },
    })
  }))
}

export const listBookings = () => prisma.booking.findMany({
  include: bookingInclude,
  orderBy: [
    { date: 'asc' },
    { time: 'asc' },
    { id: 'desc' },
  ],
})

export const listBookingHistory = async (userEmail?: string) => {
  if (!userEmail) {
    return []
  }

  return prisma.booking.findMany({
    where: {
      OR: [
        { userEmail },
        { email: userEmail },
      ],
    },
    include: bookingInclude,
    orderBy: { id: 'desc' },
  })
}

export const createBooking = async (payload: {
  guests: string
  date: string
  time: string
  seatingArea: string
  notes: string
  name: string
  phone: string
  email: string
  status?: BookingStatus
  source: string
  bookingCode?: string
  userEmail?: string | null
  occasion: string
  confirmationChannel: string[]
  internalNote: string
  createdBy: string
}) => {
  const normalizedUserEmail = payload.userEmail?.trim().toLowerCase() || null
  const user = normalizedUserEmail
    ? await prisma.user.findFirst({ where: { email: normalizedUserEmail } })
    : null

  return prisma.booking.create({
    data: {
      bookingCode: payload.bookingCode || generateBookingCode(),
      guests: payload.guests,
      date: payload.date,
      time: payload.time,
      seatingArea: payload.seatingArea,
      notes: payload.notes,
      name: payload.name,
      phone: payload.phone,
      email: payload.email.trim().toLowerCase(),
      status: payload.status || 'CHO_XAC_NHAN',
      source: payload.source,
      userEmail: normalizedUserEmail,
      occasion: payload.occasion,
      confirmationChannel: payload.confirmationChannel,
      internalNote: payload.internalNote,
      createdBy: payload.createdBy,
      userId: user?.id,
    },
    include: bookingInclude,
  })
}

export const updateBooking = async (id: number, payload: Partial<{
  guests: string
  date: string
  time: string
  seatingArea: string
  notes: string
  name: string
  phone: string
  email: string
  status: BookingStatus
  source: string
  bookingCode?: string
  userEmail?: string | null
  occasion: string
  confirmationChannel: string[]
  internalNote: string
  createdBy: string
}>) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  })

  if (!booking) {
    throw new HttpError(404, 'Không tìm thấy booking.')
  }

  const normalizedUserEmail = payload.userEmail === undefined
    ? booking.userEmail
    : payload.userEmail?.trim().toLowerCase() || null

  const user = normalizedUserEmail
    ? await prisma.user.findFirst({ where: { email: normalizedUserEmail } })
    : null

  const nextBooking = await prisma.booking.update({
    where: { id },
    data: {
      ...(payload.guests !== undefined ? { guests: payload.guests } : {}),
      ...(payload.date !== undefined ? { date: payload.date } : {}),
      ...(payload.time !== undefined ? { time: payload.time } : {}),
      ...(payload.seatingArea !== undefined ? { seatingArea: payload.seatingArea } : {}),
      ...(payload.notes !== undefined ? { notes: payload.notes } : {}),
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.email !== undefined ? { email: payload.email.trim().toLowerCase() } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.source !== undefined ? { source: payload.source } : {}),
      ...(payload.bookingCode !== undefined ? { bookingCode: payload.bookingCode } : {}),
      ...(payload.userEmail !== undefined ? { userEmail: normalizedUserEmail } : {}),
      ...(payload.occasion !== undefined ? { occasion: payload.occasion } : {}),
      ...(payload.confirmationChannel !== undefined ? { confirmationChannel: payload.confirmationChannel } : {}),
      ...(payload.internalNote !== undefined ? { internalNote: payload.internalNote } : {}),
      ...(payload.createdBy !== undefined ? { createdBy: payload.createdBy } : {}),
      userId: user?.id ?? null,
    },
    include: bookingInclude,
  })

  await syncTablesForBooking(nextBooking.id, nextBooking.bookingCode, nextBooking.status, nextBooking.bookingTables.map((link) => link.tableId))

  return nextBooking
}

export const updateBookingStatus = async (id: number, status: BookingStatus) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  })

  if (!booking) {
    throw new HttpError(404, 'Không tìm thấy booking.')
  }

  const nextBooking = await prisma.booking.update({
    where: { id },
    data: buildBookingStatusPatch(status),
    include: bookingInclude,
  })

  await syncTablesForBooking(nextBooking.id, nextBooking.bookingCode, nextBooking.status, nextBooking.bookingTables.map((link) => link.tableId))

  return prisma.booking.findUniqueOrThrow({
    where: { id },
    include: bookingInclude,
  })
}

export const cancelBookingByCustomer = async (id: number, userEmail: string) => {
  const normalizedUserEmail = String(userEmail || '').trim().toLowerCase()
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  })

  if (!booking) {
    throw new HttpError(404, 'Không tìm thấy booking.')
  }

  const ownerEmail = String(booking.userEmail || booking.email || '').trim().toLowerCase()
  if (!normalizedUserEmail || ownerEmail !== normalizedUserEmail) {
    throw new HttpError(403, 'Bạn không có quyền hủy booking này.')
  }

  if (!['CHO_XAC_NHAN', 'YEU_CAU_DAT_BAN', 'GIU_CHO_TAM', 'CAN_GOI_LAI'].includes(booking.status)) {
    throw new HttpError(400, 'Đặt bàn đã xác nhận. Vui lòng gọi hotline để được hỗ trợ hủy.')
  }

  return updateBookingStatus(id, 'DA_HUY')
}

export const assignTables = async (id: number, tableIds: string[]) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  })

  if (!booking) {
    throw new HttpError(404, 'Không tìm thấy booking.')
  }

  const tables = await prisma.table.findMany({ where: { id: { in: tableIds } } })

  if (tables.length !== tableIds.length) {
    throw new HttpError(400, 'Có bàn không tồn tại hoặc đã bị thay đổi. Vui lòng tải lại dữ liệu.')
  }

  const busyTable = tables.find((table) => table.activeBookingId && table.activeBookingId !== booking.id)
  if (busyTable) {
    throw new HttpError(400, `Bàn ${busyTable.code} hiện đang được sử dụng.`)
  }

  const invalidStatusTable = tables.find((table) => table.status === 'DIRTY')
  if (invalidStatusTable) {
    throw new HttpError(400, `Bàn ${invalidStatusTable.code} đang ở trạng thái dọn bàn.`)
  }

  const totalCapacity = tables.reduce((sum, table) => sum + table.capacity, 0)
  if ((Number(booking.guests) || 0) > totalCapacity) {
    throw new HttpError(400, 'Tổng sức chứa bàn được chọn chưa đủ số khách.')
  }

  if (booking.seatingArea && booking.seatingArea !== 'KHONG_UU_TIEN') {
    const wrongArea = tables.some((table) => table.areaId !== booking.seatingArea)
    if (wrongArea) {
      throw new HttpError(400, 'Bàn được chọn không khớp khu vực ưu tiên của booking.')
    }
  }

  await prisma.bookingTable.deleteMany({ where: { bookingId: booking.id } })
  await prisma.bookingTable.createMany({
    data: tableIds.map((tableId) => ({ bookingId: booking.id, tableId })),
  })

  const nextStatus = booking.status === 'YEU_CAU_DAT_BAN' || booking.status === 'CHO_XAC_NHAN' ? 'GIU_CHO_TAM' : booking.status

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: nextStatus },
  })

  await syncTablesForBooking(booking.id, booking.bookingCode, nextStatus, tableIds)

  return prisma.booking.findUniqueOrThrow({
    where: { id: booking.id },
    include: bookingInclude,
  })
}
