import { BOOKING_NOTE_SUGGESTIONS, BOOKING_OCCASIONS } from '../../data/bookingData'
import { formatDateDisplay, getSeatSummaryText } from '../../utils/booking/index'

function BookingStepTwo({ formData, guestCount, inlineErrors, selectedMealDurationText, onBack, onChange, onNoteSuggestion }) {
  return (
    <div className="booking-step booking-step-premium">
      <section className="booking-editorial-card booking-summary-ribbon">
        <div className="booking-summary-inline">
          <span>{guestCount} khách</span>
          <span>{formatDateDisplay(formData.date)}</span>
          <span>{formData.time}</span>
          <span>{getSeatSummaryText(formData.seatingArea)}</span>
          {selectedMealDurationText && <span>{selectedMealDurationText}</span>}
        </div>
        <button type="button" className="summary-edit-btn" onClick={onBack}>Chỉnh sửa bước 1</button>
      </section>

      <section className="booking-editorial-card">
        <div className="booking-section-head">
          <div>
            <p className="booking-side-kicker">Thông tin liên hệ</p>
            <h3>Ai sẽ đến dùng bữa?</h3>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label" htmlFor="booking-name">Họ và tên</label>
            <input id="booking-name" type="text" name="name" className={`form-input ${inlineErrors.name ? 'form-input-error' : ''}`} placeholder="Nguyễn Văn A" value={formData.name} onChange={onChange} autoFocus />
            {inlineErrors.name && <span className="form-error-inline">{inlineErrors.name}</span>}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="booking-phone">Số điện thoại</label>
            <input id="booking-phone" type="tel" name="phone" className={`form-input ${inlineErrors.phone ? 'form-input-error' : ''}`} placeholder="0901 234 567" value={formData.phone} onChange={onChange} />
            {inlineErrors.phone ? <span className="form-error-inline">{inlineErrors.phone}</span> : <span className="booking-field-note">Nhà hàng sẽ dùng số này để xác nhận booking nếu cần.</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label" htmlFor="booking-email">Email (tùy chọn)</label>
            <input id="booking-email" type="email" name="email" className="form-input" placeholder="email@example.com" value={formData.email} onChange={onChange} />
            <span className="booking-field-note">Tùy chọn, dùng để nhận thông tin nếu cần.</span>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="booking-occasion">Dịp dùng bữa (tùy chọn)</label>
            <select id="booking-occasion" name="occasion" className="form-input" value={formData.occasion} onChange={onChange}>
              <option value="">Không có</option>
              {BOOKING_OCCASIONS.map((occ) => <option key={occ} value={occ}>{occ}</option>)}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="booking-notes">Ghi chú (tùy chọn)</label>
          <div className="booking-note-chips">
            {BOOKING_NOTE_SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} type="button" className="booking-note-chip" onClick={() => onNoteSuggestion(suggestion)}>{suggestion}</button>
            ))}
          </div>
          <textarea id="booking-notes" name="notes" className="form-textarea" placeholder="VD: Dị ứng thực phẩm, cần ghế em bé, muốn chỗ yên tĩnh, đến trễ khoảng 10 phút..." value={formData.notes} onChange={onChange} rows="4" />
        </div>
      </section>
    </div>
  )
}

export default BookingStepTwo
