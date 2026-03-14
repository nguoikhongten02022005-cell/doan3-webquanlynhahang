import { useCallback } from 'react'
import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { CAC_THAO_TAC_TRANG_THAI_DAT_BAN_HOST } from '../data/duLieuDatBan'
import {
  huyDatBanApi,
  taoDatBanApi,
  taoDatBanNoiBoApi,
  layLichSuDatBanApi,
  layDanhSachDatBanApi,
  capNhatDatBanApi,
  capNhatTrangThaiDatBanApi,
  ganBanChoDatBanApi,
} from '../services/api/apiDatBan'
import { datJsonLuuTru } from '../services/dichVuLuuTru'
import { clearBookingDraft, getValidBookingDraft, saveBookingDraft } from '../utils/banNhapTamDatBan'
import { TRANG_THAI_BAN } from '../services/dichVuBanAn'
import {
  anhXaMucDatBan,
  chuanHoaDatBan,
} from './datBan/anhXaDatBan'

export const BOOKING_DATA_CHANGED_EVENT = 'booking:data-changed'

export const dispatchBookingDataChanged = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(BOOKING_DATA_CHANGED_EVENT))
}

const locBanPhuHopChoDatBan = (booking, tablesOverride = []) => {
  const tables = Array.isArray(tablesOverride) ? tablesOverride : []
  const guestCount = Number(booking?.guests) || 0

  return tables.filter((table) => {
    if (table.status === TRANG_THAI_BAN.BAN) {
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
}

export const useDatBan = () => {
  const updateBookingStatus = useCallback(async (bookingId, nextStatus, fallbackError) => {
    try {
      const { duLieu, thongDiep } = await capNhatTrangThaiDatBanApi(bookingId, nextStatus)
      const datBanDaChuanHoa = chuanHoaDatBan(duLieu)

      if (!datBanDaChuanHoa) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking: datBanDaChuanHoa,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || fallbackError }
    }
  }, [])

  const luuBanNhapTam = useCallback((draftPayload) => saveBookingDraft(STORAGE_KEYS.BOOKING_DRAFT, draftPayload), [])

  const layBanNhapTam = useCallback(() => getValidBookingDraft(STORAGE_KEYS.BOOKING_DRAFT), [])

  const xoaBanNhapTam = useCallback(() => {
    clearBookingDraft(STORAGE_KEYS.BOOKING_DRAFT)
  }, [])

  const taoDatBan = useCallback(async ({ booking, confirmationPayload }) => {
    const { duLieu } = await taoDatBanApi(booking)
    const createdBooking = chuanHoaDatBan(duLieu)

    datJsonLuuTru(STORAGE_KEYS.LAST_BOOKING_CONFIRMATION, {
      ...confirmationPayload,
      bookingCode: createdBooking?.bookingCode || confirmationPayload?.bookingCode,
      bookingId: createdBooking?.id || confirmationPayload?.bookingId,
      status: createdBooking?.status || confirmationPayload?.status,
    })
    clearBookingDraft(STORAGE_KEYS.BOOKING_DRAFT)
    dispatchBookingDataChanged()
    return createdBooking
  }, [])

  const taoDatBanNoiBo = useCallback(async (payload) => {
    try {
      const { duLieu, thongDiep } = await taoDatBanNoiBoApi(payload)
      const datBanDaChuanHoa = chuanHoaDatBan(duLieu)

      if (!datBanDaChuanHoa) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking: datBanDaChuanHoa,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể tạo booking nội bộ.' }
    }
  }, [])

  const capNhatDatBanNoiBo = useCallback(async (bookingId, payload) => {
    try {
      const { duLieu, thongDiep } = await capNhatDatBanApi(bookingId, payload)
      const updatedBooking = chuanHoaDatBan(duLieu)

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

  const ganBanChoDatBan = useCallback(async (bookingId, tableIds) => {
    try {
      const { duLieu, thongDiep } = await ganBanChoDatBanApi(bookingId, tableIds)
      const datBanDaChuanHoa = chuanHoaDatBan(duLieu)

      if (!datBanDaChuanHoa) {
        return { success: false, error: 'Không nhận được dữ liệu booking hợp lệ từ máy chủ.' }
      }

      dispatchBookingDataChanged()
      return {
        success: true,
        booking: datBanDaChuanHoa,
        message: thongDiep,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể gán bàn cho booking này.' }
    }
  }, [])

  const danhDauDaCheckIn = useCallback(
    async (bookingId) => updateBookingStatus(bookingId, 'DA_CHECK_IN', 'Không thể check-in booking.'),
    [updateBookingStatus],
  )

  const danhDauHoanThanh = useCallback(
    async (bookingId) => updateBookingStatus(bookingId, 'DA_HOAN_THANH', 'Không thể hoàn thành booking.'),
    [updateBookingStatus],
  )

  const danhDauKhongDen = useCallback(
    async (bookingId) => updateBookingStatus(bookingId, 'KHONG_DEN', 'Không thể đánh dấu không đến.'),
    [updateBookingStatus],
  )

  const traBanTachRoi = useCallback(() => ({
    success: false,
    error: 'Không hỗ trợ trả bàn độc lập. Hãy hoàn thành, đánh dấu không đến hoặc hủy booking để đồng bộ trạng thái bàn.',
  }), [])

  const layLichSuDatBan = useCallback(async () => {
    const { duLieu } = await layLichSuDatBanApi()

    if (!Array.isArray(duLieu)) {
      return []
    }

    return duLieu
      .map((item) => {
        if (item && typeof item === 'object' && 'bookingId' in item && 'dateTime' in item && 'rawStatus' in item) {
          return item
        }

        const normalized = chuanHoaDatBan(item)
        return normalized ? anhXaMucDatBan(normalized) : null
      })
      .filter(Boolean)
  }, [])

  const huyDatBan = useCallback(async (bookingId, bookingCode) => {
    try {
      const { thongDiep } = await huyDatBanApi(bookingId)
      const bookingHistory = await layLichSuDatBan()
      dispatchBookingDataChanged()
      return {
        success: true,
        message: thongDiep || `Đã hủy đặt bàn ${bookingCode} thành công.`,
        bookingHistory,
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Không thể hủy đặt bàn này. Vui lòng thử lại.' }
    }
  }, [layLichSuDatBan])

  const layDanhSachDatBanHost = useCallback(async () => {
    const { duLieu } = await layDanhSachDatBanApi()
    const bookings = Array.isArray(duLieu) ? duLieu : []
    return bookings.map(chuanHoaDatBan).filter(Boolean)
  }, [])

  const layBanPhuHopChoDatBan = useCallback((booking, tablesOverride = []) => locBanPhuHopChoDatBan(booking, tablesOverride), [])

  return {
    thaoTacTrangThaiDatBan: CAC_THAO_TAC_TRANG_THAI_DAT_BAN_HOST,
    layBanNhapTam,
    luuBanNhapTam,
    xoaBanNhapTam,
    taoDatBan,
    taoDatBanNoiBo,
    capNhatDatBanNoiBo,
    ganBanChoDatBan,
    danhDauDaCheckIn,
    danhDauHoanThanh,
    danhDauKhongDen,
    traBanTachRoi,
    layBanPhuHopChoDatBan,
    layLichSuDatBan,
    huyDatBan,
    layDanhSachDatBanHost,
  }
}
