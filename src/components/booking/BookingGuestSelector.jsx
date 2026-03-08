import { BOOKING_GUEST_OPTIONS } from '../../data/bookingData'
import { LARGE_GROUP_GUEST_COUNT, LARGE_GROUP_HOTLINE_MESSAGE, ONLINE_BOOKING_MAX_GUESTS } from '../../utils/booking'

function BookingGuestSelector({ formData, guestCount, guestWarning, inlineErrors, onGuestSelect, serviceHotlineLink }) {
  return (
    <section className="booking-editorial-card booking-editorial-card-highlight">
      <div className="booking-section-head">
        <div>
          <p className="booking-side-kicker">Số lượng khách</p>
          <h3>Chọn số khách</h3>
        </div>
        <span className="booking-inline-note">Đặt online tối đa {ONLINE_BOOKING_MAX_GUESTS} khách</span>
      </div>

      <div className="booking-guest-grid">
        {BOOKING_GUEST_OPTIONS.map((num) => (
          <button
            key={num}
            type="button"
            className={`booking-guest-card ${formData.guests === String(num === '10+' ? LARGE_GROUP_GUEST_COUNT : num) ? 'selected' : ''} ${num !== '10+' && num >= 8 ? 'is-large' : ''} ${num === '10+' ? 'is-hotline' : ''}`}
            onClick={() => onGuestSelect(num)}
          >
            <strong>{num}</strong>
            <span>{num === '10+' ? 'liên hệ hotline' : 'khách'}</span>
          </button>
        ))}
      </div>

      {inlineErrors.guests && <p className="form-error-inline booking-inline-alert">{inlineErrors.guests}</p>}
      {guestWarning && !inlineErrors.guests && <p className="booking-field-note">{guestWarning}</p>}

      {guestCount > ONLINE_BOOKING_MAX_GUESTS && (
        <div className="booking-hotline-hint booking-hotline-panel">
          <strong>Online booking đang tạm dừng cho nhóm trên {ONLINE_BOOKING_MAX_GUESTS} khách</strong>
          <p>{LARGE_GROUP_HOTLINE_MESSAGE}</p>
          <a href={serviceHotlineLink} className="btn btn-primary">Gọi hotline đặt bàn</a>
        </div>
      )}
    </section>
  )
}

export default BookingGuestSelector
