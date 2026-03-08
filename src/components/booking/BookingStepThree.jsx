import { BOOKING_STATUS_LABELS } from '../../data/bookingData'
import { formatDateDisplay, getBookingSubmissionStatus, getMealDurationText, getPolicyItems, getSeatSummaryText } from '../../utils/booking'

function BookingStepThree({ formData, guestCount, selectedSeatOperationalNote }) {
  const submissionStatus = getBookingSubmissionStatus({
    seatingArea: formData.seatingArea,
    guestCount,
    time: formData.time,
    notes: formData.notes,
  })

  return (
    <div className="booking-step booking-step-premium">
      <section className="booking-review-grid">
        <article className="booking-editorial-card booking-review-card-main">
          <div className="booking-section-head">
            <div>
              <p className="booking-side-kicker">Xác nhận cuối</p>
              <h3>Xem lại đầy đủ thông tin trước khi gửi</h3>
            </div>
          </div>

          <div className="booking-review-list">
            <div className="booking-review-item booking-review-item-primary"><span>Số khách</span><strong>{formData.guests} khách</strong></div>
            <div className="booking-review-item booking-review-item-primary"><span>Ngày dùng bữa</span><strong>{formatDateDisplay(formData.date)}</strong></div>
            <div className="booking-review-item booking-review-item-primary"><span>Khung giờ phục vụ</span><strong>{formData.time}</strong></div>
            <div className="booking-review-item booking-review-item-primary"><span>Dự kiến sử dụng bàn</span><strong>{getMealDurationText(guestCount, formData.time)}</strong></div>
            <div className="booking-review-item booking-review-item-primary"><span>Khu vực ưu tiên</span><strong>{getSeatSummaryText(formData.seatingArea)}</strong></div>
            <div className="booking-review-item booking-review-item-primary"><span>Trạng thái sau khi gửi</span><strong>{BOOKING_STATUS_LABELS[submissionStatus]}</strong></div>
            <div className="booking-review-item booking-review-item-primary"><span>Khách liên hệ</span><strong>{formData.name}</strong></div>
            <div className="booking-review-item booking-review-item-primary"><span>Số điện thoại</span><strong>{formData.phone}</strong></div>
            {formData.email && <div className="booking-review-item"><span>Email</span><strong>{formData.email}</strong></div>}
            {formData.occasion && <div className="booking-review-item"><span>Dịp</span><strong>{formData.occasion}</strong></div>}
            <div className="booking-review-item booking-review-item-note"><span>Lưu ý vận hành</span><strong>{selectedSeatOperationalNote}</strong></div>
            {formData.notes && <div className="booking-review-item booking-review-item-notes"><span>Ghi chú thêm</span><strong>{formData.notes}</strong></div>}
          </div>
        </article>

        <aside className="booking-editorial-card booking-policy-card-premium">
          <div className="booking-section-head compact">
            <div>
              <p className="booking-side-kicker">Điều kiện giữ bàn</p>
              <h3>Chính sách giữ bàn</h3>
            </div>
          </div>

          <div className="booking-keep-table-note">
            <strong>Giữ bàn 15 phút</strong>
            <span>Nhà hàng giữ bàn tối đa 15 phút kể từ giờ hẹn trước khi cần sắp xếp lại.</span>
          </div>

          <div className="booking-policy-notes booking-policy-notes-premium">
            {getPolicyItems(guestCount, formData.seatingArea, formData.time).map((item) => (
              <div className="policy-item" key={item.text}>
                <span className="policy-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  )
}

export default BookingStepThree
