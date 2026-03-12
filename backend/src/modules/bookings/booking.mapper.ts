import type { Booking, BookingStatus, BookingTable, Table } from '@prisma/client'
import { toIsoString } from '../../common/serializers.js'
import { mapTable } from '../tables/table.mapper.js'

type BookingWithRelations = Booking & {
  bookingTables?: Array<BookingTable & { table: Table }>
}

const SEATING_LABELS: Record<string, string> = {
  KHONG_UU_TIEN: 'Không ưu tiên',
  SANH_CHINH: 'Sảnh chính',
  PHONG_VIP: 'Phòng riêng / VIP',
  BAN_CONG: 'Ban công / ngoài trời',
  QUAY_BAR: 'Quầy bar',
}

const normalizeAssignedTableIds = (booking: BookingWithRelations) => {
  if (!Array.isArray(booking.bookingTables)) {
    return []
  }

  return booking.bookingTables.map((link) => link.tableId)
}

const mapConfirmationChannel = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item))
  }

  if (typeof value === 'string' && value.trim()) {
    return [value]
  }

  return []
}

export const mapBookingStatusText = (status: BookingStatus) => {
  if (status === 'CHO_XAC_NHAN' || status === 'YEU_CAU_DAT_BAN') return '🟡 Yêu cầu đặt bàn'
  if (status === 'GIU_CHO_TAM') return '🟠 Đã giữ chỗ tạm'
  if (status === 'DA_XAC_NHAN') return '🟢 Đã xác nhận'
  if (status === 'CAN_GOI_LAI') return '📞 Cần gọi lại'
  if (status === 'DA_CHECK_IN') return '🟣 Đã check-in'
  if (status === 'DA_XEP_BAN') return '🍽️ Đã vào bàn'
  if (status === 'TU_CHOI_HET_CHO' || status === 'DA_HUY') return '🔴 Từ chối / hết chỗ'
  if (status === 'KHONG_DEN') return '⚫ Không đến'
  if (status === 'DA_HOAN_THANH') return '⚪ Đã hoàn thành'
  return status
}

export const mapBooking = (booking: BookingWithRelations) => ({
  id: booking.id,
  bookingCode: booking.bookingCode,
  guests: booking.guests,
  date: booking.date,
  time: booking.time,
  seatingArea: booking.seatingArea,
  notes: booking.notes,
  name: booking.name,
  phone: booking.phone,
  email: booking.email,
  status: booking.status,
  source: booking.source,
  createdAt: toIsoString(booking.createdAt),
  updatedAt: toIsoString(booking.updatedAt),
  userEmail: booking.userEmail,
  occasion: booking.occasion,
  confirmationChannel: mapConfirmationChannel(booking.confirmationChannel),
  internalNote: booking.internalNote,
  assignedTableIds: normalizeAssignedTableIds(booking),
  assignedTables: Array.isArray(booking.bookingTables)
    ? booking.bookingTables.map((link) => mapTable(link.table))
    : [],
  checkedInAt: toIsoString(booking.checkedInAt),
  seatedAt: toIsoString(booking.seatedAt),
  completedAt: toIsoString(booking.completedAt),
  cancelledAt: toIsoString(booking.cancelledAt),
  noShowAt: toIsoString(booking.noShowAt),
  createdBy: booking.createdBy,
})

const formatDate = (value: string) => {
  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) {
    return '--'
  }

  return `${day}/${month}/${year}`
}

export const mapBookingHistoryItem = (booking: BookingWithRelations) => ({
  bookingId: booking.id,
  id: `DB-${String(booking.id).slice(-6)}`,
  dateTime: `${formatDate(booking.date)} ${booking.time}`.trim(),
  guests: Number(booking.guests) || 0,
  seatingArea: SEATING_LABELS[booking.seatingArea] || '',
  rawStatus: booking.status,
  status: mapBookingStatusText(booking.status),
})
