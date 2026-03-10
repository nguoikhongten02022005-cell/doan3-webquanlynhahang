import { HOST_BOOKING_STATUS_LABELS } from '../../data/bookingData'
import { formatCurrency } from '../../utils/currency'
import {
  formatDate,
  formatDateTime,
  formatGuests,
  getBookingStatusTone,
  getOrderStatusTone,
  getSeatingLabel,
} from '../../pages/internalDashboard/formatters'
import { getBookingPriorityNote } from '../../pages/internalDashboard/selectors'

function OverviewTab({
  activeBookings,
  bookingQueue,
  checkedInBookings,
  confirmedBookings,
  isAdmin,
  openOrders,
  operationalAlerts,
  ordersSummary,
  pendingBookings,
  scopeLabel,
  tableSummary,
  tableInventorySummary,
  upcomingSoonBookings,
  unassignedBookings,
  urgentItems,
  accountsSummary,
}) {
  return (
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
          <strong>{tableInventorySummary.occupied + tableInventorySummary.held}</strong>
          <p>{tableInventorySummary.available} bàn còn sẵn sàng nhận khách.</p>
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
                  <p className="internal-board-note">
                    {booking.assignedTables?.length > 0
                      ? `Bàn: ${booking.assignedTables.map((table) => table.code).join(', ')}`
                      : 'Chưa gán bàn cụ thể.'}
                  </p>
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
            <span>{tableInventorySummary.dirty + unassignedBookings.length} điểm cần chú ý</span>
          </div>

          <div className="internal-board-list internal-board-list-scroll">
            {tableSummary.map((area) => (
              <article key={area.id} className="internal-board-item">
                <div className="internal-board-item-top">
                  <strong>{area.name}</strong>
                  <span className={`status-chip tone-${area.occupancyRate >= 0.75 ? 'danger' : area.occupancyRate >= 0.5 ? 'warning' : 'success'}`}>
                    {area.available}/{area.total} bàn trống
                  </span>
                </div>
                <p className="internal-board-note">
                  {area.occupied} đang phục vụ · {area.held} giữ chỗ · {area.dirty} đang dọn.
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
                <span>Chưa gán bàn</span>
                <strong>{unassignedBookings.length}</strong>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

export default OverviewTab
