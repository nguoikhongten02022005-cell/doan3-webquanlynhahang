import { BOOKING_SLOT_LEGEND } from '../../constants/bookingUi'
import { INVALID_DATE_HINT, LARGE_GROUP_HOTLINE_MESSAGE, ONLINE_BOOKING_MAX_GUESTS } from '../../utils/booking'

function BookingSlotPicker({
  availabilityPanelRef,
  firstAvailableSlotRef,
  firstAvailableSlotTime,
  formData,
  guestCount,
  handleSelectSuggestedTime,
  handleTimeSelect,
  inlineErrors,
  invalidPastDate,
  recommendedSlotTime,
  selectedTimeSuggestions,
  slotGroups,
  slotsLoading,
}) {
  return (
    <div className="booking-availability-panel" ref={availabilityPanelRef}>
      <div className="booking-availability-head">
        <div>
          <p className="booking-side-kicker">Khung giờ phục vụ khả dụng</p>
          <h4>Khung giờ phục vụ khả dụng</h4>
        </div>
        <div className="booking-slot-legend">
          {BOOKING_SLOT_LEGEND.map((item) => (
            <span key={item.key}><i className={`dot ${item.key}`} />{item.label}</span>
          ))}
        </div>
      </div>

      {!formData.guests ? (
        <div className="booking-slot-awaiting-card" aria-live="polite">
          <span className="booking-slot-awaiting-kicker">Sẵn sàng khi bạn bắt đầu</span>
          <strong>Chọn số khách trước để xem giờ trống.</strong>
        </div>
      ) : !formData.date ? (
        <div className="booking-slot-awaiting-card" aria-live="polite">
          <span className="booking-slot-awaiting-kicker">Bước tiếp theo</span>
          <strong>Chọn ngày dùng bữa để mở danh sách khung giờ.</strong>
        </div>
      ) : slotsLoading ? (
        <div className="timeslot-loading booking-placeholder-large"><div className="slot-loading-spinner" /><span>Đang kiểm tra khung giờ trống...</span></div>
      ) : invalidPastDate ? (
        <div className="timeslot-empty booking-placeholder-large"><span className="placeholder-icon">⚠️</span><span>{INVALID_DATE_HINT}</span></div>
      ) : guestCount > ONLINE_BOOKING_MAX_GUESTS ? (
        <div className="timeslot-empty booking-placeholder-large"><span className="placeholder-icon">📞</span><span>{LARGE_GROUP_HOTLINE_MESSAGE}</span></div>
      ) : (
        <>
          {slotGroups.map((group) => (
            <div key={group.key} className="timeslot-group booking-timeslot-group-premium">
              <span className="timeslot-group-label">{group.label}</span>
              <div className="timeslot-grid booking-timeslot-grid-premium">
                {group.slots.map((slot) => (
                  <button
                    key={slot.time}
                    ref={slot.time === firstAvailableSlotTime ? firstAvailableSlotRef : null}
                    type="button"
                    className={`timeslot-btn booking-slot-card ${formData.time === slot.time ? 'selected' : ''} ${slot.time === recommendedSlotTime && !formData.time ? 'recommended' : ''} ${slot.status}`}
                    onClick={() => handleTimeSelect(slot)}
                    disabled={slot.status === 'full'}
                  >
                    <span className="timeslot-time">{slot.time}</span>
                    <span className="timeslot-badge booking-slot-badge">{slot.note}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {inlineErrors.time && <p className="form-error-inline booking-inline-alert">{inlineErrors.time}</p>}

          {selectedTimeSuggestions.length > 0 && inlineErrors.time && (
            <div className="booking-slot-suggestions">
              <span>Gợi ý khung giờ thay thế gần nhất:</span>
              <div>
                {selectedTimeSuggestions.map((timeValue) => <button key={timeValue} type="button" onClick={() => handleSelectSuggestedTime(timeValue)}>{timeValue}</button>)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BookingSlotPicker
