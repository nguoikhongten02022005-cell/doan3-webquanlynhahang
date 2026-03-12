import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMenuDishes } from '../../hooks/useMenuDishes'
import { BOOKING_DATA_CHANGED_EVENT, useBooking } from '../../hooks/useBooking'
import { getOrders } from '../../services/api/ordersGateway'
import { getTablesGateway, updateTableStatusGateway } from '../../services/api/tablesGateway'
import { getAccountsGateway } from '../../services/api/usersGateway'
import { TABLE_STATUSES } from '../../services/tableService'
import { ACTIVE_BOOKING_STATUSES, CONFIRMED_BOOKING_STATUSES } from './constants'
import {
  getAccountsSummary,
  getOrdersSummary,
  getTableInventorySummary,
  getTableSummary,
  getUnassignedBookings,
  isCheckedInBooking,
  isUpcomingSoonBooking,
  sortBookingsForOperations,
  sortOrdersForOperations,
} from './selectors'
import { getOrderStatusTone } from './formatters'

export const useInternalDashboardData = () => {
  const {
    assignBookingTables,
    createInternalBooking,
    getAvailableTablesForBooking,
    getHostBookings,
    setBookingCheckedIn,
    setBookingCompleted,
    setBookingNoShow,
    updateInternalBooking,
  } = useBooking()
  const { dishes: danhSachMon, reloadDishes: taiLaiDanhSachMon } = useMenuDishes()
  const [danhSachDatBan, setDanhSachDatBan] = useState([])
  const [danhSachDonHang, setDanhSachDonHang] = useState([])
  const [danhSachTaiKhoan, setDanhSachTaiKhoan] = useState([])
  const [danhSachBan, setDanhSachBan] = useState([])

  const taiLaiDuLieu = useCallback(async () => {
    const [nextBookings, nextOrders, nextAccounts, nextTables] = await Promise.all([
      getHostBookings(),
      getOrders(),
      getAccountsGateway(),
      getTablesGateway(),
    ])

    setDanhSachDatBan(Array.isArray(nextBookings) ? nextBookings : [])
    setDanhSachDonHang(Array.isArray(nextOrders) ? nextOrders : [])
    setDanhSachTaiKhoan(Array.isArray(nextAccounts) ? nextAccounts : [])
    setDanhSachBan(Array.isArray(nextTables) ? nextTables : [])
  }, [getHostBookings])

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
    () => sortBookingsForOperations(danhSachDatBan, new Date()),
    [danhSachDatBan],
  )
  const activeBookings = useMemo(
    () => bookingQueue.filter((booking) => ACTIVE_BOOKING_STATUSES.has(booking.status)),
    [bookingQueue],
  )
  const confirmedBookings = useMemo(
    () => activeBookings.filter((booking) => CONFIRMED_BOOKING_STATUSES.has(booking.status)),
    [activeBookings],
  )
  const pendingBookings = useMemo(
    () => bookingQueue.filter((booking) => booking.status === 'YEU_CAU_DAT_BAN' || booking.status === 'CAN_GOI_LAI' || booking.status === 'CHO_XAC_NHAN'),
    [bookingQueue],
  )
  const upcomingSoonBookings = useMemo(() => {
    const now = new Date()
    return activeBookings.filter((booking) => isUpcomingSoonBooking(booking, now))
  }, [activeBookings])
  const checkedInBookings = useMemo(
    () => danhSachDatBan.filter((booking) => isCheckedInBooking(booking)).length,
    [danhSachDatBan],
  )
  const tableSummary = useMemo(() => getTableSummary(danhSachBan), [danhSachBan])
  const tableInventorySummary = useMemo(() => getTableInventorySummary(danhSachBan), [danhSachBan])
  const unassignedBookings = useMemo(() => getUnassignedBookings(activeBookings), [activeBookings])
  const ordersSummary = useMemo(() => getOrdersSummary(danhSachDonHang), [danhSachDonHang])
  const openOrders = useMemo(
    () => sortOrdersForOperations(danhSachDonHang).filter((order) => getOrderStatusTone(order.status) === 'warning'),
    [danhSachDonHang],
  )
  const sortedOrders = useMemo(() => sortOrdersForOperations(danhSachDonHang), [danhSachDonHang])
  const accountsSummary = useMemo(() => getAccountsSummary(danhSachTaiKhoan), [danhSachTaiKhoan])

  const handleCreateInternalBooking = useCallback(async (payload) => {
    const result = await createInternalBooking(payload)
    if (result?.success) await taiLaiDuLieu()
    return result
  }, [createInternalBooking, taiLaiDuLieu])

  const handleUpdateInternalBooking = useCallback(async (bookingId, payload) => {
    const result = await updateInternalBooking(bookingId, payload)
    if (result?.success) await taiLaiDuLieu()
    return result
  }, [taiLaiDuLieu, updateInternalBooking])

  const handleAssignTables = useCallback(async (bookingId, tableIds) => {
    const result = await assignBookingTables(bookingId, tableIds)
    if (result?.success) await taiLaiDuLieu()
    return result
  }, [assignBookingTables, taiLaiDuLieu])

  const handleCheckIn = useCallback(async (bookingId) => {
    const result = await setBookingCheckedIn(bookingId)
    if (result?.success) await taiLaiDuLieu()
    return result
  }, [setBookingCheckedIn, taiLaiDuLieu])

  const handleComplete = useCallback(async (bookingId) => {
    const result = await setBookingCompleted(bookingId)
    if (result?.success) await taiLaiDuLieu()
    return result
  }, [setBookingCompleted, taiLaiDuLieu])

  const handleNoShow = useCallback(async (bookingId) => {
    const result = await setBookingNoShow(bookingId)
    if (result?.success) await taiLaiDuLieu()
    return result
  }, [setBookingNoShow, taiLaiDuLieu])

  const handleMarkTableDirty = useCallback(async (tableId) => {
    await updateTableStatusGateway(tableId, TABLE_STATUSES.DIRTY)
    await taiLaiDuLieu()
  }, [taiLaiDuLieu])

  const handleMarkTableReady = useCallback(async (tableId) => {
    await updateTableStatusGateway(tableId, TABLE_STATUSES.AVAILABLE)
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
    getAvailableTablesForBooking,
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
