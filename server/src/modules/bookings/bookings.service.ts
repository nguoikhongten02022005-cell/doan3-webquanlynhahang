import type { BookingStatus, Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'
import type { AuthUser } from '../../common/auth.js'
import { kiemTraChuyenTrangThaiHopLe } from './booking-status.js'

const bookingInclude = {
  bookingTables: {
    include: {
      table: true,
    },
  },
} satisfies Prisma.BookingInclude

type BookingKemBan = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>
type GiaoDich = Prisma.TransactionClient

const TRANG_THAI_CON_HIEU_LUC = new Set<BookingStatus>([
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

const chuanHoaEmail = (value?: string | null) => String(value || '').trim().toLowerCase()

const laNhanSuNoiBo = (nguoiDung?: AuthUser | null) => nguoiDung?.role === 'admin' || nguoiDung?.role === 'staff'

const laChuSoHuuBooking = (booking: BookingKemBan, nguoiDung: AuthUser) => {
  if (booking.userId && booking.userId === nguoiDung.id) {
    return true
  }

  const emailNguoiDung = chuanHoaEmail(nguoiDung.email)
  if (!emailNguoiDung) {
    return false
  }

  return [booking.userEmail, booking.email].some((email) => chuanHoaEmail(email) === emailNguoiDung)
}

const xacThucQuyenXemBooking = (booking: BookingKemBan, nguoiDung: AuthUser) => {
  if (laNhanSuNoiBo(nguoiDung)) {
    return
  }

  if (!laChuSoHuuBooking(booking, nguoiDung)) {
    throw new HttpError(403, 'Bạn không có quyền truy cập booking này.')
  }
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

const layBookingTheoId = async (db: Pick<GiaoDich, 'booking'>, id: number) => {
  const booking = await db.booking.findUnique({
    where: { id },
    include: bookingInclude,
  })

  if (!booking) {
    throw new HttpError(404, 'Không tìm thấy booking.')
  }

  return booking
}

const dongBoBanChoBooking = async (
  tx: GiaoDich,
  {
    bookingId,
    bookingCode,
    status,
    tableIds,
  }: {
    bookingId: number
    bookingCode: string
    status: BookingStatus
    tableIds: string[]
  },
) => {
  const now = new Date()

  if (!TRANG_THAI_CON_HIEU_LUC.has(status)) {
    await tx.table.updateMany({
      where: { activeBookingId: bookingId },
      data: {
        status: 'AVAILABLE',
        activeBookingId: null,
        activeBookingCode: '',
        occupiedAt: null,
        releasedAt: now,
      },
    })
    return
  }

  await tx.table.updateMany({
    where: {
      activeBookingId: bookingId,
      ...(tableIds.length > 0 ? { id: { notIn: tableIds } } : {}),
    },
    data: {
      status: 'AVAILABLE',
      activeBookingId: null,
      activeBookingCode: '',
      occupiedAt: null,
      releasedAt: now,
    },
  })

  if (tableIds.length === 0) {
    return
  }

  await Promise.all(tableIds.map((tableId) => tx.table.update({
    where: { id: tableId },
    data: {
      status: status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN' ? 'OCCUPIED' : 'HELD',
      activeBookingId: bookingId,
      activeBookingCode: bookingCode,
      occupiedAt: status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN' ? now : null,
      releasedAt: null,
    },
  })))
}

export const listBookings = () => prisma.booking.findMany({
  include: bookingInclude,
  orderBy: [
    { date: 'asc' },
    { time: 'asc' },
    { id: 'desc' },
  ],
})

export const listBookingHistory = async (nguoiDung: AuthUser) => prisma.booking.findMany({
  where: {
    OR: [
      { userId: nguoiDung.id },
      { userEmail: chuanHoaEmail(nguoiDung.email) },
      { email: chuanHoaEmail(nguoiDung.email) },
    ],
  },
  include: bookingInclude,
  orderBy: { id: 'desc' },
})

export const getBookingById = async (id: number, nguoiDung: AuthUser) => {
  const booking = await layBookingTheoId(prisma, id)
  xacThucQuyenXemBooking(booking, nguoiDung)
  return booking
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
  const userEmailDaChuanHoa = chuanHoaEmail(payload.userEmail)

  return prisma.$transaction(async (tx) => {
    const nguoiDung = userEmailDaChuanHoa
      ? await tx.user.findFirst({ where: { email: userEmailDaChuanHoa } })
      : null

    return tx.booking.create({
      data: {
        bookingCode: payload.bookingCode || generateBookingCode(),
        guests: Number(payload.guests) || 0,
        date: payload.date,
        time: payload.time,
        seatingArea: payload.seatingArea,
        notes: payload.notes,
        name: payload.name,
        phone: payload.phone,
        email: chuanHoaEmail(payload.email),
        status: payload.status || 'CHO_XAC_NHAN',
        source: payload.source,
        userEmail: userEmailDaChuanHoa || null,
        occasion: payload.occasion,
        confirmationChannel: payload.confirmationChannel,
        internalNote: payload.internalNote,
        createdBy: payload.createdBy,
        userId: nguoiDung?.id,
      },
      include: bookingInclude,
    })
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
}>) => prisma.$transaction(async (tx) => {
  const booking = await layBookingTheoId(tx, id)

  const userEmailDaChuanHoa = payload.userEmail === undefined
    ? booking.userEmail
    : chuanHoaEmail(payload.userEmail) || null

  const nguoiDung = userEmailDaChuanHoa
    ? await tx.user.findFirst({ where: { email: userEmailDaChuanHoa } })
    : null

  if (payload.status !== undefined) {
    kiemTraChuyenTrangThaiHopLe(booking.status, payload.status)
  }

  const bookingDaCapNhat = await tx.booking.update({
    where: { id },
    data: {
      ...(payload.guests !== undefined ? { guests: Number(payload.guests) || 0 } : {}),
      ...(payload.date !== undefined ? { date: payload.date } : {}),
      ...(payload.time !== undefined ? { time: payload.time } : {}),
      ...(payload.seatingArea !== undefined ? { seatingArea: payload.seatingArea } : {}),
      ...(payload.notes !== undefined ? { notes: payload.notes } : {}),
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.email !== undefined ? { email: chuanHoaEmail(payload.email) } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.source !== undefined ? { source: payload.source } : {}),
      ...(payload.bookingCode !== undefined ? { bookingCode: payload.bookingCode } : {}),
      ...(payload.userEmail !== undefined ? { userEmail: userEmailDaChuanHoa } : {}),
      ...(payload.occasion !== undefined ? { occasion: payload.occasion } : {}),
      ...(payload.confirmationChannel !== undefined ? { confirmationChannel: payload.confirmationChannel } : {}),
      ...(payload.internalNote !== undefined ? { internalNote: payload.internalNote } : {}),
      ...(payload.createdBy !== undefined ? { createdBy: payload.createdBy } : {}),
      userId: nguoiDung?.id ?? null,
    },
    include: bookingInclude,
  })

  await dongBoBanChoBooking(tx, {
    bookingId: bookingDaCapNhat.id,
    bookingCode: bookingDaCapNhat.bookingCode,
    status: bookingDaCapNhat.status,
    tableIds: bookingDaCapNhat.bookingTables.map((link) => link.tableId),
  })

  return layBookingTheoId(tx, id)
})

export const updateBookingStatus = async (id: number, status: BookingStatus) => prisma.$transaction(async (tx) => {
  const booking = await layBookingTheoId(tx, id)
  kiemTraChuyenTrangThaiHopLe(booking.status, status)

  const bookingDaCapNhat = await tx.booking.update({
    where: { id },
    data: buildBookingStatusPatch(status),
    include: bookingInclude,
  })

  await dongBoBanChoBooking(tx, {
    bookingId: bookingDaCapNhat.id,
    bookingCode: bookingDaCapNhat.bookingCode,
    status: bookingDaCapNhat.status,
    tableIds: booking.bookingTables.map((link) => link.tableId),
  })

  return layBookingTheoId(tx, id)
})

export const cancelBookingByCustomer = async (id: number, nguoiDung: AuthUser) => {
  const booking = await layBookingTheoId(prisma, id)
  xacThucQuyenXemBooking(booking, nguoiDung)

  if (!['CHO_XAC_NHAN', 'YEU_CAU_DAT_BAN', 'GIU_CHO_TAM', 'CAN_GOI_LAI'].includes(booking.status)) {
    throw new HttpError(400, 'Đặt bàn đã xác nhận. Vui lòng gọi hotline để được hỗ trợ hủy.')
  }

  return updateBookingStatus(id, 'DA_HUY')
}

export const assignTables = async (id: number, tableIds: string[]) => prisma.$transaction(async (tx) => {
  const booking = await layBookingTheoId(tx, id)

  if (['DA_HUY', 'TU_CHOI_HET_CHO', 'KHONG_DEN', 'DA_HOAN_THANH'].includes(booking.status)) {
    throw new HttpError(400, 'Không thể gán bàn cho booking đã kết thúc hoặc đã hủy.')
  }

  const tables = await tx.table.findMany({ where: { id: { in: tableIds } } })

  if (tables.length !== tableIds.length) {
    throw new HttpError(400, 'Có bàn không tồn tại hoặc đã bị thay đổi. Vui lòng tải lại dữ liệu.')
  }

  const banDangBan = tables.find((table) => table.activeBookingId && table.activeBookingId !== booking.id)
  if (banDangBan) {
    throw new HttpError(400, `Bàn ${banDangBan.code} hiện đang được sử dụng.`)
  }

  const banKhongHopLe = tables.find((table) => table.status === 'DIRTY')
  if (banKhongHopLe) {
    throw new HttpError(400, `Bàn ${banKhongHopLe.code} đang ở trạng thái dọn bàn.`)
  }

  const tongSucChua = tables.reduce((sum, table) => sum + table.capacity, 0)
  if ((Number(booking.guests) || 0) > tongSucChua) {
    throw new HttpError(400, 'Tổng sức chứa bàn được chọn chưa đủ số khách.')
  }

  if (booking.seatingArea && booking.seatingArea !== 'KHONG_UU_TIEN') {
    const saiKhuVuc = tables.some((table) => table.areaId !== booking.seatingArea)
    if (saiKhuVuc) {
      throw new HttpError(400, 'Bàn được chọn không khớp khu vực ưu tiên của booking.')
    }
  }

  await tx.bookingTable.deleteMany({ where: { bookingId: booking.id } })
  await tx.bookingTable.createMany({
    data: tableIds.map((tableId) => ({ bookingId: booking.id, tableId })),
  })

  const trangThaiMoi = booking.status === 'YEU_CAU_DAT_BAN' || booking.status === 'CHO_XAC_NHAN'
    ? 'GIU_CHO_TAM'
    : booking.status

  if (trangThaiMoi !== booking.status) {
    kiemTraChuyenTrangThaiHopLe(booking.status, trangThaiMoi)
  }

  const bookingDaCapNhat = await tx.booking.update({
    where: { id: booking.id },
    data: { status: trangThaiMoi },
    include: bookingInclude,
  })

  await dongBoBanChoBooking(tx, {
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    status: bookingDaCapNhat.status,
    tableIds,
  })

  return layBookingTheoId(tx, booking.id)
})
