import { TABLE_STATUSES } from '../../services/tableService'
import {
  ACTIVE_BOOKING_STATUSES,
  CONFIRMED_BOOKING_STATUSES,
  DAY_FILTERS,
  PENDING_CONFIRMATION_STATUSES,
  SHIFT_FILTERS,
  TABLE_AREAS,
} from './constants'
import { getOrderStatusTone } from './formatters'

export const isVipBooking = (booking) => booking.seatingArea === 'PHONG_VIP'
export const needsManualConfirmation = (booking) => PENDING_CONFIRMATION_STATUSES.has(booking.status) || isVipBooking(booking)

export const getBookingPriorityNote = (booking) => {
  if (isVipBooking(booking)) return 'Ưu tiên xác nhận thủ công do yêu cầu VIP hoặc phòng riêng.'
  if (booking.status === 'CAN_GOI_LAI') return 'Cần gọi lại để chốt tình trạng chỗ trống hoặc điều kiện phục vụ.'
  if (!Array.isArray(booking.assignedTableIds) || booking.assignedTableIds.length === 0) return 'Booking chưa được gán bàn cụ thể.'
  if (booking.seatingArea === 'BAN_CONG') return 'Kiểm tra thời tiết trước khi chốt vị trí ban công.'
  return ''
}

const FINAL_BOOKING_STATUSES = new Set([
  'DA_HOAN_THANH',
  'DA_HUY',
  'KHONG_DEN',
  'TU_CHOI_HET_CHO',
])

export const hasAssignedTables = (booking) => Array.isArray(booking?.assignedTableIds) && booking.assignedTableIds.length > 0
export const isCheckedInBooking = (booking) => booking.status === 'DA_CHECK_IN' || booking.status === 'DA_XEP_BAN'
export const isFinalBookingStatus = (booking) => FINAL_BOOKING_STATUSES.has(booking?.status)

export const canAssignBookingTables = (booking) => !isFinalBookingStatus(booking)
export const canCheckInBooking = (booking) => hasAssignedTables(booking) && !isCheckedInBooking(booking) && !isFinalBookingStatus(booking)
export const canCompleteBooking = (booking) => booking?.status === 'DA_CHECK_IN' || booking?.status === 'DA_XEP_BAN'
export const canMarkBookingNoShow = (booking) => !isCheckedInBooking(booking) && !isFinalBookingStatus(booking)

export const parseBookingDateTime = (date, time) => {
  if (!date) return null

  const normalizedTime = time && /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time || '00:00:00'
  const parsed = new Date(`${date}T${normalizedTime}`)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const isSameCalendarDay = (left, right) => (
  left.getFullYear() === right.getFullYear()
  && left.getMonth() === right.getMonth()
  && left.getDate() === right.getDate()
)

export const matchesDayFilter = (booking, dayFilter, now) => {
  if (dayFilter === 'all') return true

  const bookingDate = parseBookingDateTime(booking.date, booking.time)
  if (!bookingDate) return false

  if (dayFilter === 'today') {
    return isSameCalendarDay(bookingDate, now)
  }

  if (dayFilter === 'tomorrow') {
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    return isSameCalendarDay(bookingDate, tomorrow)
  }

  return true
}

export const matchesShiftFilter = (booking, shiftFilter) => {
  if (shiftFilter === 'all') return true

  const [hour] = String(booking.time || '').split(':')
  const numericHour = Number(hour)

  if (Number.isNaN(numericHour)) return false
  if (shiftFilter === 'lunch') return numericHour < 16
  if (shiftFilter === 'dinner') return numericHour >= 16

  return true
}

export const matchesBookingSearch = (booking, searchQuery) => {
  const normalizedQuery = String(searchQuery || '').trim().toLowerCase()
  if (!normalizedQuery) return true

  return [
    booking.bookingCode,
    booking.name,
    booking.phone,
    booking.email,
  ].some((value) => String(value || '').toLowerCase().includes(normalizedQuery))
}

export const getOrdersSummary = (orders) => ({
  total: orders.length,
  pending: orders.filter((order) => {
    const text = String(order?.status || '').toLowerCase()
    return text.includes('mới') || text.includes('đang') || text.includes('chờ')
  }).length,
  revenue: orders.reduce((sum, order) => sum + (Number(order?.total) || 0), 0),
})

export const getTableSummary = (tables) => {
  const counts = tables.reduce((accumulator, table) => {
    const area = table.areaId || 'KHONG_UU_TIEN'

    if (!accumulator[area]) {
      accumulator[area] = {
        occupied: 0,
        dirty: 0,
        held: 0,
      }
    }

    if (table.status === TABLE_STATUSES.OCCUPIED) {
      accumulator[area].occupied += 1
    }

    if (table.status === TABLE_STATUSES.HELD) {
      accumulator[area].held += 1
    }

    if (table.status === TABLE_STATUSES.DIRTY) {
      accumulator[area].dirty += 1
    }

    return accumulator
  }, {})

  return TABLE_AREAS.map((area) => {
    const areaCounts = counts[area.id] || { occupied: 0, dirty: 0, held: 0 }
    const unavailable = areaCounts.occupied + areaCounts.held + areaCounts.dirty
    const available = Math.max(area.total - unavailable, 0)
    const occupancyRate = area.total > 0 ? unavailable / area.total : 0

    return {
      ...area,
      occupied: areaCounts.occupied,
      held: areaCounts.held,
      dirty: areaCounts.dirty,
      available,
      occupancyRate,
    }
  })
}

export const getTableInventorySummary = (tables) => ({
  total: tables.length,
  available: tables.filter((table) => table.status === TABLE_STATUSES.AVAILABLE).length,
  held: tables.filter((table) => table.status === TABLE_STATUSES.HELD).length,
  occupied: tables.filter((table) => table.status === TABLE_STATUSES.OCCUPIED).length,
  dirty: tables.filter((table) => table.status === TABLE_STATUSES.DIRTY).length,
})

export const getAccountsSummary = (accounts) => ({
  total: accounts.length,
  admins: accounts.filter((account) => account.role === 'admin').length,
  staffs: accounts.filter((account) => account.role === 'staff').length,
  customers: accounts.filter((account) => account.role === 'customer').length,
})

export const getOverviewScopeLabel = (dayFilter, shiftFilter) => {
  const dayLabel = DAY_FILTERS.find((item) => item.key === dayFilter)?.label || 'Toàn bộ ngày'
  const shiftLabel = SHIFT_FILTERS.find((item) => item.key === shiftFilter)?.label || 'Mọi ca'
  return `${dayLabel} · ${shiftLabel}`
}

export const isCompletedBooking = (booking) => booking.status === 'DA_HOAN_THANH'
export const isUpcomingSoonBooking = (booking, now) => {
  const bookingTime = parseBookingDateTime(booking.date, booking.time)
  if (!bookingTime) return false

  const diff = bookingTime.getTime() - now.getTime()
  return diff >= 0 && diff <= 2 * 60 * 60 * 1000
}

export const getUnassignedBookings = (bookings) => bookings.filter((booking) => {
  if (!ACTIVE_BOOKING_STATUSES.has(booking.status)) {
    return false
  }

  return !Array.isArray(booking.assignedTableIds) || booking.assignedTableIds.length === 0
})

export const getBookingPriorityRank = (booking, now) => {
  const bookingTime = parseBookingDateTime(booking.date, booking.time)
  const diff = bookingTime ? bookingTime.getTime() - now.getTime() : Number.POSITIVE_INFINITY
  const hasAssignedTables = Array.isArray(booking.assignedTableIds) && booking.assignedTableIds.length > 0

  if (needsManualConfirmation(booking)) return 0
  if (!hasAssignedTables && CONFIRMED_BOOKING_STATUSES.has(booking.status)) return 1
  if (diff >= 0 && diff <= 2 * 60 * 60 * 1000) return 2
  if (isCheckedInBooking(booking)) return 3
  if (CONFIRMED_BOOKING_STATUSES.has(booking.status)) return 4
  return 5
}

export const sortBookingsForOperations = (bookings, now) => [...bookings].sort((left, right) => {
  const leftRank = getBookingPriorityRank(left, now)
  const rightRank = getBookingPriorityRank(right, now)

  if (leftRank !== rightRank) {
    return leftRank - rightRank
  }

  const leftTime = parseBookingDateTime(left.date, left.time)?.getTime() || Number.POSITIVE_INFINITY
  const rightTime = parseBookingDateTime(right.date, right.time)?.getTime() || Number.POSITIVE_INFINITY

  if (leftTime !== rightTime) {
    return leftTime - rightTime
  }

  return (Number(right.id) || 0) - (Number(left.id) || 0)
})

export const sortOrdersForOperations = (orders) => [...orders].sort((left, right) => {
  const leftTone = getOrderStatusTone(left.status)
  const rightTone = getOrderStatusTone(right.status)
  const toneRank = { warning: 0, neutral: 1, success: 2, danger: 3 }

  if (toneRank[leftTone] !== toneRank[rightTone]) {
    return toneRank[leftTone] - toneRank[rightTone]
  }

  return (Number(right.id) || 0) - (Number(left.id) || 0)
})
