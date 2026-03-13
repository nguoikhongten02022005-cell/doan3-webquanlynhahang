import { BOOKING_SEATING_LABELS } from '../../data/bookingData.js'

export const formatDate = (value) => {
  if (!value) return '--'

  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return '--'

  return `${day}/${month}/${year}`
}

export const formatBookingId = (bookingId) => `DB-${String(bookingId).slice(-6)}`

export const formatBookingDateTime = (booking) => `${formatDate(booking.date)} ${booking.time || ''}`.trim()

export const mapBookingStatus = (status) => {
  if (!status) return '🟡 Yêu cầu đặt bàn'
  if (status === 'CHO_XAC_NHAN' || status === 'YEU_CAU_DAT_BAN') return '🟡 Yêu cầu đặt bàn'
  if (status === 'GIU_CHO_TAM') return '🟠 Đã giữ chỗ tạm'
  if (status === 'DA_XAC_NHAN') return '🟢 Đã xác nhận'
  if (status === 'CAN_GOI_LAI') return '📞 Cần gọi lại'
  if (status === 'DA_CHECK_IN') return '🟣 Đã check-in'
  if (status === 'DA_XEP_BAN') return '🍽️ Đã vào bàn'
  if (status === 'TU_CHOI_HET_CHO') return '🔴 Từ chối / hết chỗ'
  if (status === 'DA_HUY') return '🔴 Đã hủy'
  if (status === 'KHONG_DEN') return '⚫ Không đến'
  if (status === 'DA_HOAN_THANH') return '⚪ Đã hoàn thành'
  return status
}

export const normalizeAssignedTableIds = (value) => (
  Array.isArray(value)
    ? value.map((tableId) => String(tableId).trim()).filter(Boolean)
    : []
)

export const normalizeBooking = (booking) => {
  if (!booking || typeof booking !== 'object') {
    return null
  }

  const normalizedId = Number.parseInt(booking.id, 10)

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    return null
  }

  const normalizedStatus = String(booking.status || 'CHO_XAC_NHAN').trim() || 'CHO_XAC_NHAN'
  const assignedTableIds = normalizeAssignedTableIds(booking.assignedTableIds)

  return {
    id: normalizedId,
    bookingCode: String(booking.bookingCode || formatBookingId(normalizedId)).trim() || formatBookingId(normalizedId),
    guests: String(booking.guests ?? '').trim(),
    date: String(booking.date ?? '').trim(),
    time: String(booking.time ?? '').trim(),
    seatingArea: String(booking.seatingArea ?? 'KHONG_UU_TIEN').trim() || 'KHONG_UU_TIEN',
    notes: String(booking.notes ?? '').trim(),
    name: String(booking.name ?? '').trim(),
    phone: String(booking.phone ?? '').trim(),
    email: String(booking.email ?? '').trim(),
    status: normalizedStatus,
    source: String(booking.source ?? 'web').trim() || 'web',
    createdAt: String(booking.createdAt ?? '').trim(),
    updatedAt: String(booking.updatedAt ?? '').trim(),
    userEmail: booking.userEmail ?? null,
    occasion: String(booking.occasion ?? '').trim(),
    confirmationChannel: Array.isArray(booking.confirmationChannel)
      ? booking.confirmationChannel.filter(Boolean)
      : booking.confirmationChannel
        ? [String(booking.confirmationChannel)]
        : [],
    internalNote: String(booking.internalNote ?? '').trim(),
    assignedTableIds,
    assignedTables: Array.isArray(booking.assignedTables) ? booking.assignedTables.filter(Boolean) : [],
    checkedInAt: String(booking.checkedInAt ?? '').trim(),
    seatedAt: String(booking.seatedAt ?? '').trim(),
    completedAt: String(booking.completedAt ?? '').trim(),
    cancelledAt: String(booking.cancelledAt ?? '').trim(),
    noShowAt: String(booking.noShowAt ?? '').trim(),
    createdBy: String(booking.createdBy ?? '').trim(),
  }
}

export const mapBookingItem = (booking) => ({
  bookingId: booking.id,
  id: booking.bookingCode || formatBookingId(booking.id),
  dateTime: formatBookingDateTime(booking),
  guests: Number(booking.guests) || 0,
  seatingArea: BOOKING_SEATING_LABELS[booking.seatingArea] || '',
  rawStatus: booking.status || 'CHO_XAC_NHAN',
  status: mapBookingStatus(booking.status),
})

export const getTableLookup = (tables) => new Map(tables.map((table) => [table.id, table]))

export const hydrateBookingsWithTables = (bookings, tables) => {
  const tableLookup = getTableLookup(tables)

  return bookings.map((booking) => {
    const assignedTableIds = normalizeAssignedTableIds(booking.assignedTableIds)
    const assignedTables = assignedTableIds
      .map((tableId) => tableLookup.get(tableId))
      .filter(Boolean)

    return {
      ...booking,
      assignedTableIds,
      assignedTables,
    }
  })
}

export const getMetadataPatchForInternalBooking = (payload) => ({
  name: payload.name,
  phone: payload.phone,
  email: payload.email,
  guests: payload.guests,
  date: payload.date,
  time: payload.time,
  seatingArea: payload.seatingArea,
  notes: payload.notes,
  internalNote: payload.internalNote,
  occasion: payload.occasion,
})
