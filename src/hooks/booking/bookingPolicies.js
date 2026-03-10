import { TABLE_STATUSES } from '../../services/tableService.js'
import { normalizeAssignedTableIds } from './bookingMappers.js'

export const ACTIVE_BOOKING_STATUSES = new Set([
  'CHO_XAC_NHAN',
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])

export const COMPLETED_BOOKING_STATUSES = new Set([
  'DA_HOAN_THANH',
  'DA_HUY',
  'KHONG_DEN',
  'TU_CHOI_HET_CHO',
])

export const EDITABLE_INTERNAL_BOOKING_STATUSES = new Set([
  'CHO_XAC_NHAN',
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
])

export const INTERNAL_BOOKING_CREATE_STATUSES = new Set([
  'CHO_XAC_NHAN',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
])

export const MANUAL_STATUS_TRANSITIONS = {
  YEU_CAU_DAT_BAN: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  CHO_XAC_NHAN: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  CAN_GOI_LAI: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  GIU_CHO_TAM: new Set(['DA_XAC_NHAN', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN', 'TU_CHOI_HET_CHO']),
  DA_XAC_NHAN: new Set(['GIU_CHO_TAM', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN']),
  DA_GHI_NHAN: new Set(['GIU_CHO_TAM', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN']),
  DA_CHECK_IN: new Set(['DA_XEP_BAN', 'DA_HOAN_THANH']),
  DA_XEP_BAN: new Set(['DA_HOAN_THANH']),
}

export const isCheckedInStatus = (status) => status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN'

export const isCompletedStatus = (status) => COMPLETED_BOOKING_STATUSES.has(status)

export const canCancelBooking = (status) => (
  status === 'CHO_XAC_NHAN'
  || status === 'YEU_CAU_DAT_BAN'
  || status === 'GIU_CHO_TAM'
  || status === 'CAN_GOI_LAI'
)

export const canEditInternalBooking = (booking) => {
  if (!booking) {
    return false
  }

  return !isCheckedInStatus(booking.status) && !isCompletedStatus(booking.status) && EDITABLE_INTERNAL_BOOKING_STATUSES.has(booking.status)
}

export const canManuallyTransitionBooking = (booking, nextStatus) => {
  if (!booking || !nextStatus || booking.status === nextStatus) {
    return false
  }

  if (isCompletedStatus(booking.status)) {
    return false
  }

  const allowedStatuses = MANUAL_STATUS_TRANSITIONS[booking.status]
  if (!allowedStatuses || !allowedStatuses.has(nextStatus)) {
    return false
  }

  if ((nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN') && !normalizeAssignedTableIds(booking.assignedTableIds).length) {
    return false
  }

  return true
}

export const validateAssignedTables = ({ assignedTableIds, tables, guestCount, preferredArea, bookingId }) => {
  const selectedTables = assignedTableIds
    .map((tableId) => tables.find((table) => table.id === tableId))
    .filter(Boolean)

  if (selectedTables.length !== assignedTableIds.length) {
    return { success: false, error: 'Có bàn không tồn tại hoặc đã bị thay đổi. Vui lòng tải lại dữ liệu.' }
  }

  const busyTable = selectedTables.find((table) => table.activeBookingId && String(table.activeBookingId) !== String(bookingId))
  if (busyTable) {
    return { success: false, error: `Bàn ${busyTable.code} hiện đang được sử dụng.` }
  }

  const invalidStatusTable = selectedTables.find((table) => table.status === TABLE_STATUSES.DIRTY)
  if (invalidStatusTable) {
    return { success: false, error: `Bàn ${invalidStatusTable.code} đang ở trạng thái dọn bàn.` }
  }

  const totalCapacity = selectedTables.reduce((sum, table) => sum + table.capacity, 0)
  if (guestCount > 0 && totalCapacity < guestCount) {
    return { success: false, error: 'Tổng sức chứa bàn được chọn chưa đủ số khách.' }
  }

  if (preferredArea && preferredArea !== 'KHONG_UU_TIEN') {
    const hasWrongArea = selectedTables.some((table) => table.areaId !== preferredArea)
    if (hasWrongArea) {
      return { success: false, error: 'Bàn được chọn không khớp khu vực ưu tiên của booking.' }
    }
  }

  return { success: true }
}
