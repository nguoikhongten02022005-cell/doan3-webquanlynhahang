import { NHAN_KHU_VUC_DAT_BAN } from '../../data/duLieuDatBan.js'

export const dinhDangNgay = (value) => {
  if (!value) return '--'

  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return '--'

  return `${day}/${month}/${year}`
}

export const dinhDangMaDatBan = (bookingId) => `DB-${String(bookingId).slice(-6)}`

export const dinhDangNgayGioDatBan = (booking) => `${dinhDangNgay(booking.date)} ${booking.time || ''}`.trim()

export const anhXaTrangThaiDatBan = (status) => {
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

export const chuanHoaDanhSachIdBanDaGan = (value) => (
  Array.isArray(value)
    ? value.map((tableId) => String(tableId).trim()).filter(Boolean)
    : []
)

export const chuanHoaDatBan = (booking) => {
  if (!booking || typeof booking !== 'object') {
    return null
  }

  const normalizedId = Number.parseInt(booking.id, 10)

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    return null
  }

  const normalizedStatus = String(booking.status || 'CHO_XAC_NHAN').trim() || 'CHO_XAC_NHAN'
  const assignedTableIds = chuanHoaDanhSachIdBanDaGan(booking.assignedTableIds)

  return {
    id: normalizedId,
    bookingCode: String(booking.bookingCode || dinhDangMaDatBan(normalizedId)).trim() || dinhDangMaDatBan(normalizedId),
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

export const anhXaMucDatBan = (booking) => ({
  bookingId: booking.id,
  id: booking.bookingCode || dinhDangMaDatBan(booking.id),
  dateTime: dinhDangNgayGioDatBan(booking),
  guests: Number(booking.guests) || 0,
  seatingArea: NHAN_KHU_VUC_DAT_BAN[booking.seatingArea] || '',
  rawStatus: booking.status || 'CHO_XAC_NHAN',
  status: anhXaTrangThaiDatBan(booking.status),
})

export const layBangTraCuuBan = (tables) => new Map(tables.map((table) => [table.id, table]))

export const boSungBanChoDanhSachDatBan = (bookings, tables) => {
  const tableLookup = layBangTraCuuBan(tables)

  return bookings.map((booking) => {
    const assignedTableIds = chuanHoaDanhSachIdBanDaGan(booking.assignedTableIds)
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

export const taoDuLieuCapNhatDatBanNoiBo = (payload) => ({
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
