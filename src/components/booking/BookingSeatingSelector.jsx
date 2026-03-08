import { BOOKING_SEATING_AREAS } from '../../data/bookingData'
import { getSeatDisabledHint, getSeatOperationalNote, shouldDisableSeatOption } from '../../utils/booking'

function BookingSeatingSelector({ formData, guestCount, handleSeatingSelect, selectedSeatOperationalNote }) {
  return (
    <section className={`booking-editorial-card booking-seating-section ${formData.time ? '' : 'is-disabled'}`}>
      <div className="booking-section-head">
        <div>
          <p className="booking-side-kicker">Ưu tiên chỗ ngồi</p>
          <h3>Ưu tiên chỗ ngồi</h3>
        </div>
        <span className="booking-inline-note">Tùy chọn</span>
      </div>

      <p className="booking-field-note booking-seat-disclaimer">Nhà hàng sẽ cố gắng sắp xếp theo yêu cầu, tùy tình trạng bàn thực tế tại thời điểm xác nhận.</p>

      {!formData.time ? (
        <div className="booking-seat-note-banner"><strong>Chọn giờ trước:</strong> Chọn giờ trước để xem ưu tiên chỗ ngồi khả dụng.</div>
      ) : (
        <>
          <div className="booking-seat-note-banner"><strong>Lưu ý vận hành:</strong> {selectedSeatOperationalNote}</div>

          <div className="booking-seating-grid-premium">
            {BOOKING_SEATING_AREAS.map((area) => {
              const disabled = shouldDisableSeatOption(area.value, guestCount)
              const isSelected = formData.seatingArea === area.value
              const disabledHint = getSeatDisabledHint(area.value, guestCount)

              return (
                <label key={area.value} className={`seating-area-option booking-seat-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}>
                  <input type="radio" name="seatingArea" value={area.value} checked={isSelected} onChange={() => handleSeatingSelect(area.value)} disabled={disabled} />
                  <div className="booking-seat-card-top">
                    <span className="seating-area-icon">{area.icon}</span>
                    <span className="booking-seat-status">{isSelected ? 'Đang ưu tiên' : 'Có thể chọn'}</span>
                  </div>
                  <span className="seating-area-name">{area.label}</span>
                  <span className="seating-area-desc">{area.desc}</span>
                  <span className="booking-seat-note">{getSeatOperationalNote(area.value)}</span>
                  {disabled && <span className="seating-area-limit">{disabledHint}</span>}
                </label>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

export default BookingSeatingSelector
