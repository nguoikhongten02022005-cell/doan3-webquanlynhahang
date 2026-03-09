import { STORAGE_KEYS } from '../../constants/storageKeys'
import { getStorageJSON } from '../../services/storageService'
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
  if (booking.seatingArea === 'BAN_CONG') return 'Kiểm tra thời tiết trước khi chốt vị trí ban công.'
  return ''
}

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

export const readOrders = () => {
  const rawOrders = getStorageJSON(STORAGE_KEYS.ORDERS, [])
  return Array.isArray(rawOrders) ? rawOrders : []
}

export const getOrdersSummary = (orders) => ({
  total: orders.length,
  pending: orders.filter((order) => {
    const text = String(order?.status || '').toLowerCase()
    return text.includes('mới') || text.includes('đang') || text.includes('chờ')
  }).length,
  revenue: orders.reduce((sum, order) => sum + (Number(order?.total) || 0), 0),
})

export const getTableSummary = (bookings) => {
  const counts = bookings
    .filter((booking) => ACTIVE_BOOKING_STATUSES.has(booking.status))
    .reduce((accumulator, booking) => {
      const area = booking.seatingArea || 'KHONG_UU_TIEN'
      accumulator[area] = (accumulator[area] || 0) + 1
      return accumulator
    }, {})

  return TABLE_AREAS.map((area) => {
    const occupied = counts[area.id] || 0
    const available = Math.max(area.total - occupied, 0)
    const occupancyRate = area.total > 0 ? occupied / area.total : 0

    return {
      ...area,
      occupied,
      available,
      occupancyRate,
    }
  })
}

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

export const getBookingPriorityRank = (booking, now) => {
  const bookingTime = parseBookingDateTime(booking.date, booking.time)
  const diff = bookingTime ? bookingTime.getTime() - now.getTime() : Number.POSITIVE_INFINITY

  if (needsManualConfirmation(booking)) return 0
  if (diff >= 0 && diff <= 2 * 60 * 60 * 1000) return 1
  if (CONFIRMED_BOOKING_STATUSES.has(booking.status)) return 2
  return 3
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
