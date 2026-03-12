import { getTables, TABLE_STATUSES } from '../../services/tableService.js'
import {
  ACTIVE_BOOKING_STATUSES,
  isCheckedInStatus,
  isCompletedStatus,
  validateAssignedTables,
} from './bookingPolicies.js'
import { hydrateBookingsWithTables, normalizeAssignedTableIds } from './bookingMappers.js'
import { normalizeBookings, syncBookingsToQueue } from './bookingRepository.js'

export const updateTablesForBooking = ({ booking, tables, nextStatus, assignedTableIds = booking.assignedTableIds ?? [] }) => {
  const normalizedAssignedTableIds = normalizeAssignedTableIds(assignedTableIds)
  const occupiedTimestamp = booking.checkedInAt || new Date().toISOString()

  return tables.map((table) => {
    if (!normalizedAssignedTableIds.includes(table.id)) {
      return table.activeBookingId === booking.id && !ACTIVE_BOOKING_STATUSES.has(nextStatus)
        ? {
            ...table,
            status: TABLE_STATUSES.AVAILABLE,
            activeBookingId: null,
            activeBookingCode: '',
            occupiedAt: '',
            releasedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : table
    }

    if (!ACTIVE_BOOKING_STATUSES.has(nextStatus)) {
      return {
        ...table,
        status: TABLE_STATUSES.AVAILABLE,
        activeBookingId: null,
        activeBookingCode: '',
        occupiedAt: '',
        releasedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    return {
      ...table,
      status: nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN'
        ? TABLE_STATUSES.OCCUPIED
        : TABLE_STATUSES.HELD,
      activeBookingId: booking.id,
      activeBookingCode: booking.bookingCode,
      occupiedAt: nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN' ? occupiedTimestamp : table.occupiedAt,
      releasedAt: '',
      updatedAt: new Date().toISOString(),
    }
  })
}

export const buildBookingStatusPatch = (booking, nextStatus) => {
  const timestamp = new Date().toISOString()

  return {
    ...booking,
    status: nextStatus,
    updatedAt: timestamp,
    checkedInAt: nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN' ? booking.checkedInAt || timestamp : booking.checkedInAt,
    seatedAt: nextStatus === 'DA_XEP_BAN' ? timestamp : booking.seatedAt,
    completedAt: nextStatus === 'DA_HOAN_THANH' ? timestamp : booking.completedAt,
    cancelledAt: nextStatus === 'DA_HUY' || nextStatus === 'TU_CHOI_HET_CHO' ? timestamp : booking.cancelledAt,
    noShowAt: nextStatus === 'KHONG_DEN' ? timestamp : booking.noShowAt,
  }
}

export const updateBookingStatus = (bookings, bookingId, nextStatus) => {
  const tables = getTables()
  let updatedBooking = null

  const nextBookings = bookings.map((booking) => {
    if (String(booking.id) !== String(bookingId)) {
      return booking
    }

    updatedBooking = buildBookingStatusPatch(booking, nextStatus)
    return updatedBooking
  })

  if (!updatedBooking) {
    return hydrateBookingsWithTables(normalizeBookings(bookings), tables)
  }

  const nextTables = updateTablesForBooking({
    booking: updatedBooking,
    tables,
    nextStatus,
    assignedTableIds: updatedBooking.assignedTableIds,
  })

  return syncBookingsToQueue(nextBookings, nextTables)
}

export const getNextBookingId = (bookings) => bookings.reduce((maxId, booking) => Math.max(maxId, Number(booking.id) || 0), 0) + 1

export const assignTablesForBooking = ({ bookings, bookingId, tableIds }) => {
  const tables = getTables()
  const normalizedTableIds = normalizeAssignedTableIds(tableIds)
  const booking = bookings.find((item) => String(item.id) === String(bookingId))

  if (!booking) {
    return { success: false, error: 'Không tìm thấy booking cần gán bàn.' }
  }

  const validation = validateAssignedTables({
    assignedTableIds: normalizedTableIds,
    tables,
    guestCount: Number(booking.guests) || 0,
    preferredArea: booking.seatingArea,
    bookingId: booking.id,
  })

  if (!validation.success) {
    return validation
  }

  const timestamp = new Date().toISOString()
  const nextBookings = bookings.map((item) => (
    String(item.id) === String(bookingId)
      ? {
          ...item,
          assignedTableIds: normalizedTableIds,
          updatedAt: timestamp,
          status: item.status === 'YEU_CAU_DAT_BAN' || item.status === 'CHO_XAC_NHAN'
            ? 'GIU_CHO_TAM'
            : item.status,
        }
      : item
  ))

  const updatedBooking = nextBookings.find((item) => String(item.id) === String(bookingId))
  const releasedTables = tables.map((table) => (
    table.activeBookingId === booking.id && !normalizedTableIds.includes(table.id)
      ? {
          ...table,
          status: TABLE_STATUSES.AVAILABLE,
          activeBookingId: null,
          activeBookingCode: '',
          occupiedAt: '',
          releasedAt: timestamp,
          updatedAt: timestamp,
        }
      : table
  ))

  const nextTables = updateTablesForBooking({
    booking: updatedBooking,
    tables: releasedTables,
    nextStatus: updatedBooking.status,
    assignedTableIds: normalizedTableIds,
  })

  return {
    success: true,
    bookings: syncBookingsToQueue(nextBookings, nextTables),
  }
}

export const canCheckInBooking = (booking) => {
  if (!booking) {
    return { success: false, error: 'Không tìm thấy booking để check-in.' }
  }

  if (isCompletedStatus(booking.status) || isCheckedInStatus(booking.status)) {
    return { success: false, error: 'Booking này không còn hợp lệ để check-in.' }
  }

  if (normalizeAssignedTableIds(booking.assignedTableIds).length === 0) {
    return { success: false, error: 'Cần gán bàn trước khi check-in.' }
  }

  return { success: true }
}

export const canCompleteBooking = (booking) => {
  if (!booking) {
    return { success: false, error: 'Không tìm thấy booking để hoàn thành.' }
  }

  if (!isCheckedInStatus(booking.status)) {
    return { success: false, error: 'Chỉ có thể hoàn thành booking đã check-in hoặc đã vào bàn.' }
  }

  return { success: true }
}

export const canMarkBookingNoShow = (booking) => {
  if (!booking) {
    return { success: false, error: 'Không tìm thấy booking để đánh dấu không đến.' }
  }

  if (isCheckedInStatus(booking.status) || isCompletedStatus(booking.status)) {
    return { success: false, error: 'Booking này không còn hợp lệ để đánh dấu không đến.' }
  }

  return { success: true }
}
