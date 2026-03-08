import { useCallback } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import {
  BOOKING_SEATING_LABELS,
  HOST_BOOKING_STATUS_ACTIONS,
} from '../data/bookingData'
import { getStorageJSON, removeStorageItem, setStorageJSON } from '../services/storageService'

export const BOOKING_DATA_CHANGED_EVENT = 'booking:data-changed'

const dispatchBookingDataChanged = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(BOOKING_DATA_CHANGED_EVENT))
}

const formatDate = (value) => {
  if (!value) return '--'

  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return '--'

  return `${day}/${month}/${year}`
}

const formatBookingId = (bookingId) => `DB-${String(bookingId).slice(-6)}`
const formatBookingDateTime = (booking) => `${formatDate(booking.date)} ${booking.time || ''}`.trim()

const mapBookingStatus = (status) => {
  if (!status) return '🟡 Yêu cầu đặt bàn'
  if (status === 'CHO_XAC_NHAN' || status === 'YEU_CAU_DAT_BAN') return '🟡 Yêu cầu đặt bàn'
  if (status === 'GIU_CHO_TAM') return '🟠 Đã giữ chỗ tạm'
  if (status === 'DA_XAC_NHAN') return '🟢 Đã xác nhận'
  if (status === 'CAN_GOI_LAI') return '📞 Cần gọi lại'
  if (status === 'TU_CHOI_HET_CHO' || status === 'DA_HUY') return '🔴 Từ chối / hết chỗ'
  if (status === 'DA_HOAN_THANH') return '⚪ Đã hoàn thành'
  return status
}

const canCancelBooking = (status) => (
  status === 'CHO_XAC_NHAN'
  || status === 'YEU_CAU_DAT_BAN'
  || status === 'GIU_CHO_TAM'
  || status === 'CAN_GOI_LAI'
)

const readBookings = () => {
  const parsedBookings = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])

  if (!Array.isArray(parsedBookings)) {
    return []
  }

  return parsedBookings
}

const mapBookingItem = (booking) => ({
  bookingId: booking.id,
  id: formatBookingId(booking.id),
  dateTime: formatBookingDateTime(booking),
  guests: Number(booking.guests) || 0,
  seatingArea: BOOKING_SEATING_LABELS[booking.seatingArea] || '',
  rawStatus: booking.status || 'CHO_XAC_NHAN',
  status: mapBookingStatus(booking.status),
})

const loadBookingHistory = (userEmail) => {
  const parsedBookings = readBookings()
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

const readQueueStatuses = () => {
  const parsed = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
  if (!Array.isArray(parsed)) return new Map()

  try {
    return new Map(parsed.map((item) => [item.bookingCode, item.status]))
  } catch {
    return new Map()
  }
}

const normalizeBookings = (bookings) => {
  const queueStatusMap = readQueueStatuses()

  return bookings.map((booking) => {
    const queueStatus = queueStatusMap.get(booking.bookingCode)
    return queueStatus && queueStatus !== booking.status
      ? { ...booking, status: queueStatus }
      : booking
  })
}

const readAllBookings = () => {
  const parsed = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])
  if (!Array.isArray(parsed)) return []

  try {
    return normalizeBookings(parsed)
  } catch {
    return []
  }
}

const syncBookingsToQueue = (bookings) => {
  setStorageJSON(STORAGE_KEYS.BOOKINGS, bookings)

  const queue = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
  if (Array.isArray(queue)) {
    try {
      const nextQueue = queue.map((item) => {
        const matchedBooking = bookings.find((booking) => item.bookingCode === booking.bookingCode)
        return matchedBooking ? { ...item, status: matchedBooking.status } : item
      })

      setStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, nextQueue)
    } catch {
      // noop
    }
  }

  dispatchBookingDataChanged()
}

const updateBookingStatus = (bookings, bookingId, nextStatus) => {
  const nextBookings = bookings.map((booking) => (
    String(booking.id) === String(bookingId)
      ? { ...booking, status: nextStatus }
      : booking
  ))

  syncBookingsToQueue(nextBookings)
  return normalizeBookings(nextBookings)
}

export const useBooking = () => {
  const saveDraft = useCallback((draftPayload) => {
    setStorageJSON(STORAGE_KEYS.BOOKING_DRAFT, draftPayload)
  }, [])

  const getDraft = useCallback(() => getStorageJSON(STORAGE_KEYS.BOOKING_DRAFT, null), [])

  const clearDraft = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)
  }, [])

  const createBooking = useCallback(({ booking, confirmationPayload, receptionQueueItem }) => {
    const storedBookings = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])
    const bookings = Array.isArray(storedBookings) ? storedBookings : []
    const nextBookings = [...bookings, booking]

    setStorageJSON(STORAGE_KEYS.LAST_BOOKING_CONFIRMATION, confirmationPayload)
    removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)

    const receptionQueue = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
    const safeReceptionQueue = Array.isArray(receptionQueue) ? receptionQueue : []
    setStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [...safeReceptionQueue, receptionQueueItem])
    syncBookingsToQueue(nextBookings)
  }, [])

  const getBookingHistory = useCallback((userEmail) => loadBookingHistory(userEmail), [])

  const cancelBooking = useCallback((bookingId, bookingCode, userEmail) => {
    const parsedBookings = getStorageJSON(STORAGE_KEYS.BOOKINGS, null)

    if (!Array.isArray(parsedBookings)) {
      return { success: false, error: 'Không thể hủy đặt bàn này. Vui lòng thử lại.' }
    }

    const bookingIndex = parsedBookings.findIndex((item) => String(item.id) === String(bookingId))

    if (bookingIndex === -1) {
      return { success: false, error: 'Không thể hủy đặt bàn này. Vui lòng thử lại.' }
    }

    if (!canCancelBooking(parsedBookings[bookingIndex].status)) {
      return { success: false, error: 'Đặt bàn đã xác nhận. Vui lòng gọi hotline để được hỗ trợ hủy.' }
    }

    const nextBookings = parsedBookings.map((booking) => (
      String(booking.id) === String(bookingId)
        ? { ...booking, status: 'DA_HUY' }
        : booking
    ))

    syncBookingsToQueue(nextBookings)

    return {
      success: true,
      message: `Đã hủy đặt bàn ${bookingCode} thành công.`,
      bookingHistory: loadBookingHistory(userEmail),
    }
  }, [])

  const getHostBookings = useCallback(() => readAllBookings(), [])

  const getHostStats = useCallback((bookings) => {
    const total = bookings.length
    const pending = bookings.filter((item) => item.status === 'YEU_CAU_DAT_BAN' || item.status === 'CAN_GOI_LAI' || item.status === 'CHO_XAC_NHAN').length
    const confirmed = bookings.filter((item) => item.status === 'DA_XAC_NHAN' || item.status === 'DA_GHI_NHAN' || item.status === 'GIU_CHO_TAM').length
    const vip = bookings.filter((item) => item.seatingArea === 'PHONG_VIP').length

    return { total, pending, confirmed, vip }
  }, [])

  const sortHostBookings = useCallback((bookings) => [...bookings].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)), [])

  const updateHostBookingStatus = useCallback((bookings, bookingId, nextStatus) => updateBookingStatus(bookings, bookingId, nextStatus), [])

  return {
    bookingStatusActions: HOST_BOOKING_STATUS_ACTIONS,
    getDraft,
    saveDraft,
    clearDraft,
    createBooking,
    getBookingHistory,
    cancelBooking,
    getHostBookings,
    getHostStats,
    sortHostBookings,
    updateHostBookingStatus,
  }
}
