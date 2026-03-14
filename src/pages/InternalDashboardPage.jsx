import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountsTab from '../components/internalDashboard/AccountsTab'
import BookingsTab from '../components/internalDashboard/BookingsTab'
import DishesTab from '../components/internalDashboard/DishesTab'
import OrdersTab from '../components/internalDashboard/OrdersTab'
import OverviewTab from '../components/internalDashboard/OverviewTab'
import TablesTab from '../components/internalDashboard/TablesTab'
import { useAuth } from '../hooks/useAuth'
import { DAY_FILTERS, INTERNAL_TABS, SHIFT_FILTERS } from '../features/internalDashboard/constants'
import { getOverviewScopeLabel, matchesDayFilter, matchesShiftFilter } from '../features/internalDashboard/selectors'
import { useInternalDashboardData } from '../features/internalDashboard/useInternalDashboardData'

function InternalDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, isAdmin } = useAuth()
  const [tabDangMo, setTabDangMo] = useState('overview')
  const [boLocNgay, setBoLocNgay] = useState('all')
  const [boLocCa, setBoLocCa] = useState('all')
  const {
    accountsSummary,
    activeBookings,
    bookingQueue,
    confirmedBookings,
    danhSachBan,
    danhSachDatBan,
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
    upcomingSoonBookings,
    unassignedBookings,
  } = useInternalDashboardData()

  useEffect(() => {
    if (!isAdmin && (tabDangMo === 'accounts' || tabDangMo === 'dishes')) {
      setTabDangMo('overview')
    }
  }, [tabDangMo, isAdmin])

  const visibleTabs = useMemo(
    () => INTERNAL_TABS.filter((tab) => !tab.adminOnly || isAdmin),
    [isAdmin],
  )

  const scopeLabel = useMemo(() => getOverviewScopeLabel(boLocNgay, boLocCa), [boLocNgay, boLocCa])

  const danhSachDatBanDaLoc = useMemo(() => {
    const now = new Date()
    return danhSachDatBan.filter((booking) => matchesDayFilter(booking, boLocNgay, now) && matchesShiftFilter(booking, boLocCa))
  }, [danhSachDatBan, boLocCa, boLocNgay])

  const bookingQueueDaLoc = useMemo(
    () => bookingQueue.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [bookingQueue, danhSachDatBanDaLoc],
  )

  const activeBookingsDaLoc = useMemo(
    () => activeBookings.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [activeBookings, danhSachDatBanDaLoc],
  )

  const confirmedBookingsDaLoc = useMemo(
    () => confirmedBookings.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [confirmedBookings, danhSachDatBanDaLoc],
  )

  const pendingBookingsDaLoc = useMemo(
    () => pendingBookings.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [pendingBookings, danhSachDatBanDaLoc],
  )

  const upcomingSoonBookingsDaLoc = useMemo(
    () => upcomingSoonBookings.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [upcomingSoonBookings, danhSachDatBanDaLoc],
  )

  const checkedInBookingsDaLoc = useMemo(
    () => danhSachDatBanDaLoc.filter((booking) => booking.status === 'DA_CHECK_IN' || booking.status === 'DA_XEP_BAN').length,
    [danhSachDatBanDaLoc],
  )

  const unassignedBookingsDaLoc = useMemo(
    () => unassignedBookings.filter((booking) => danhSachDatBanDaLoc.some((item) => item.id === booking.id)),
    [unassignedBookings, danhSachDatBanDaLoc],
  )

  const urgentItems = useMemo(
    () => [
      {
        key: 'pending-bookings',
        title: 'Chờ xác nhận',
        value: pendingBookingsDaLoc.length,
        detail: pendingBookingsDaLoc.length > 0 ? 'Ưu tiên gọi lại và chốt bàn.' : 'Không có booking chờ xử lý.',
        tone: pendingBookingsDaLoc.length > 0 ? 'warning' : 'neutral',
        action: () => setTabDangMo('bookings'),
      },
      {
        key: 'unassigned-bookings',
        title: 'Chưa gán bàn',
        value: unassignedBookingsDaLoc.length,
        detail: unassignedBookingsDaLoc.length > 0 ? 'Cần phân bàn trước giờ khách đến.' : 'Các booking đang có bàn phù hợp.',
        tone: unassignedBookingsDaLoc.length > 0 ? 'danger' : 'neutral',
        action: () => setTabDangMo('bookings'),
      },
      {
        key: 'arriving-soon',
        title: 'Khách sắp đến 2 giờ',
        value: upcomingSoonBookingsDaLoc.length,
        detail: upcomingSoonBookingsDaLoc.length > 0 ? 'Kiểm tra bàn, host và ghi chú đặc biệt.' : 'Chưa có lượt đến gần trong 2 giờ tới.',
        tone: upcomingSoonBookingsDaLoc.length > 0 ? 'success' : 'neutral',
        action: () => setTabDangMo('bookings'),
      },
      {
        key: 'dirty-tables',
        title: 'Bàn cần dọn',
        value: tableInventorySummary.dirty,
        detail: tableInventorySummary.dirty > 0 ? 'Cần làm sạch trước khi nhận lượt mới.' : 'Không có bàn đang dọn.',
        tone: tableInventorySummary.dirty > 0 ? 'warning' : 'neutral',
        action: () => setTabDangMo('tables'),
      },
    ],
    [pendingBookingsDaLoc.length, tableInventorySummary.dirty, unassignedBookingsDaLoc.length, upcomingSoonBookingsDaLoc.length],
  )

  const operationalAlerts = pendingBookingsDaLoc.length + unassignedBookingsDaLoc.length + upcomingSoonBookingsDaLoc.length + tableInventorySummary.dirty

  const handleCreateBooking = () => {
    setTabDangMo('bookings')
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
                    className={`internal-pill ${boLocNgay === filter.key ? 'active' : ''}`}
                    onClick={() => setBoLocNgay(filter.key)}
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
                    className={`internal-pill ${boLocCa === filter.key ? 'active' : ''}`}
                    onClick={() => setBoLocCa(filter.key)}
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
                <button type="button" className="internal-quick-btn" onClick={() => setTabDangMo('tables')}>
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
                className={`profile-tab-btn ${tabDangMo === tab.key ? 'active' : ''}`}
                onClick={() => setTabDangMo(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <section className="internal-dashboard-content">
            {tabDangMo === 'overview' && (
              <OverviewTab
                accountsSummary={accountsSummary}
                activeBookings={activeBookingsDaLoc}
                bookingQueue={bookingQueueDaLoc}
                checkedInBookings={checkedInBookingsDaLoc}
                confirmedBookings={confirmedBookingsDaLoc}
                isAdmin={isAdmin}
                openOrders={openOrders}
                operationalAlerts={operationalAlerts}
                ordersSummary={ordersSummary}
                pendingBookings={pendingBookingsDaLoc}
                scopeLabel={scopeLabel}
                tableInventorySummary={tableInventorySummary}
                tableSummary={tableSummary}
                upcomingSoonBookings={upcomingSoonBookingsDaLoc}
                unassignedBookings={unassignedBookingsDaLoc}
                urgentItems={urgentItems}
              />
            )}

            {tabDangMo === 'bookings' && (
              <BookingsTab
                bookingQueue={bookingQueueDaLoc}
                getAvailableTablesForBooking={(booking) => getAvailableTablesForBooking(booking, danhSachBan)}
                handleAssignTables={handleAssignTables}
                handleCheckIn={handleCheckIn}
                handleComplete={handleComplete}
                handleCreateInternalBooking={handleCreateInternalBooking}
                handleNoShow={handleNoShow}
                handleUpdateInternalBooking={handleUpdateInternalBooking}
                scopeLabel={scopeLabel}
              />
            )}

            {tabDangMo === 'orders' && (
              <OrdersTab orders={sortedOrders} />
            )}

            {tabDangMo === 'tables' && (
              <TablesTab
                handleMarkTableDirty={handleMarkTableDirty}
                handleMarkTableReady={handleMarkTableReady}
                scopeLabel={scopeLabel}
                tableInventorySummary={tableInventorySummary}
                tableSummary={tableSummary}
                tables={danhSachBan}
              />
            )}

            {tabDangMo === 'dishes' && isAdmin && (
              <DishesTab dishes={danhSachMon} reloadDishes={taiLaiDanhSachMon} />
            )}

            {tabDangMo === 'accounts' && isAdmin && (
              <AccountsTab accounts={danhSachTaiKhoan} />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default InternalDashboardPage
