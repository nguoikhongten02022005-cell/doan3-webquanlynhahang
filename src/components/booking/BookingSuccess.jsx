import { formatDateDisplay, getBookingStatusMessage, getPolicyItems, getSeatSummaryText } from '../../utils/booking/index'

function BookingSuccess({ bookingCode, bookingStatus, formData, guestCount, successHeading, successStatusLabel, onGoHome, onGoProfile }) {
  return (
    <div className="booking-success booking-success-premium">
      <div className="success-icon">✓</div>
      <p className="booking-side-kicker">Kết quả booking</p>
      <h3>{successHeading}</h3>
      <div className="success-booking-code">
        <span className="code-label">Mã đặt bàn</span>
        <span className="code-value">{bookingCode}</span>
      </div>
      <div className="success-status">
        <span className="status-badge status-pending">{successStatusLabel}</span>
      </div>

      <div className="booking-success-grid">
        <div className="booking-success-item"><span>Ngày dùng bữa</span><strong>{formatDateDisplay(formData.date)}</strong></div>
        <div className="booking-success-item"><span>Khung giờ phục vụ</span><strong>{formData.time}</strong></div>
        <div className="booking-success-item"><span>Số khách</span><strong>{formData.guests} khách</strong></div>
        <div className="booking-success-item"><span>Khu vực</span><strong>{getSeatSummaryText(formData.seatingArea)}</strong></div>
        <div className="booking-success-item"><span>Khách liên hệ</span><strong>{formData.name}</strong></div>
        <div className="booking-success-item"><span>Số điện thoại</span><strong>{formData.phone}</strong></div>
      </div>

      <p className="success-note success-note-premium">
        {getBookingStatusMessage(bookingStatus, formData.seatingArea)}
      </p>

      <div className="booking-policy-notes booking-policy-notes-premium">
        {getPolicyItems(guestCount, formData.seatingArea, formData.time).map((item) => (
          <div className="policy-item" key={item.text}>
            <span className="policy-icon">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <div className="booking-success-actions">
        <button type="button" className="booking-secondary-btn" onClick={onGoProfile}>Xem trong hồ sơ</button>
        <button type="button" className="booking-primary-btn" onClick={onGoHome}>Về trang chủ</button>
      </div>
    </div>
  )
}

export default BookingSuccess
