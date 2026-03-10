import { STORAGE_KEYS } from '../../constants/storageKeys.js'
import { getTables, saveTables } from '../../services/tableService.js'
import { getStorageJSON, setStorageJSON } from '../../services/storageService.js'
import { hydrateBookingsWithTables, mapBookingItem, normalizeBooking } from './bookingMappers.js'

export const BOOKING_DATA_CHANGED_EVENT = 'booking:data-changed'

export const dispatchBookingDataChanged = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(BOOKING_DATA_CHANGED_EVENT))
}

export const readBookings = () => {
  const parsedBookings = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])

  if (!Array.isArray(parsedBookings)) {
    return []
  }

  return parsedBookings
}

export const readQueueStatuses = () => {
  const parsed = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
  if (!Array.isArray(parsed)) return new Map()

  try {
    return new Map(parsed.map((item) => [item.bookingCode, item.status]))
  } catch {
    return new Map()
  }
}

export const normalizeBookings = (bookings, queueStatusMap = readQueueStatuses()) => bookings
  .map(normalizeBooking)
  .filter(Boolean)
  .map((booking) => {
    const queueStatus = queueStatusMap.get(booking.bookingCode)
    return queueStatus && queueStatus !== booking.status
      ? { ...booking, status: queueStatus }
      : booking
  })

export const readAllBookings = () => {
  const parsed = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])
  if (!Array.isArray(parsed)) return []

  try {
    const bookings = normalizeBookings(parsed)
    return hydrateBookingsWithTables(bookings, getTables())
  } catch {
    return []
  }
}

export const loadBookingHistory = (userEmail) => {
  const parsedBookings = readAllBookings()
  const normalizedUserEmail = String(userEmail ?? '').trim().toLowerCase()

  return [...parsedBookings]
    .filter((booking) => {
      if (!normalizedUserEmail) {
        return false
      }

      return String(booking.userEmail ?? booking.email ?? '').trim().toLowerCase() === normalizedUserEmail
    })
    .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    .map(mapBookingItem)
}

export const syncBookingsToQueue = (bookings, tables = getTables()) => {
  const normalizedBookings = normalizeBookings(bookings)
  saveTables(tables)
  setStorageJSON(STORAGE_KEYS.BOOKINGS, normalizedBookings)

  const queue = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
  if (Array.isArray(queue)) {
    try {
      const nextQueue = queue.map((item) => {
        const matchedBooking = normalizedBookings.find((booking) => item.bookingCode === booking.bookingCode)
        return matchedBooking
          ? {
              ...item,
              status: matchedBooking.status,
              assignedTableIds: matchedBooking.assignedTableIds,
            }
          : item
      })

      setStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, nextQueue)
    } catch {
      // noop
    }
  }

  dispatchBookingDataChanged()
  return hydrateBookingsWithTables(normalizedBookings, tables)
}
