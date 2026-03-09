import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountsTab from '../components/internalDashboard/AccountsTab'
import BookingsTab from '../components/internalDashboard/BookingsTab'
import OrdersTab from '../components/internalDashboard/OrdersTab'
import OverviewTab from '../components/internalDashboard/OverviewTab'
import TablesTab from '../components/internalDashboard/TablesTab'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { useAuth } from '../hooks/useAuth'
import { BOOKING_DATA_CHANGED_EVENT, useBooking } from '../hooks/useBooking'
import { DAY_FILTERS, INTERNAL_TABS, SHIFT_FILTERS, ACTIVE_BOOKING_STATUSES, CONFIRMED_BOOKING_STATUSES } from './internalDashboard/constants'
import { getAccounts } from '../services/authService'
import {
  getAccountsSummary,
  getOrdersSummary,
  getOverviewScopeLabel,
  getTableSummary,
  matchesDayFilter,
  matchesShiftFilter,
  needsManualConfirmation,
  parseBookingDateTime,
  readOrders,
  sortBookingsForOperations,
  sortOrdersForOperations,
} from './internalDashboard/selectors'
import { getOrderStatusTone } from './internalDashboard/formatters'

function InternalDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, isAdmin } = useAuth()
  const { bookingStatusActions, getHostBookings, updateHostBookingStatus } = useBooking()
  const [activeTab, setActiveTab] = useState('overview')
  const [dayFilter, setDayFilter] = useState('all')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [bookings, setBookings] = useState(() => getHostBookings())
  const [orders, setOrders] = useState(() => readOrders())
  const [accounts, setAccounts] = useState(() => getAccounts())

  useEffect(() => {
    const reloadData = () => {
      setBookings(getHostBookings())
      setOrders(readOrders())
      setAccounts(getAccounts())
    }

    const handleStorage = (event) => {
      if (!event.key || [STORAGE_KEYS.BOOKINGS, STORAGE_KEYS.RECEPTION_QUEUE, STORAGE_KEYS.ORDERS, STORAGE_KEYS.ACCOUNTS].includes(event.key)) {
        reloadData()
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(BOOKING_DATA_CHANGED_EVENT, reloadData)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(BOOKING_DATA_CHANGED_EVENT, reloadData)
    }
  }, [getHostBookings])

  useEffect(() => {
    if (!isAdmin && activeTab === 'accounts') {
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
    return activeBookings.filter((booking) => {
      const bookingTime = parseBookingDateTime(booking.date, booking.time)
      if (!bookingTime) return false

      const diff = bookingTime.getTime() - now.getTime()
      return diff >= 0 && diff <= 2 * 60 * 60 * 1000
    })
  }, [activeBookings])
  const checkedInBookings = useMemo(
    () => filteredBookings.filter((booking) => booking.status === 'DA_HOAN_THANH').length,
    [filteredBookings],
  )
  const tableSummary = useMemo(() => getTableSummary(filteredBookings), [filteredBookings])
  const busyAreas = useMemo(
    () => tableSummary.filter((area) => area.occupancyRate >= 0.75),
    [tableSummary],
  )
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
        key: 'arriving-soon',
        title: 'Khách sắp đến 2 giờ',
        value: upcomingSoonBookings.length,
        detail: upcomingSoonBookings.length > 0 ? 'Kiểm tra bàn, host và ghi chú đặc biệt.' : 'Chưa có lượt đến gần trong 2 giờ tới.',
        tone: upcomingSoonBookings.length > 0 ? 'success' : 'neutral',
        action: () => setActiveTab('bookings'),
      },
      {
        key: 'open-orders',
        title: 'Đơn đang xử lý',
        value: openOrders.length,
        detail: openOrders.length > 0 ? 'Theo dõi đơn mới, đơn chờ bếp hoặc chờ thanh toán.' : 'Không có đơn mở cần theo dõi.',
        tone: openOrders.length > 0 ? 'warning' : 'neutral',
        action: () => setActiveTab('orders'),
      },
      {
        key: 'busy-tables',
        title: 'Bàn sắp đầy',
        value: busyAreas.length,
        detail: busyAreas.length > 0 ? 'Cần phân bổ khách sang khu vực còn trống.' : 'Công suất bàn đang ổn định.',
        tone: busyAreas.length > 0 ? 'danger' : 'neutral',
        action: () => setActiveTab('tables'),
      },
    ],
    [busyAreas.length, openOrders.length, pendingBookings.length, upcomingSoonBookings.length],
  )

  const operationalAlerts = pendingBookings.length + upcomingSoonBookings.length + busyAreas.length + openOrders.length
  const compactTableSummary = tableSummary.slice(0, 4)

  const handleUpdateStatus = (bookingId, nextStatus) => {
    setBookings((currentBookings) => updateHostBookingStatus(currentBookings, bookingId, nextStatus))
  }

  const handleCreateBooking = () => {
    navigate('/booking')
  }

  const handleCreateOrder = () => {
    navigate('/menu')
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
                busyAreas={busyAreas}
                checkedInBookings={checkedInBookings}
                compactTableSummary={compactTableSummary}
                confirmedBookings={confirmedBookings}
                isAdmin={isAdmin}
                openOrders={openOrders}
                operationalAlerts={operationalAlerts}
                ordersSummary={ordersSummary}
                pendingBookings={pendingBookings}
                scopeLabel={scopeLabel}
                tableSummary={tableSummary}
                upcomingSoonBookings={upcomingSoonBookings}
                urgentItems={urgentItems}
              />
            )}

            {activeTab === 'bookings' && (
              <BookingsTab
                bookingQueue={bookingQueue}
                bookingStatusActions={bookingStatusActions}
                handleUpdateStatus={handleUpdateStatus}
                scopeLabel={scopeLabel}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab orders={sortedOrders} />
            )}

            {activeTab === 'tables' && (
              <TablesTab scopeLabel={scopeLabel} tableSummary={tableSummary} />
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
