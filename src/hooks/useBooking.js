import { useCallback } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { HOST_BOOKING_STATUS_ACTIONS } from '../data/bookingData'
import { generateBookingCode } from '../utils/booking/submission'
import { shouldUseBackend } from '../services/apiClient'
import {
  assignBookingTablesApi,
  cancelBookingApi,
  createBookingApi,
  getBookingHistoryApi,
  getBookingsApi,
  updateBookingApi,
  updateBookingStatusApi,
} from '../services/api/bookingApi'
import { getTables, TABLE_STATUSES } from '../services/tableService'
import { getStorageJSON, removeStorageItem, setStorageJSON } from '../services/storageService'
import {
  canCancelBooking,
  canEditInternalBooking,
  canManuallyTransitionBooking,
  INTERNAL_BOOKING_CREATE_STATUSES,
  validateAssignedTables,
} from './booking/bookingPolicies'
import {
  getMetadataPatchForInternalBooking,
  hydrateBookingsWithTables,
  mapBookingItem,
  normalizeBooking,
} from './booking/bookingMappers'
import {
  BOOKING_DATA_CHANGED_EVENT,
  dispatchBookingDataChanged,
  loadBookingHistory,
  normalizeBookings,
  readAllBookings,
  readBookings,
  syncBookingsToQueue,
} from './booking/bookingRepository'
import {
  assignTablesForBooking,
  canCheckInBooking,
  canCompleteBooking,
  canMarkBookingNoShow,
  getNextBookingId,
  updateBookingStatus,
  updateTablesForBooking,
} from './booking/bookingWorkflow'

export { BOOKING_DATA_CHANGED_EVENT }

export const useBooking = () => {
  const useBackend = shouldUseBackend()

  const saveDraft = useCallback((draftPayload) => {
    setStorageJSON(STORAGE_KEYS.BOOKING_DRAFT, draftPayload)
  }, [])

  const getDraft = useCallback(() => getStorageJSON(STORAGE_KEYS.BOOKING_DRAFT, null), [])

  const clearDraft = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)
  }, [])

  const createBooking = useCallback(async ({ booking, confirmationPayload, receptionQueueItem }) => {
    if (useBackend) {
      const createdBooking = normalizeBooking(await createBookingApi(booking))

      setStorageJSON(STORAGE_KEYS.LAST_BOOKING_CONFIRMATION, {
        ...confirmationPayload,
        bookingCode: createdBooking?.bookingCode || confirmationPayload?.bookingCode,
        bookingId: createdBooking?.id || confirmationPayload?.bookingId,
        status: createdBooking?.status || confirmationPayload?.status,
      })
      removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)
      dispatchBookingDataChanged()
      return createdBooking
    }

    const storedBookings = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])
    const bookings = Array.isArray(storedBookings) ? storedBookings : []
    const nextBookings = [...bookings, normalizeBooking(booking)].filter(Boolean)

    setStorageJSON(STORAGE_KEYS.LAST_BOOKING_CONFIRMATION, confirmationPayload)
    removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)

    const receptionQueue = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
    const safeReceptionQueue = Array.isArray(receptionQueue) ? receptionQueue : []
    setStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [...safeReceptionQueue, receptionQueueItem])
    syncBookingsToQueue(nextBookings, getTables())
    return normalizeBooking(booking)
  }, [useBackend])

  const createInternalBooking = useCallback(async (payload, actor) => {
    if (useBackend) {
      try {
        const initialStatus = INTERNAL_BOOKING_CREATE_STATUSES.has(payload.status) ? payload.status : 'DA_XAC_NHAN'
        const booking = normalizeBooking(await createBookingApi({
          ...payload,
          status: initialStatus,
          source: 'internal',
          confirmationChannel: ['Nội bộ'],
          createdBy: actor?.email || actor?.username || 'internal',
          userEmail: payload.email || null,
        }))

        dispatchBookingDataChanged()
        return {
          success: true,
          booking,
        }
      } catch (error) {
        return { success: false, error: error?.message || 'Không thể tạo booking nội bộ.' }
      }
    }

    const currentBookings = normalizeBookings(readBookings())
    const nextId = getNextBookingId(currentBookings)
    const timestamp = new Date().toISOString()
    const initialStatus = INTERNAL_BOOKING_CREATE_STATUSES.has(payload.status) ? payload.status : 'DA_XAC_NHAN'
    const booking = normalizeBooking({
      id: nextId,
      bookingCode: generateBookingCode(),
      guests: payload.guests,
      date: payload.date,
      time: payload.time,
      seatingArea: payload.seatingArea,
      notes: payload.notes,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      status: initialStatus,
      source: 'internal',
      createdAt: timestamp,
      updatedAt: timestamp,
      userEmail: payload.email || null,
      occasion: payload.occasion,
      confirmationChannel: ['Nội bộ'],
      internalNote: payload.internalNote,
      assignedTableIds: [],
      createdBy: actor?.email || actor?.username || 'internal',
    })

    if (!booking) {
      return { success: false, error: 'Dữ liệu booking nội bộ không hợp lệ.' }
    }

    return {
      success: true,
      booking,
      bookings: syncBookingsToQueue([...currentBookings, booking], getTables()),
    }
  }, [useBackend])

  const updateInternalBooking = useCallback(async (bookingId, payload) => {
    if (useBackend) {
      try {
        const updatedBooking = normalizeBooking(await updateBookingApi(bookingId, getMetadataPatchForInternalBooking(payload)))
        dispatchBookingDataChanged()
        return {
          success: true,
          booking: updatedBooking,
        }
      } catch (error) {
        return { success: false, error: error?.message || 'Không thể cập nhật booking.' }
      }
    }

    const currentBookings = normalizeBookings(readBookings())
    const matchedBooking = currentBookings.find((booking) => String(booking.id) === String(bookingId))

    if (!matchedBooking) {
      return { success: false, error: 'Không tìm thấy booking cần cập nhật.' }
    }

    if (!canEditInternalBooking(matchedBooking)) {
      return { success: false, error: 'Booking đang phục vụ hoặc đã kết thúc nên không thể sửa bằng form này.' }
    }

    const updatedBooking = normalizeBooking({
      ...matchedBooking,
      ...getMetadataPatchForInternalBooking(payload),
      id: matchedBooking.id,
      status: matchedBooking.status,
      assignedTableIds: matchedBooking.assignedTableIds,
      updatedAt: new Date().toISOString(),
    })

    if (!updatedBooking) {
      return { success: false, error: 'Dữ liệu booking sau khi cập nhật không hợp lệ.' }
    }

    const currentTables = getTables()
    if (updatedBooking.assignedTableIds.length > 0) {
      const assignedTablesValidation = validateAssignedTables({
        assignedTableIds: updatedBooking.assignedTableIds,
        tables: currentTables,
        guestCount: Number(updatedBooking.guests) || 0,
        preferredArea: updatedBooking.seatingArea,
        bookingId: updatedBooking.id,
      })

      if (!assignedTablesValidation.success) {
        return { success: false, error: 'Thông tin mới không còn khớp với các bàn đang gán. Hãy cập nhật gán bàn trước khi lưu.' }
      }
    }

    const nextBookings = currentBookings.map((booking) => (
      String(booking.id) === String(bookingId)
        ? updatedBooking
        : booking
    ))

    const nextTables = updateTablesForBooking({
      booking: updatedBooking,
      tables: currentTables,
      nextStatus: updatedBooking.status,
      assignedTableIds: updatedBooking.assignedTableIds,
    })

    return {
      success: true,
      booking: updatedBooking,
      bookings: syncBookingsToQueue(nextBookings, nextTables),
    }
  }, [useBackend])

  const assignBookingTables = useCallback(async (bookingId, tableIds) => {
    if (useBackend) {
      try {
        const booking = normalizeBooking(await assignBookingTablesApi(bookingId, tableIds))
        dispatchBookingDataChanged()
        return {
          success: true,
          booking,
        }
      } catch (error) {
        return { success: false, error: error?.message || 'Không thể gán bàn cho booking này.' }
      }
    }

    const result = assignTablesForBooking({ bookings: normalizeBookings(readBookings()), bookingId, tableIds })

    if (!result.success) {
      return result
    }

    return {
      success: true,
      bookings: result.bookings,
    }
  }, [useBackend])

  const setBookingCheckedIn = useCallback(async (bookingId) => {
    if (useBackend) {
      try {
        const booking = normalizeBooking(await updateBookingStatusApi(bookingId, 'DA_CHECK_IN'))
        dispatchBookingDataChanged()
        return {
          success: true,
          booking,
        }
      } catch (error) {
        return { success: false, error: error?.message || 'Không thể check-in booking.' }
      }
    }

    const currentBookings = normalizeBookings(readBookings())
    const matchedBooking = currentBookings.find((booking) => String(booking.id) === String(bookingId))
    const validation = canCheckInBooking(matchedBooking)

    if (!validation.success) {
      return validation
    }

    return {
      success: true,
      bookings: updateBookingStatus(currentBookings, bookingId, 'DA_CHECK_IN'),
    }
  }, [useBackend])

  const setBookingCompleted = useCallback(async (bookingId) => {
    if (useBackend) {
      try {
        const booking = normalizeBooking(await updateBookingStatusApi(bookingId, 'DA_HOAN_THANH'))
        dispatchBookingDataChanged()
        return {
          success: true,
          booking,
        }
      } catch (error) {
        return { success: false, error: error?.message || 'Không thể hoàn thành booking.' }
      }
    }

    const currentBookings = normalizeBookings(readBookings())
    const matchedBooking = currentBookings.find((booking) => String(booking.id) === String(bookingId))
    const validation = canCompleteBooking(matchedBooking)

    if (!validation.success) {
      return validation
    }

    return {
      success: true,
      bookings: updateBookingStatus(currentBookings, bookingId, 'DA_HOAN_THANH'),
    }
  }, [useBackend])

  const setBookingNoShow = useCallback(async (bookingId) => {
    if (useBackend) {
      try {
        const booking = normalizeBooking(await updateBookingStatusApi(bookingId, 'KHONG_DEN'))
        dispatchBookingDataChanged()
        return {
          success: true,
          booking,
        }
      } catch (error) {
        return { success: false, error: error?.message || 'Không thể đánh dấu không đến.' }
      }
    }

    const currentBookings = normalizeBookings(readBookings())
    const matchedBooking = currentBookings.find((booking) => String(booking.id) === String(bookingId))
    const validation = canMarkBookingNoShow(matchedBooking)

    if (!validation.success) {
      return validation
    }

    return {
      success: true,
      bookings: updateBookingStatus(currentBookings, bookingId, 'KHONG_DEN'),
    }
  }, [useBackend])

  const releaseBookingTables = useCallback(() => ({
    success: false,
    error: 'Không hỗ trợ trả bàn độc lập. Hãy hoàn thành, đánh dấu không đến hoặc hủy booking để đồng bộ trạng thái bàn.',
  }), [])

  const getBookingHistory = useCallback(async (userEmail) => {
    if (useBackend) {
      return getBookingHistoryApi(userEmail)
    }

    return loadBookingHistory(userEmail)
  }, [useBackend])

  const cancelBooking = useCallback(async (bookingId, bookingCode, userEmail) => {
    if (useBackend) {
      try {
        await cancelBookingApi(bookingId)
        const bookingHistory = await getBookingHistoryApi(userEmail)
        dispatchBookingDataChanged()
        return {
          success: true,
          message: `Đã hủy đặt bàn ${bookingCode} thành công.`,
          bookingHistory,
        }
      } catch (error) {
        return { success: false, error: error?.message || 'Không thể hủy đặt bàn này. Vui lòng thử lại.' }
      }
    }

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

    const nextBookings = updateBookingStatus(normalizeBookings(parsedBookings), bookingId, 'DA_HUY')

    return {
      success: true,
      message: `Đã hủy đặt bàn ${bookingCode} thành công.`,
      bookingHistory: nextBookings
        .filter((booking) => String(booking.userEmail ?? booking.email ?? '').trim().toLowerCase() === String(userEmail ?? '').trim().toLowerCase())
        .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
        .map(mapBookingItem),
    }
  }, [useBackend])

  const getHostBookings = useCallback(async () => {
    if (useBackend) {
      return getBookingsApi()
    }

    return readAllBookings()
  }, [useBackend])

  const getHostStats = useCallback((bookings) => {
    const total = bookings.length
    const pending = bookings.filter((item) => item.status === 'YEU_CAU_DAT_BAN' || item.status === 'CAN_GOI_LAI' || item.status === 'CHO_XAC_NHAN').length
    const confirmed = bookings.filter((item) => item.status === 'DA_XAC_NHAN' || item.status === 'DA_GHI_NHAN' || item.status === 'GIU_CHO_TAM').length
    const vip = bookings.filter((item) => item.seatingArea === 'PHONG_VIP').length

    return { total, pending, confirmed, vip }
  }, [])

  const sortHostBookings = useCallback((bookings) => [...bookings].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)), [])

  const updateHostBookingStatus = useCallback((bookings, bookingId, nextStatus) => {
    const matchedBooking = bookings.find((booking) => String(booking.id) === String(bookingId))

    if (!matchedBooking || !canManuallyTransitionBooking(matchedBooking, nextStatus)) {
      return hydrateBookingsWithTables(normalizeBookings(bookings), getTables())
    }

    return updateBookingStatus(bookings, bookingId, nextStatus)
  }, [])

  const getAvailableTablesForBooking = useCallback((booking, tablesOverride = null) => {
    const tables = Array.isArray(tablesOverride) ? tablesOverride : getTables()
    const guestCount = Number(booking?.guests) || 0

    return tables.filter((table) => {
      if (table.status === TABLE_STATUSES.DIRTY) {
        return false
      }

      if (table.activeBookingId && String(table.activeBookingId) !== String(booking?.id)) {
        return false
      }

      if (booking?.seatingArea && booking.seatingArea !== 'KHONG_UU_TIEN' && table.areaId !== booking.seatingArea) {
        return false
      }

      return table.capacity >= guestCount || guestCount <= 0
    })
  }, [])

  return {
    bookingStatusActions: HOST_BOOKING_STATUS_ACTIONS,
    getDraft,
    saveDraft,
    clearDraft,
    createBooking,
    createInternalBooking,
    updateInternalBooking,
    assignBookingTables,
    setBookingCheckedIn,
    setBookingCompleted,
    setBookingNoShow,
    releaseBookingTables,
    getAvailableTablesForBooking,
    getBookingHistory,
    cancelBooking,
    getHostBookings,
    getHostStats,
    sortHostBookings,
    updateHostBookingStatus,
  }
}
