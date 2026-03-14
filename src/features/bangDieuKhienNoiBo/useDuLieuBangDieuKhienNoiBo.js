import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDanhSachMonAn } from '../../hooks/useDanhSachMonAn'
import { BOOKING_DATA_CHANGED_EVENT, useDatBan } from '../../hooks/useDatBan'
import { layDanhSachNguoiDungApi } from '../../services/api/apiXacThuc'
import { layDanhSachDonHangApi } from '../../services/api/apiDonHang'
import { layDanhSachBanApi, capNhatTrangThaiBanApi } from '../../services/api/apiBanAn'
import { TRANG_THAI_BAN } from '../../services/dichVuBanAn'
import { CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG, CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN } from './hangSo'
import {
  layTomTatTaiKhoan,
  layTomTatDonHang,
  layTomTatTonKhoBan,
  layTomTatBan,
  layDatBanChuaGanBan,
  laDatBanDaCheckIn,
  laDatBanSapDienRa,
  sapXepDatBanChoVanHanh,
  sapXepDonHangChoVanHanh,
} from './boChon'
import { laySacThaiDonHang } from './dinhDang'

export const useDuLieuBangDieuKhienNoiBo = () => {
  const {
    ganBanChoDatBan,
    taoDatBanNoiBo,
    layBanPhuHopChoDatBan,
    layDanhSachDatBanHost,
    danhDauDaCheckIn,
    danhDauHoanThanh,
    danhDauKhongDen,
    capNhatDatBanNoiBo,
  } = useDatBan()
  const { dishes: danhSachMon, reloadDishes: taiLaiDanhSachMon } = useDanhSachMonAn()
  const [danhSachDatBan, setDanhSachDatBan] = useState([])
  const [danhSachDonHang, setDanhSachDonHang] = useState([])
  const [danhSachTaiKhoan, setDanhSachTaiKhoan] = useState([])
  const [danhSachBan, setDanhSachBan] = useState([])

  const taiLaiDuLieu = useCallback(async () => {
    const [nextBookings, nextOrdersResponse, nextAccountsResponse, nextTablesResponse] = await Promise.all([
      layDanhSachDatBanHost(),
      layDanhSachDonHangApi(),
      layDanhSachNguoiDungApi(),
      layDanhSachBanApi(),
    ])

    setDanhSachDatBan(Array.isArray(nextBookings) ? nextBookings : [])
    setDanhSachDonHang(Array.isArray(nextOrdersResponse?.duLieu) ? nextOrdersResponse.duLieu : [])
    setDanhSachTaiKhoan(Array.isArray(nextAccountsResponse?.duLieu) ? nextAccountsResponse.duLieu : [])
    setDanhSachBan(Array.isArray(nextTablesResponse?.duLieu) ? nextTablesResponse.duLieu : [])
  }, [layDanhSachDatBanHost])

  useEffect(() => {
    taiLaiDuLieu()

    const handleStorage = () => {
      taiLaiDuLieu()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(BOOKING_DATA_CHANGED_EVENT, taiLaiDuLieu)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(BOOKING_DATA_CHANGED_EVENT, taiLaiDuLieu)
    }
  }, [taiLaiDuLieu])

  const bookingQueue = useMemo(
    () => sapXepDatBanChoVanHanh(danhSachDatBan, new Date()),
    [danhSachDatBan],
  )
  const activeBookings = useMemo(
    () => bookingQueue.filter((booking) => CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG.has(booking.status)),
    [bookingQueue],
  )
  const confirmedBookings = useMemo(
    () => activeBookings.filter((booking) => CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN.has(booking.status)),
    [activeBookings],
  )
  const pendingBookings = useMemo(
    () => bookingQueue.filter((booking) => booking.status === 'YEU_CAU_DAT_BAN' || booking.status === 'CAN_GOI_LAI' || booking.status === 'CHO_XAC_NHAN'),
    [bookingQueue],
  )
  const upcomingSoonBookings = useMemo(() => {
    const now = new Date()
    return activeBookings.filter((booking) => laDatBanSapDienRa(booking, now))
  }, [activeBookings])
  const checkedInBookings = useMemo(
    () => danhSachDatBan.filter((booking) => laDatBanDaCheckIn(booking)).length,
    [danhSachDatBan],
  )
  const tableSummary = useMemo(() => layTomTatBan(danhSachBan), [danhSachBan])
  const tableInventorySummary = useMemo(() => layTomTatTonKhoBan(danhSachBan), [danhSachBan])
  const unassignedBookings = useMemo(() => layDatBanChuaGanBan(activeBookings), [activeBookings])
  const ordersSummary = useMemo(() => layTomTatDonHang(danhSachDonHang), [danhSachDonHang])
  const openOrders = useMemo(
    () => sapXepDonHangChoVanHanh(danhSachDonHang).filter((order) => laySacThaiDonHang(order.status) === 'warning'),
    [danhSachDonHang],
  )
  const sortedOrders = useMemo(() => sapXepDonHangChoVanHanh(danhSachDonHang), [danhSachDonHang])
  const accountsSummary = useMemo(() => layTomTatTaiKhoan(danhSachTaiKhoan), [danhSachTaiKhoan])

  const handleCreateInternalBooking = useCallback(async (payload) => {
    const ketQua = await taoDatBanNoiBo(payload)
    if (result?.success) await taiLaiDuLieu()
    return ketQua
  }, [taoDatBanNoiBo, taiLaiDuLieu])

  const handleUpdateInternalBooking = useCallback(async (bookingId, payload) => {
    const ketQua = await capNhatDatBanNoiBo(bookingId, payload)
    if (result?.success) await taiLaiDuLieu()
    return ketQua
  }, [capNhatDatBanNoiBo, taiLaiDuLieu])

  const handleAssignTables = useCallback(async (bookingId, tableIds) => {
    const ketQua = await ganBanChoDatBan(bookingId, tableIds)
    if (result?.success) await taiLaiDuLieu()
    return ketQua
  }, [ganBanChoDatBan, taiLaiDuLieu])

  const handleCheckIn = useCallback(async (bookingId) => {
    const ketQua = await danhDauDaCheckIn(bookingId)
    if (result?.success) await taiLaiDuLieu()
    return ketQua
  }, [danhDauDaCheckIn, taiLaiDuLieu])

  const handleComplete = useCallback(async (bookingId) => {
    const ketQua = await danhDauHoanThanh(bookingId)
    if (result?.success) await taiLaiDuLieu()
    return ketQua
  }, [danhDauHoanThanh, taiLaiDuLieu])

  const handleNoShow = useCallback(async (bookingId) => {
    const ketQua = await danhDauKhongDen(bookingId)
    if (result?.success) await taiLaiDuLieu()
    return ketQua
  }, [danhDauKhongDen, taiLaiDuLieu])

  const handleMarkTableDirty = useCallback(async (tableId) => {
    await capNhatTrangThaiBanApi(tableId, TRANG_THAI_BAN.BAN)
    await taiLaiDuLieu()
  }, [taiLaiDuLieu])

  const handleMarkTableReady = useCallback(async (tableId) => {
    await capNhatTrangThaiBanApi(tableId, TRANG_THAI_BAN.TRONG)
    await taiLaiDuLieu()
  }, [taiLaiDuLieu])

  return {
    accountsSummary,
    activeBookings,
    bookingQueue,
    checkedInBookings,
    confirmedBookings,
    danhSachBan,
    danhSachDatBan,
    danhSachDonHang,
    danhSachMon,
    danhSachTaiKhoan,
    handleAssignTables,
    handleCheckIn,
    handleComplete,
    handleCreateInternalBooking,
    handleMarkTableDirty,
    handleMarkTableReady,
    handleNoShow,
    handleUpdateInternalBooking,
    getAvailableTablesForBooking: layBanPhuHopChoDatBan,
    openOrders,
    ordersSummary,
    pendingBookings,
    sortedOrders,
    tableInventorySummary,
    tableSummary,
    taiLaiDanhSachMon,
    taiLaiDuLieu,
    upcomingSoonBookings,
    unassignedBookings,
  }
}
