import { useCallback } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { HOST_BOOKING_STATUS_ACTIONS } from '../data/bookingData'
import {
  cancelBookingApi,
  createBookingApi,
  createInternalBookingApi,
  getBookingHistoryApi,
  getBookingsApi,
  updateBookingApi,
  updateBookingStatusApi,
  assignBookingTablesApi,
} from '../services/api/bookingApi'
import { getStorageJSON, removeStorageItem, setStorageJSON } from '../services/storageService'
import { TABLE_STATUSES } from '../services/tableService'
import { canCancelBooking } from './booking/bookingPolicies'
import {
  mapBookingItem,
  normalizeBooking,
} from './booking/bookingMappers'

export const BOOKING_DATA_CHANGED_EVENT = 'booking:data-changed'

export const dispatchBookingDataChanged = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(BOOKING_DATA_CHANGED_EVENT))
}

export const useBooking = () => {
  const saveDraft = useCallback((draftPayload) => {
    setStorageJSON(STORAGE_KEYS.BOOKING_DRAFT, draftPayload)
  }, [])

  const getDraft = useCallback(() => getStorageJSON(STORAGE_KEYS.BOOKING_DRAFT, null), [])

  const clearDraft = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)
  }, [])

  const createBooking = useCallback(async ({ booking, confirmationPayload }) => {
    const { duLieu } = await createBookingApi(booking)
    const createdBooking = normalizeBooking(duLieu)

    setStorageJSON(STORAGE_KEYS.LAST_BOOKING_CONFIRMATION, {
      ...confirmationPayload,
      bookingCode: createdBooking?.bookingCode || confirmationPayload?.bookingCode,
      bookingId: createdBooking?.id || confirmationPayload?.bookingId,
      status: createdBooking?.status || confirmationPayload?.status,
    })
    removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)
    dispatchBookingDataChanged()
    return createdBooking
  }, [])

  const createInternalBooking = useCallback(async (payload) => {
    try {
      const { duLieu, thongDiep } = await createInternalBookingApi(payload)
      const booking = normalizeBooking(duLieu)

      if (!booking) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể tạo booking nội bộ.' }
    }
  }, [])

  const updateInternalBooking = useCallback(async (bookingId, payload) => {
    try {
      const { duLieu, thongDiep } = await updateBookingApi(bookingId, payload)
      const updatedBooking = normalizeBooking(duLieu)

      if (!updatedBooking) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking: updatedBooking,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể cập nhật booking.' }
    }
  }, [])

  const assignBookingTables = useCallback(async (bookingId, tableIds) => {
    try {
      const { duLieu, thongDiep } = await assignBookingTablesApi(bookingId, tableIds)
      const booking = normalizeBooking(duLieu)

      if (!booking) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể gán bàn cho booking này.' }
    }
  }, [])

  const setBookingCheckedIn = useCallback(async (bookingId) => {
    try {
      const { duLieu, thongDiep } = await updateBookingStatusApi(bookingId, 'DA_CHECK_IN')
      const booking = normalizeBooking(duLieu)

      if (!booking) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể check-in booking.' }
    }
  }, [])

  const setBookingCompleted = useCallback(async (bookingId) => {
    try {
      const { duLieu, thongDiep } = await updateBookingStatusApi(bookingId, 'DA_HOAN_THANH')
      const booking = normalizeBooking(duLieu)

      if (!booking) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể hoàn thành booking.' }
    }
  }, [])

  const setBookingNoShow = useCallback(async (bookingId) => {
    try {
      const { duLieu, thongDiep } = await updateBookingStatusApi(bookingId, 'KHONG_DEN')
      const booking = normalizeBooking(duLieu)

      if (!booking) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể đánh dấu không đến.' }
    }
  }, [])

  const releaseBookingTables = useCallback(() => ({
    success: false,
    error: 'Không hỗ trợ trả bàn độc lập. Hãy hoàn thành, đánh dấu không đến hoặc hủy booking để đồng bộ trạng thái bàn.',
  }), [])

  const getBookingHistory = useCallback(async () => {
    const { duLieu } = await getBookingHistoryApi()
    return Array.isArray(duLieu) ? duLieu : []
  }, [])

  const cancelBooking = useCallback(async (bookingId, bookingCode) => {
    try {
      const { thongDiep } = await cancelBookingApi(bookingId)
      const { duLieu: bookingHistory } = await getBookingHistoryApi()
      dispatchBookingDataChanged()
      return {
        success: true,
        message: thongDiep || `Đã hủy đặt bàn ${bookingCode} thành công.`,
        bookingHistory: Array.isArray(bookingHistory) ? bookingHistory : [],
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể hủy đặt bàn này. Vui lòng thử lại.' }
    }
  }, [])

  const getHostBookings = useCallback(async () => {
    const { duLieu } = await getBookingsApi()
    const bookings = Array.isArray(duLieu) ? duLieu : []
    return bookings.map(normalizeBooking).filter(Boolean)
  }, [])

  const getHostStats = useCallback((bookings) => {
    const total = bookings.length
    const pending = bookings.filter((item) => item.status === 'YEU_CAU_DAT_BAN' || item.status === 'CAN_GOI_LAI' || item.status === 'CHO_XAC_NHAN').length
    const confirmed = bookings.filter((item) => item.status === 'DA_XAC_NHAN' || item.status === 'DA_GHI_NHAN' || item.status === 'GIU_CHO_TAM').length
    const vip = bookings.filter((item) => item.seatingArea === 'PHONG_VIP').length

    return { total, pending, confirmed, vip }
  }, [])

  const sortHostBookings = useCallback((bookings) => [...bookings].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)), [])

  const updateHostBookingStatus = useCallback((bookings, bookingId, nextStatus) => bookings.map((booking) => {
    if (String(booking.id) !== String(bookingId)) {
      return booking
    }

    return {
      ...booking,
      status: nextStatus,
    }
  }), [])

  const getAvailableTablesForBooking = useCallback((booking, tablesOverride = []) => {
    const tables = Array.isArray(tablesOverride) ? tablesOverride : []
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
    canCancelBooking,
    mapBookingItem,
  }
}
