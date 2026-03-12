import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountsTab from '../components/internalDashboard/AccountsTab'
import BookingsTab from '../components/internalDashboard/BookingsTab'
import DishesTab from '../components/internalDashboard/DishesTab'
import OrdersTab from '../components/internalDashboard/OrdersTab'
import OverviewTab from '../components/internalDashboard/OverviewTab'
import TablesTab from '../components/internalDashboard/TablesTab'
import { useAuth } from '../hooks/useAuth'
import { useMenuDishes } from '../hooks/useMenuDishes'
import { BOOKING_DATA_CHANGED_EVENT, useBooking } from '../hooks/useBooking'
import { DAY_FILTERS, INTERNAL_TABS, SHIFT_FILTERS, ACTIVE_BOOKING_STATUSES, CONFIRMED_BOOKING_STATUSES } from './internalDashboard/constants'
import { getOrders } from '../services/api/ordersGateway'
import { getTablesGateway, updateTableStatusGateway } from '../services/api/tablesGateway'
import { getAccountsGateway } from '../services/api/usersGateway'
import { TABLE_STATUSES } from '../services/tableService'
import {
  getAccountsSummary,
  getOrdersSummary,
  getOverviewScopeLabel,
  getTableInventorySummary,
  getTableSummary,
  getUnassignedBookings,
  isCheckedInBooking,
  isUpcomingSoonBooking,
  matchesDayFilter,
  matchesShiftFilter,
  needsManualConfirmation,
  sortBookingsForOperations,
  sortOrdersForOperations,
} from './internalDashboard/selectors'
import { getOrderStatusTone } from './internalDashboard/formatters'

function InternalDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, isAdmin } = useAuth()
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
  const [activeTab, setActiveTab] = useState('overview')
  const [dayFilter, setDayFilter] = useState('all')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [accounts, setAccounts] = useState([])
  const [tables, setTables] = useState([])
  const { dishes, reloadDishes } = useMenuDishes()

  const reloadData = useCallback(async () => {
    const [nextBookings, nextOrders, nextAccounts, nextTables] = await Promise.all([
      getHostBookings(),
      getOrders(),
      getAccountsGateway(),
      getTablesGateway(),
    ])

    setBookings(Array.isArray(nextBookings) ? nextBookings : [])
    setOrders(Array.isArray(nextOrders) ? nextOrders : [])
    setAccounts(Array.isArray(nextAccounts) ? nextAccounts : [])
    setTables(Array.isArray(nextTables) ? nextTables : [])
  }, [getHostBookings])

  useEffect(() => {
    reloadData()

    const handleStorage = () => {
      reloadData()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(BOOKING_DATA_CHANGED_EVENT, reloadData)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(BOOKING_DATA_CHANGED_EVENT, reloadData)
    }
  }, [reloadData])

  useEffect(() => {
    if (!isAdmin && (activeTab === 'accounts' || activeTab === 'dishes')) {
      setActiveTab('overview')
    }
  }, [activeTab, isAdmin])

  const visibleTabs = useMemo(
    () => INTERNAL_TABS.filter((tab) => !tab.adminOnly || isAdmin),
    [isAdmin],
  )

  const scopeLabel = useMemo(() => getOverviewScopeLabel(dayFilter, shiftFilter), [dayFilter, shiftFilter])

  const filteredBookings = useMemo(() => {
    const now = new Date()
    return bookings.filter((booking) => matchesDayFilter(booking, dayFilter, now) && matchesShiftFilter(booking, shiftFilter))
  }, [bookings, dayFilter, shiftFilter])

  const bookingQueue = useMemo(() => sortBookingsForOperations(filteredBookings, new Date()), [filteredBookings])
  const activeBookings = useMemo(
    () => bookingQueue.filter((booking) => ACTIVE_BOOKING_STATUSES.has(booking.status)),
    [bookingQueue],
  )
  const pendingBookings = useMemo(
    () => bookingQueue.filter((booking) => needsManualConfirmation(booking)),
    [bookingQueue],
  )
  const confirmedBookings = useMemo(
    () => activeBookings.filter((booking) => CONFIRMED_BOOKING_STATUSES.has(booking.status)),
    [activeBookings],
  )
  const upcomingSoonBookings = useMemo(() => {
    const now = new Date()
    return activeBookings.filter((booking) => isUpcomingSoonBooking(booking, now))
  }, [activeBookings])
  const checkedInBookings = useMemo(
    () => filteredBookings.filter((booking) => isCheckedInBooking(booking)).length,
    [filteredBookings],
  )
  const tableSummary = useMemo(() => getTableSummary(tables), [tables])
  const tableInventorySummary = useMemo(() => getTableInventorySummary(tables), [tables])
  const unassignedBookings = useMemo(() => getUnassignedBookings(activeBookings), [activeBookings])
  const ordersSummary = useMemo(() => getOrdersSummary(orders), [orders])
  const openOrders = useMemo(
    () => sortOrdersForOperations(orders).filter((order) => getOrderStatusTone(order.status) === 'warning'),
    [orders],
  )
  const sortedOrders = useMemo(() => sortOrdersForOperations(orders), [orders])
  const accountsSummary = useMemo(() => getAccountsSummary(accounts), [accounts])

  const urgentItems = useMemo(
    () => [
      {
        key: 'pending-bookings',
        title: 'Chờ xác nhận',
        value: pendingBookings.length,
        detail: pendingBookings.length > 0 ? 'Ưu tiên gọi lại và chốt bàn.' : 'Không có booking chờ xử lý.',
        tone: pendingBookings.length > 0 ? 'warning' : 'neutral',
        action: () => setActiveTab('bookings'),
      },
      {
        key: 'unassigned-bookings',
        title: 'Chưa gán bàn',
        value: unassignedBookings.length,
        detail: unassignedBookings.length > 0 ? 'Cần phân bàn trước giờ khách đến.' : 'Các booking đang có bàn phù hợp.',
        tone: unassignedBookings.length > 0 ? 'danger' : 'neutral',
        action: () => setActiveTab('bookings'),
      },
      {
        key: 'arriving-soon',
        title: 'Khách sắp đến 2 giờ',
        value: upcomingSoonBookings.length,
        detail: upcomingSoonBookings.length > 0 ? 'Kiểm tra bàn, host và ghi chú đặc biệt.' : 'Chưa có lượt đến gần trong 2 giờ tới.',
        tone: upcomingSoonBookings.length > 0 ? 'success' : 'neutral',
        action: () => setActiveTab('bookings'),
      },
      {
        key: 'dirty-tables',
        title: 'Bàn cần dọn',
        value: tableInventorySummary.dirty,
        detail: tableInventorySummary.dirty > 0 ? 'Cần làm sạch trước khi nhận lượt mới.' : 'Không có bàn đang dọn.',
        tone: tableInventorySummary.dirty > 0 ? 'warning' : 'neutral',
        action: () => setActiveTab('tables'),
      },
    ],
    [pendingBookings.length, tableInventorySummary.dirty, unassignedBookings.length, upcomingSoonBookings.length],
  )

  const operationalAlerts = pendingBookings.length + unassignedBookings.length + upcomingSoonBookings.length + tableInventorySummary.dirty

  const handleCreateBooking = () => {
    setActiveTab('bookings')
  }

  const handleCreateOrder = () => {
    navigate('/menu')
  }

  const handleCreateInternalBooking = async (payload) => {
    const result = await createInternalBooking(payload, currentUser)
    if (result?.success) await reloadData()
    return result
  }

  const handleUpdateInternalBooking = async (bookingId, payload) => {
    const result = await updateInternalBooking(bookingId, payload)
    if (result?.success) await reloadData()
    return result
  }

  const handleAssignTables = async (bookingId, tableIds) => {
    const result = await assignBookingTables(bookingId, tableIds)
    if (result?.success) await reloadData()
    return result
  }

  const handleCheckIn = async (bookingId) => {
    const result = await setBookingCheckedIn(bookingId)
    if (result?.success) await reloadData()
    return result
  }

  const handleComplete = async (bookingId) => {
    const result = await setBookingCompleted(bookingId)
    if (result?.success) await reloadData()
    return result
  }

  const handleNoShow = async (bookingId) => {
    const result = await setBookingNoShow(bookingId)
    if (result?.success) await reloadData()
    return result
  }

  const handleMarkTableDirty = async (tableId) => {
    await updateTableStatusGateway(tableId, TABLE_STATUSES.DIRTY)
    await reloadData()
  }

  const handleMarkTableReady = async (tableId) => {
    await updateTableStatusGateway(tableId, TABLE_STATUSES.AVAILABLE)
    await reloadData()
  }

  return (
    <div className="internal-dashboard-page">
      <div className="container">
        <div className="internal-toolbar profile-card">
          <div className="internal-toolbar-main">
            <div>
              <p className="profile-kicker">Điều hành ca</p>
              <h1>Dashboard vận hành</h1>
              <p>
                Theo dõi booking, bàn ăn và đơn đang mở theo nhịp vận hành thực tế.
              </p>
            </div>
            <div className="internal-operator-badge">
              <strong>{currentUser?.fullName || 'Nhân sự nội bộ'}</strong>
              <span>{isAdmin ? 'Quản trị viên' : 'Nhân viên vận hành'}</span>
            </div>
          </div>

          <div className="internal-toolbar-controls">
            <div className="internal-filter-cluster">
              <span>Bộ lọc ngày</span>
              <div className="internal-pill-group">
                {DAY_FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={`internal-pill ${dayFilter === filter.key ? 'active' : ''}`}
                    onClick={() => setDayFilter(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="internal-filter-cluster">
              <span>Theo ca</span>
              <div className="internal-pill-group">
                {SHIFT_FILTERS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={`internal-pill ${shiftFilter === filter.key ? 'active' : ''}`}
                    onClick={() => setShiftFilter(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="internal-filter-cluster">
              <span>Thao tác nhanh</span>
              <div className="internal-quick-actions">
                <button type="button" className="internal-quick-btn internal-quick-btn-primary" onClick={handleCreateBooking}>
                  Tạo booking
                </button>
                <button type="button" className="internal-quick-btn" onClick={() => setActiveTab('tables')}>
                  Mở sơ đồ bàn
                </button>
                <button type="button" className="internal-quick-btn" onClick={handleCreateOrder}>
                  Tạo đơn mới
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-shell">
          <aside className="profile-tabs internal-dashboard-tabs" aria-label="Điều hướng nội bộ">
            {visibleTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`profile-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <section className="internal-dashboard-content">
            {activeTab === 'overview' && (
              <OverviewTab
                accountsSummary={accountsSummary}
                activeBookings={activeBookings}
                bookingQueue={bookingQueue}
                checkedInBookings={checkedInBookings}
                confirmedBookings={confirmedBookings}
                isAdmin={isAdmin}
                openOrders={openOrders}
                operationalAlerts={operationalAlerts}
                ordersSummary={ordersSummary}
                pendingBookings={pendingBookings}
                scopeLabel={scopeLabel}
                tableInventorySummary={tableInventorySummary}
                tableSummary={tableSummary}
                upcomingSoonBookings={upcomingSoonBookings}
                unassignedBookings={unassignedBookings}
                urgentItems={urgentItems}
              />
            )}

            {activeTab === 'bookings' && (
              <BookingsTab
                bookingQueue={bookingQueue}
                getAvailableTablesForBooking={(booking) => getAvailableTablesForBooking(booking, tables)}
                handleAssignTables={handleAssignTables}
                handleCheckIn={handleCheckIn}
                handleComplete={handleComplete}
                handleCreateInternalBooking={handleCreateInternalBooking}
                handleNoShow={handleNoShow}
                handleUpdateInternalBooking={handleUpdateInternalBooking}
                scopeLabel={scopeLabel}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab orders={sortedOrders} />
            )}

            {activeTab === 'tables' && (
              <TablesTab
                handleMarkTableDirty={handleMarkTableDirty}
                handleMarkTableReady={handleMarkTableReady}
                scopeLabel={scopeLabel}
                tableInventorySummary={tableInventorySummary}
                tableSummary={tableSummary}
                tables={tables}
              />
            )}

            {activeTab === 'dishes' && isAdmin && (
              <DishesTab dishes={dishes} reloadDishes={reloadDishes} />
            )}

            {activeTab === 'accounts' && isAdmin && (
              <AccountsTab accounts={accounts} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default InternalDashboardPage
