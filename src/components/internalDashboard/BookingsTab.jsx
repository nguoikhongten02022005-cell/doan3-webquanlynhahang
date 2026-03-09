import { HOST_BOOKING_STATUS_LABELS } from '../../data/bookingData'
import { formatDateTime, formatGuests, getBookingStatusTone, getChannelLabel, getSeatingLabel } from '../../pages/internalDashboard/formatters'
import { getBookingPriorityNote, needsManualConfirmation } from '../../pages/internalDashboard/selectors'

function BookingsTab({ bookingQueue, bookingStatusActions, handleUpdateStatus, scopeLabel }) {
  return (
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
  )
}

export default BookingsTab
