import { useMemo, useState } from 'react'

const formatDateTime = (date, time) => {
  if (!date) return '--'
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return `${date} ${time || ''}`.trim()
  return `${parsedDate.toLocaleDateString('vi-VN')} ${time || ''}`.trim()
}

const seatingLabels = {
  KHONG_UU_TIEN: 'Không ưu tiên',
  SANH_CHINH: 'Sảnh chính',
  PHONG_VIP: 'Phòng riêng / VIP',
  BAN_CONG: 'Ban công / ngoài trời',
  QUAY_BAR: 'Quầy bar',
}

const getSeatingLabel = (value) => seatingLabels[value] || value || 'Không ưu tiên'
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

const readQueueStatuses = () => {
  const raw = localStorage.getItem('restaurant_reception_queue')
  if (!raw) return new Map()

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Map()
    return new Map(parsed.map((item) => [item.bookingCode, item.status]))
  } catch {
    return new Map()
  }
}

const normalizeBookings = (bookings) => {
  const queueStatusMap = readQueueStatuses()

  return bookings.map((booking) => {
    const queueStatus = queueStatusMap.get(booking.bookingCode)
    return queueStatus && queueStatus !== booking.status
      ? { ...booking, status: queueStatus }
      : booking
  })
}

const statusLabels = {
  YEU_CAU_DAT_BAN: 'Yêu cầu đặt bàn',
  GIU_CHO_TAM: 'Đã giữ chỗ tạm',
  DA_XAC_NHAN: 'Đã xác nhận',
  CAN_GOI_LAI: 'Cần gọi lại',
  TU_CHOI_HET_CHO: 'Từ chối / hết chỗ',
  CHO_XAC_NHAN: 'Chờ xác nhận',
  DA_GHI_NHAN: 'Đã ghi nhận',
  DA_HOAN_THANH: 'Đã hoàn thành',
  DA_HUY: 'Đã hủy',
}

const statusActions = ['YEU_CAU_DAT_BAN', 'GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'TU_CHOI_HET_CHO']

const syncBookingsToQueue = (bookings) => {
  localStorage.setItem('restaurant_bookings', JSON.stringify(bookings))

  const queueString = localStorage.getItem('restaurant_reception_queue')
  if (!queueString) return

  try {
    const queue = JSON.parse(queueString)
    if (!Array.isArray(queue)) return

    const nextQueue = queue.map((item) => {
      const matchedBooking = bookings.find((booking) => item.bookingCode === booking.bookingCode)
      return matchedBooking ? { ...item, status: matchedBooking.status } : item
    })

    localStorage.setItem('restaurant_reception_queue', JSON.stringify(nextQueue))
  } catch {
    // noop
  }
}

const updateStatus = (bookings, bookingId, nextStatus) => {
  const nextBookings = bookings.map((booking) => (
    String(booking.id) === String(bookingId)
      ? { ...booking, status: nextStatus }
      : booking
  ))

  syncBookingsToQueue(nextBookings)
  return normalizeBookings(nextBookings)
}

const readBookings = () => {
  const raw = localStorage.getItem('restaurant_bookings')
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? normalizeBookings(parsed) : []
  } catch {
    return []
  }
}

function HostDashboardPage() {
  const [bookings, setBookings] = useState(() => readBookings())

  const stats = useMemo(() => {
    const total = bookings.length
    const pending = bookings.filter((item) => item.status === 'YEU_CAU_DAT_BAN' || item.status === 'CAN_GOI_LAI' || item.status === 'CHO_XAC_NHAN').length
    const confirmed = bookings.filter((item) => item.status === 'DA_XAC_NHAN' || item.status === 'DA_GHI_NHAN' || item.status === 'GIU_CHO_TAM').length
    const vip = bookings.filter((item) => isVipBooking(item)).length

    return { total, pending, confirmed, vip }
  }, [bookings])

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)),
    [bookings],
  )

  const handleUpdateStatus = (bookingId, nextStatus) => {
    setBookings((currentBookings) => updateStatus(currentBookings, bookingId, nextStatus))
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
                      {statusLabels[booking.status] || booking.status}
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
                    {statusActions.map((actionStatus) => (
                      <button
                        key={actionStatus}
                        type="button"
                        className={`host-action-btn ${booking.status === actionStatus ? 'active' : ''}`}
                        onClick={() => handleUpdateStatus(booking.id, actionStatus)}
                      >
                        {statusLabels[actionStatus]}
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