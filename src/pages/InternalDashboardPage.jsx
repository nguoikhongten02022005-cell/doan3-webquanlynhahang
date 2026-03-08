import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../constants/storageKeys'
import {
  BOOKING_SEATING_LABELS,
  HOST_BOOKING_STATUS_LABELS,
} from '../data/bookingData'
import { useAuth } from '../hooks/useAuth'
import { BOOKING_DATA_CHANGED_EVENT, useBooking } from '../hooks/useBooking'
import { getAccounts } from '../services/authService'
import { getStorageJSON } from '../services/storageService'
import { formatCurrency } from '../utils/currency'

const INTERNAL_TABS = Object.freeze([
  { key: 'overview', label: 'Tổng quan' },
  { key: 'bookings', label: 'Đặt bàn' },
  { key: 'orders', label: 'Đơn đang mở' },
  { key: 'tables', label: 'Bàn ăn' },
  { key: 'accounts', label: 'Quản trị & phân quyền', adminOnly: true },
])

const DAY_FILTERS = Object.freeze([
  { key: 'all', label: 'Toàn bộ ngày' },
  { key: 'today', label: 'Hôm nay' },
  { key: 'tomorrow', label: 'Ngày mai' },
])

const SHIFT_FILTERS = Object.freeze([
  { key: 'all', label: 'Mọi ca' },
  { key: 'lunch', label: 'Ca trưa' },
  { key: 'dinner', label: 'Ca tối' },
])

const TABLE_AREAS = Object.freeze([
  { id: 'SANH_CHINH', name: 'Sảnh chính', total: 12 },
  { id: 'PHONG_VIP', name: 'Phòng VIP', total: 4 },
  { id: 'BAN_CONG', name: 'Ban công', total: 6 },
  { id: 'QUAY_BAR', name: 'Quầy bar', total: 5 },
])

const ACTIVE_BOOKING_STATUSES = new Set([
  'YEU_CAU_DAT_BAN',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
  'DA_GHI_NHAN',
])

const PENDING_CONFIRMATION_STATUSES = new Set([
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
])

const CONFIRMED_BOOKING_STATUSES = new Set([
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
])

const formatDate = (value) => {
  if (!value) return '--'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return date.toLocaleDateString('vi-VN')
}

const formatDateTime = (date, time) => {
  if (!date) return '--'

  const [year, month, day] = String(date).split('-')
  if (!year || !month || !day) return `${date} ${time || ''}`.trim()

  return `${day}/${month}/${year} ${time || ''}`.trim()
}

const formatGuests = (guests) => `${guests} khách`
const getSeatingLabel = (value) => BOOKING_SEATING_LABELS[value] || value || 'Không ưu tiên'
const isVipBooking = (booking) => booking.seatingArea === 'PHONG_VIP'
const needsManualConfirmation = (booking) => PENDING_CONFIRMATION_STATUSES.has(booking.status) || isVipBooking(booking)

const getBookingStatusTone = (status) => {
  if (status === 'DA_HUY' || status === 'TU_CHOI_HET_CHO') return 'danger'
  if (status === 'DA_XAC_NHAN' || status === 'DA_GHI_NHAN' || status === 'DA_HOAN_THANH' || status === 'GIU_CHO_TAM') return 'success'
  return 'warning'
}

const getOrderStatusTone = (status) => {
  const text = String(status || '').toLowerCase()

  if (text.includes('hoàn thành') || text.includes('đã giao') || text.includes('đã thanh toán')) return 'success'
  if (text.includes('mới') || text.includes('đang') || text.includes('chờ')) return 'warning'
  if (text.includes('hủy')) return 'danger'
  return 'neutral'
}

const getChannelLabel = (channel) => {
  if (Array.isArray(channel) && channel.length > 0) return channel.join(' / ')
  return 'SMS'
}

const getBookingPriorityNote = (booking) => {
  if (isVipBooking(booking)) return 'Ưu tiên xác nhận thủ công do yêu cầu VIP hoặc phòng riêng.'
  if (booking.status === 'CAN_GOI_LAI') return 'Cần gọi lại để chốt tình trạng chỗ trống hoặc điều kiện phục vụ.'
  if (booking.seatingArea === 'BAN_CONG') return 'Kiểm tra thời tiết trước khi chốt vị trí ban công.'
  return ''
}

const parseBookingDateTime = (date, time) => {
  if (!date) return null

  const normalizedTime = time && /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time || '00:00:00'
  const parsed = new Date(`${date}T${normalizedTime}`)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const isSameCalendarDay = (left, right) => (
  left.getFullYear() === right.getFullYear()
  && left.getMonth() === right.getMonth()
  && left.getDate() === right.getDate()
)

const matchesDayFilter = (booking, dayFilter, now) => {
  if (dayFilter === 'all') return true

  const bookingDate = parseBookingDateTime(booking.date, booking.time)
  if (!bookingDate) return false

  if (dayFilter === 'today') {
    return isSameCalendarDay(bookingDate, now)
  }

  if (dayFilter === 'tomorrow') {
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    return isSameCalendarDay(bookingDate, tomorrow)
  }

  return true
}

const matchesShiftFilter = (booking, shiftFilter) => {
  if (shiftFilter === 'all') return true

  const [hour] = String(booking.time || '').split(':')
  const numericHour = Number(hour)

  if (Number.isNaN(numericHour)) return false
  if (shiftFilter === 'lunch') return numericHour < 16
  if (shiftFilter === 'dinner') return numericHour >= 16

  return true
}

const readOrders = () => {
  const rawOrders = getStorageJSON(STORAGE_KEYS.ORDERS, [])
  return Array.isArray(rawOrders) ? rawOrders : []
}

const getOrdersSummary = (orders) => ({
  total: orders.length,
  pending: orders.filter((order) => {
    const text = String(order?.status || '').toLowerCase()
    return text.includes('mới') || text.includes('đang') || text.includes('chờ')
  }).length,
  revenue: orders.reduce((sum, order) => sum + (Number(order?.total) || 0), 0),
})

const getTableSummary = (bookings) => {
  const counts = bookings
    .filter((booking) => ACTIVE_BOOKING_STATUSES.has(booking.status))
    .reduce((accumulator, booking) => {
      const area = booking.seatingArea || 'KHONG_UU_TIEN'
      accumulator[area] = (accumulator[area] || 0) + 1
      return accumulator
    }, {})

  return TABLE_AREAS.map((area) => {
    const occupied = counts[area.id] || 0
    const available = Math.max(area.total - occupied, 0)
    const occupancyRate = area.total > 0 ? occupied / area.total : 0

    return {
      ...area,
      occupied,
      available,
      occupancyRate,
    }
  })
}

const getAccountsSummary = (accounts) => ({
  total: accounts.length,
  admins: accounts.filter((account) => account.role === 'admin').length,
  staffs: accounts.filter((account) => account.role === 'staff').length,
  customers: accounts.filter((account) => account.role === 'customer').length,
})

const getOverviewScopeLabel = (dayFilter, shiftFilter) => {
  const dayLabel = DAY_FILTERS.find((item) => item.key === dayFilter)?.label || 'Toàn bộ ngày'
  const shiftLabel = SHIFT_FILTERS.find((item) => item.key === shiftFilter)?.label || 'Mọi ca'
  return `${dayLabel} · ${shiftLabel}`
}

const getBookingPriorityRank = (booking, now) => {
  const bookingTime = parseBookingDateTime(booking.date, booking.time)
  const diff = bookingTime ? bookingTime.getTime() - now.getTime() : Number.POSITIVE_INFINITY

  if (needsManualConfirmation(booking)) return 0
  if (diff >= 0 && diff <= 2 * 60 * 60 * 1000) return 1
  if (CONFIRMED_BOOKING_STATUSES.has(booking.status)) return 2
  return 3
}

const sortBookingsForOperations = (bookings, now) => [...bookings].sort((left, right) => {
  const leftRank = getBookingPriorityRank(left, now)
  const rightRank = getBookingPriorityRank(right, now)

  if (leftRank !== rightRank) {
    return leftRank - rightRank
  }

  const leftTime = parseBookingDateTime(left.date, left.time)?.getTime() || Number.POSITIVE_INFINITY
  const rightTime = parseBookingDateTime(right.date, right.time)?.getTime() || Number.POSITIVE_INFINITY

  if (leftTime !== rightTime) {
    return leftTime - rightTime
  }

  return (Number(right.id) || 0) - (Number(left.id) || 0)
})

const sortOrdersForOperations = (orders) => [...orders].sort((left, right) => {
  const leftTone = getOrderStatusTone(left.status)
  const rightTone = getOrderStatusTone(right.status)
  const toneRank = { warning: 0, neutral: 1, success: 2, danger: 3 }

  if (toneRank[leftTone] !== toneRank[rightTone]) {
    return toneRank[leftTone] - toneRank[rightTone]
  }

  return (Number(right.id) || 0) - (Number(left.id) || 0)
})

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

  const now = useMemo(() => new Date(), [bookings, orders, dayFilter, shiftFilter])
  const scopeLabel = useMemo(() => getOverviewScopeLabel(dayFilter, shiftFilter), [dayFilter, shiftFilter])

  const filteredBookings = useMemo(
    () => bookings.filter((booking) => matchesDayFilter(booking, dayFilter, now) && matchesShiftFilter(booking, shiftFilter)),
    [bookings, dayFilter, shiftFilter, now],
  )

  const bookingQueue = useMemo(() => sortBookingsForOperations(filteredBookings, now), [filteredBookings, now])
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
  const upcomingSoonBookings = useMemo(
    () => activeBookings.filter((booking) => {
      const bookingTime = parseBookingDateTime(booking.date, booking.time)
      if (!bookingTime) return false

      const diff = bookingTime.getTime() - now.getTime()
      return diff >= 0 && diff <= 2 * 60 * 60 * 1000
    }),
    [activeBookings, now],
  )
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
              <div className="internal-dashboard-stack">
                <section className="host-stats-grid internal-kpi-grid">
                  <article className="host-stat-card internal-kpi-card">
                    <span>Booking đang theo dõi</span>
                    <strong>{activeBookings.length}</strong>
                    <p>{scopeLabel}</p>
                  </article>
                  <article className="host-stat-card internal-kpi-card">
                    <span>Chờ xác nhận</span>
                    <strong>{pendingBookings.length}</strong>
                    <p>Ưu tiên gọi lại và chốt bàn sớm.</p>
                  </article>
                  <article className="host-stat-card internal-kpi-card">
                    <span>Bàn đang phục vụ / giữ chỗ</span>
                    <strong>{tableSummary.reduce((sum, area) => sum + area.occupied, 0)}</strong>
                    <p>{busyAreas.length > 0 ? `${busyAreas.length} khu vực đang cao tải.` : 'Chưa có khu vực quá tải.'}</p>
                  </article>
                  <article className="host-stat-card internal-kpi-card">
                    <span>Đơn đang mở</span>
                    <strong>{openOrders.length}</strong>
                    <p>{formatCurrency(ordersSummary.revenue)} doanh thu ghi nhận.</p>
                  </article>
                </section>

                <section className="host-board-card internal-priority-board">
                  <div className="host-board-head">
                    <h2>Cần xử lý ngay</h2>
                    <span>{operationalAlerts} mục đang mở</span>
                  </div>

                  <div className="internal-priority-grid">
                    {urgentItems.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        className={`internal-priority-card tone-${item.tone}`}
                        onClick={item.action}
                      >
                        <span>{item.title}</span>
                        <strong>{item.value}</strong>
                        <p>{item.detail}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="internal-operations-grid">
                  <article className={`host-board-card internal-operations-card ${bookingQueue.length === 0 ? 'internal-board-card-compact internal-operations-card-empty' : ''}`}>
                    <div className="host-board-head">
                      <h2>Booking ưu tiên</h2>
                      <span>{scopeLabel}</span>
                    </div>

                    {bookingQueue.length === 0 ? (
                      <div className="host-empty-state internal-empty-state-compact">Chưa có booking phù hợp với bộ lọc hiện tại.</div>
                    ) : (
                      <div className="internal-board-list">
                        {bookingQueue.slice(0, 4).map((booking) => (
                          <article key={booking.id} className="internal-board-item">
                            <div className="internal-board-item-top">
                              <div>
                                <strong>{booking.bookingCode || `DB-${booking.id}`}</strong>
                                <p>{booking.name} · {formatGuests(booking.guests)}</p>
                              </div>
                              <span className={`status-chip tone-${getBookingStatusTone(booking.status)}`}>
                                {HOST_BOOKING_STATUS_LABELS[booking.status] || booking.status}
                              </span>
                            </div>
                            <div className="profile-list-meta internal-board-meta">
                              <p><span>Thời gian</span><strong>{formatDateTime(booking.date, booking.time)}</strong></p>
                              <p><span>Khu vực</span><strong>{getSeatingLabel(booking.seatingArea)}</strong></p>
                            </div>
                            {(getBookingPriorityNote(booking) || booking.notes) && (
                              <p className="internal-board-note">{getBookingPriorityNote(booking) || booking.notes}</p>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </article>

                  <article className={`host-board-card internal-operations-card ${openOrders.length === 0 ? 'internal-board-card-compact internal-operations-card-empty' : ''}`}>
                    <div className="host-board-head">
                      <h2>Đơn đang xử lý</h2>
                      <span>{openOrders.length} đơn mở</span>
                    </div>

                    {openOrders.length === 0 ? (
                      <div className="host-empty-state internal-empty-state-compact">Không có đơn mở cần xử lý.</div>
                    ) : (
                      <div className="internal-board-list">
                        {openOrders.slice(0, 4).map((order) => (
                          <article key={order.id} className="internal-board-item">
                            <div className="internal-board-item-top">
                              <div>
                                <strong>DH-{String(order.id).slice(-6)}</strong>
                                <p>{order.customer?.fullName || 'Khách lẻ'}</p>
                              </div>
                              <span className={`status-chip tone-${getOrderStatusTone(order.status)}`}>
                                {order.status || 'Mới đặt'}
                              </span>
                            </div>
                            <div className="profile-list-meta internal-board-meta">
                              <p><span>Ngày tạo</span><strong>{formatDate(order.orderDate)}</strong></p>
                              <p><span>Tổng tiền</span><strong>{formatCurrency(order.total)}</strong></p>
                            </div>
                            {order.note && <p className="internal-board-note">{order.note}</p>}
                          </article>
                        ))}
                      </div>
                    )}
                  </article>

                  <article className="host-board-card internal-operations-card internal-table-pressure-card">
                    <div className="host-board-head">
                      <h2>Áp lực bàn ăn</h2>
                      <span>{busyAreas.length} khu vực cần chú ý</span>
                    </div>

                    <div className="internal-board-list internal-board-list-scroll">
                      {compactTableSummary.map((area) => (
                        <article key={area.id} className="internal-board-item">
                          <div className="internal-board-item-top">
                            <strong>{area.name}</strong>
                            <span className={`status-chip tone-${area.occupancyRate >= 0.75 ? 'danger' : area.occupancyRate >= 0.5 ? 'warning' : 'success'}`}>
                              {area.available}/{area.total} bàn trống
                            </span>
                          </div>
                          <p className="internal-board-note">
                            {area.occupied} bàn đang phục vụ hoặc được giữ chỗ.
                          </p>
                        </article>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="internal-secondary-grid">
                  <article className="host-board-card">
                    <div className="host-board-head">
                      <h2>Doanh thu ghi nhận</h2>
                      <span>Theo đơn hiện có</span>
                    </div>
                    <div className="internal-revenue-card">
                      <strong>{formatCurrency(ordersSummary.revenue)}</strong>
                      <p>
                        Theo dõi nhanh doanh thu và số đơn đang mở để cân đối phục vụ theo ca.
                      </p>
                    </div>
                  </article>

                  {isAdmin ? (
                    <article className="host-board-card">
                      <div className="host-board-head">
                        <h2>Tổ chức nội bộ</h2>
                        <span>{accountsSummary.admins + accountsSummary.staffs} tài khoản nội bộ</span>
                      </div>
                      <div className="internal-overview-list">
                        <div className="internal-overview-item">
                          <span>Quản trị viên</span>
                          <strong>{accountsSummary.admins}</strong>
                        </div>
                        <div className="internal-overview-item">
                          <span>Nhân viên vận hành</span>
                          <strong>{accountsSummary.staffs}</strong>
                        </div>
                        <div className="internal-overview-item">
                          <span>Booking đã xác nhận</span>
                          <strong>{confirmedBookings.length}</strong>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <article className="host-board-card">
                      <div className="host-board-head">
                        <h2>Tóm tắt ca làm</h2>
                        <span>Ưu tiên cho staff</span>
                      </div>
                      <div className="internal-overview-list">
                        <div className="internal-overview-item">
                          <span>Khách sắp đến</span>
                          <strong>{upcomingSoonBookings.length}</strong>
                        </div>
                        <div className="internal-overview-item">
                          <span>Booking đã check-in</span>
                          <strong>{checkedInBookings}</strong>
                        </div>
                        <div className="internal-overview-item">
                          <span>Bàn sắp kín</span>
                          <strong>{busyAreas.length}</strong>
                        </div>
                      </div>
                    </article>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <section className="host-board-card">
                <div className="host-board-head">
                  <h2>Danh sách booking</h2>
                  <span>{bookingQueue.length} yêu cầu · {scopeLabel}</span>
                </div>

                {bookingQueue.length === 0 ? (
                  <div className="host-empty-state">Chưa có booking phù hợp với bộ lọc hiện tại.</div>
                ) : (
                  <div className="host-booking-list">
                    {bookingQueue.map((booking) => (
                      <article key={booking.id} className="host-booking-card">
                        <div className="host-booking-top">
                          <div>
                            <strong>{booking.bookingCode || `DB-${booking.id}`}</strong>
                            <p>{booking.name} · {booking.phone}</p>
                          </div>
                          <span className={`status-chip tone-${getBookingStatusTone(booking.status)}`}>
                            {HOST_BOOKING_STATUS_LABELS[booking.status] || booking.status}
                          </span>
                        </div>

                        <div className="host-booking-meta">
                          <p><span>Ngày giờ</span><strong>{formatDateTime(booking.date, booking.time)}</strong></p>
                          <p><span>Số khách</span><strong>{formatGuests(booking.guests)}</strong></p>
                          <p><span>Khu vực</span><strong>{getSeatingLabel(booking.seatingArea)}</strong></p>
                          <p><span>Kênh xác nhận</span><strong>{getChannelLabel(booking.confirmationChannel)}</strong></p>
                        </div>

                        {needsManualConfirmation(booking) && (
                          <p className="host-booking-note host-booking-note-priority">
                            {getBookingPriorityNote(booking) || 'Booking này cần host xác nhận trước khi chốt bàn.'}
                          </p>
                        )}
                        {booking.notes && <p className="host-booking-note">Ghi chú: {booking.notes}</p>}

                        <div className="host-booking-actions">
                          {bookingStatusActions.map((actionStatus) => (
                            <button
                              key={actionStatus}
                              type="button"
                              className={`host-action-btn ${booking.status === actionStatus ? 'active' : ''}`}
                              onClick={() => handleUpdateStatus(booking.id, actionStatus)}
                            >
                              {HOST_BOOKING_STATUS_LABELS[actionStatus]}
                            </button>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'orders' && (
              <article className="profile-card">
                <div className="host-board-head">
                  <h2>Đơn đang mở</h2>
                  <span>{orders.length} đơn</span>
                </div>

                <div className="profile-list internal-list-top-gap">
                  {orders.length === 0 && (
                    <div className="profile-list-item">
                      <p className="booking-empty">Chưa có đơn hàng nào.</p>
                    </div>
                  )}

                  {sortOrdersForOperations(orders).map((order) => (
                    <div key={order.id} className="profile-list-item">
                      <div className="profile-list-top">
                        <strong>DH-{String(order.id).slice(-6)}</strong>
                        <span className={`status-chip tone-${getOrderStatusTone(order.status)}`}>{order.status || 'Mới đặt'}</span>
                      </div>

                      <div className="profile-list-meta internal-order-meta">
                        <p><span>Khách hàng</span><strong>{order.customer?.fullName || 'Khách lẻ'}</strong></p>
                        <p><span>Ngày tạo</span><strong>{formatDate(order.orderDate)}</strong></p>
                        <p><span>Tổng tiền</span><strong>{formatCurrency(order.total)}</strong></p>
                        <p><span>Thanh toán</span><strong>{order.paymentMethod || 'Chưa chọn'}</strong></p>
                      </div>

                      {order.note && <p className="host-booking-note">Ghi chú đơn: {order.note}</p>}
                    </div>
                  ))}
                </div>
              </article>
            )}

            {activeTab === 'tables' && (
              <article className="profile-card">
                <div className="host-board-head">
                  <h2>Tình trạng bàn ăn</h2>
                  <span>{scopeLabel}</span>
                </div>

                <div className="internal-table-grid">
                  {tableSummary.map((area) => (
                    <article key={area.id} className="host-stat-card internal-table-card">
                      <span>{area.name}</span>
                      <strong>{area.available}/{area.total}</strong>
                      <p className="internal-table-note">
                        {area.occupied} bàn đang phục vụ hoặc được giữ chỗ.
                      </p>
                    </article>
                  ))}
                </div>
              </article>
            )}

            {activeTab === 'accounts' && isAdmin && (
              <article className="profile-card">
                <div className="host-board-head">
                  <h2>Quản trị tài khoản và phân quyền</h2>
                  <span>{accounts.length} tài khoản</span>
                </div>

                <div className="profile-list internal-list-top-gap">
                  {accounts.map((account) => (
                    <div key={`${account.username}-${account.email}`} className="profile-list-item">
                      <div className="profile-list-top">
                        <strong>{account.fullName || account.username}</strong>
                        <span className={`status-chip tone-${account.role === 'admin' ? 'success' : account.role === 'staff' ? 'warning' : 'neutral'}`}>
                          {account.role === 'admin' ? 'Admin' : account.role === 'staff' ? 'Staff' : 'Customer'}
                        </span>
                      </div>

                      <div className="profile-list-meta">
                        <p><span>Tài khoản</span><strong>{account.username || '--'}</strong></p>
                        <p><span>Email</span><strong>{account.email || '--'}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default InternalDashboardPage
