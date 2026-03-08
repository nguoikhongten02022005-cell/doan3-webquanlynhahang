import { useEffect, useMemo, useState } from 'react'
import {
  BOOKING_SEATING_LABELS,
  HOST_BOOKING_STATUS_ACTIONS,
  HOST_BOOKING_STATUS_LABELS,
} from '../data/bookingData'
import { BOOKING_DATA_CHANGED_EVENT, useBooking } from '../hooks/useBooking'

const formatDateTime = (date, time) => {
  if (!date) return '--'

  const [year, month, day] = String(date).split('-')
  if (!year || !month || !day) return `${date} ${time || ''}`.trim()

  return `${day}/${month}/${year} ${time || ''}`.trim()
}

const getSeatingLabel = (value) => BOOKING_SEATING_LABELS[value] || value || 'Không ưu tiên'
const isVipBooking = (booking) => booking.seatingArea === 'PHONG_VIP'
const needsManualConfirmation = (booking) => booking.status === 'CHO_XAC_NHAN' || booking.status === 'YEU_CAU_DAT_BAN' || booking.status === 'CAN_GOI_LAI' || isVipBooking(booking)

const getChannelLabel = (channel) => {
  if (Array.isArray(channel) && channel.length > 0) return channel.join(' / ')
  return 'SMS'
}

const getStatusTone = (status) => {
  if (status === 'DA_HUY' || status === 'TU_CHOI_HET_CHO') return 'danger'
  if (status === 'DA_XAC_NHAN' || status === 'DA_GHI_NHAN' || status === 'DA_HOAN_THANH' || status === 'GIU_CHO_TAM') return 'success'
  return 'warning'
}

const getBookingPriorityNote = (booking) => {
  if (isVipBooking(booking)) return 'Ưu tiên xác nhận thủ công do yêu cầu VIP / phòng riêng.'
  if (booking.status === 'CAN_GOI_LAI') return 'Booking này cần gọi lại để chốt tình trạng chỗ trống hoặc điều kiện phục vụ.'
  if (booking.seatingArea === 'BAN_CONG') return 'Kiểm tra thời tiết trước khi chốt vị trí ban công.'
  return ''
}

const formatGuests = (guests) => `${guests} khách`

function HostDashboardPage() {
  const { bookingStatusActions, getHostBookings, getHostStats, sortHostBookings, updateHostBookingStatus } = useBooking()
  const [bookings, setBookings] = useState(() => getHostBookings())

  useEffect(() => {
    const reloadBookings = () => {
      setBookings(getHostBookings())
    }

    const handleStorage = (event) => {
      if (event.key && event.key !== 'restaurant_bookings' && event.key !== 'restaurant_reception_queue') {
        return
      }

      reloadBookings()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(BOOKING_DATA_CHANGED_EVENT, reloadBookings)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(BOOKING_DATA_CHANGED_EVENT, reloadBookings)
    }
  }, [getHostBookings])

  const stats = useMemo(() => getHostStats(bookings), [bookings, getHostStats])

  const sortedBookings = useMemo(() => sortHostBookings(bookings), [bookings, sortHostBookings])

  const handleUpdateStatus = (bookingId, nextStatus) => {
    setBookings((currentBookings) => updateHostBookingStatus(currentBookings, bookingId, nextStatus))
  }

  return (
    <div className="host-dashboard-page">
      <div className="container host-dashboard-shell">
        <header className="host-dashboard-header">
          <p className="booking-side-kicker">Lễ tân / Host</p>
          <h1>Dashboard đặt bàn</h1>
          <p>Theo dõi booking mới, xác nhận yêu cầu VIP và cập nhật trạng thái phục vụ.</p>
        </header>

        <section className="host-stats-grid">
          <article className="host-stat-card">
            <span>Tổng booking</span>
            <strong>{stats.total}</strong>
          </article>
          <article className="host-stat-card">
            <span>Chờ xác nhận</span>
            <strong>{stats.pending}</strong>
          </article>
          <article className="host-stat-card">
            <span>Đã ghi nhận / xác nhận</span>
            <strong>{stats.confirmed}</strong>
          </article>
          <article className="host-stat-card">
            <span>Yêu cầu VIP</span>
            <strong>{stats.vip}</strong>
          </article>
        </section>

        <section className="host-board-card">
          <div className="host-board-head">
            <h2>Danh sách booking</h2>
            <span>{sortedBookings.length} yêu cầu</span>
          </div>

          {sortedBookings.length === 0 ? (
            <div className="host-empty-state">Chưa có booking nào từ website.</div>
          ) : (
            <div className="host-booking-list">
              {sortedBookings.map((booking) => (
                <article key={booking.id} className="host-booking-card">
                  <div className="host-booking-top">
                    <div>
                      <strong>{booking.bookingCode || `DB-${booking.id}`}</strong>
                      <p>{booking.name} · {booking.phone}</p>
                    </div>
                    <span className={`status-chip tone-${getStatusTone(booking.status)}`}>
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
                    <p className="host-booking-note host-booking-note-priority">{getBookingPriorityNote(booking) || 'Booking này cần host xác nhận trước khi chốt bàn.'}</p>
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
      </div>
    </div>
  )
}

export default HostDashboardPage