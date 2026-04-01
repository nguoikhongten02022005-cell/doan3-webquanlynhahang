import { Link } from 'react-router-dom'
import { dinhDangNgay } from '../../features/bangDieuKhienNoiBo/dinhDang'

const BookingCalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const GuestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M5 19c1.6-3 4-4.5 7-4.5s5.4 1.5 7 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const AreaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 20s6-4.8 6-10a6 6 0 1 0-12 0c0 5.2 6 10 6 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
  </svg>
)

function LichSuDatBanTab({ bookings, onCancelBooking, onRebook }) {
  return (
    <article className="ho-so-card">
      <div className="ho-so-section-heading">
        <div>
          <h2>Lịch sử đặt bàn</h2>
          <p>Xem lại những lần đặt bàn gần đây và thao tác nhanh khi cần.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="ho-so-empty-state">
          <div className="ho-so-empty-icon">
            <BookingCalendarIcon />
          </div>
          <h3>Bạn chưa có lịch sử đặt bàn</h3>
          <p>Đặt bàn trước để giữ chỗ và chuẩn bị trải nghiệm tốt nhất tại nhà hàng.</p>
          <Link to="/dat-ban" className="btn nut-chinh ho-so-empty-action">
            Đặt bàn ngay
          </Link>
        </div>
      ) : (
        <div className="ho-so-history-grid">
          {bookings.map((booking) => (
            <div key={booking.bookingCode} className="ho-so-history-card">
              <div className="ho-so-history-header">
                <strong>{booking.bookingCode}</strong>
                <span className={`nhan-trang-thai tone-${booking.statusTone || 'warning'}`}>{booking.statusLabel || booking.status || 'Chờ xác nhận'}</span>
              </div>

              <div className="ho-so-history-meta-grid">
                <div className="ho-so-history-meta-item">
                  <span className="ho-so-history-meta-icon"><BookingCalendarIcon /></span>
                  <div>
                    <span>Ngày giờ</span>
                    <strong>{dinhDangNgay(booking.date)} • {booking.time}</strong>
                  </div>
                </div>

                <div className="ho-so-history-meta-item">
                  <span className="ho-so-history-meta-icon"><GuestIcon /></span>
                  <div>
                    <span>Số khách</span>
                    <strong>{booking.guestCount || booking.guests || 0} người</strong>
                  </div>
                </div>

                <div className="ho-so-history-meta-item">
                  <span className="ho-so-history-meta-icon"><AreaIcon /></span>
                  <div>
                    <span>Khu vực</span>
                    <strong>{booking.area || booking.seatingArea || 'Không ưu tiên'}</strong>
                  </div>
                </div>
              </div>

              <div className="ho-so-history-actions">
                {['Pending', 'DA_XAC_NHAN', 'Confirmed'].includes(booking.rawStatus || booking.status) && (
                  <button type="button" className="btn ho-so-action-btn ho-so-action-btn--danger" onClick={() => onCancelBooking(booking.bookingCode)}>
                    Hủy đặt bàn
                  </button>
                )}

                {['DA_HOAN_THANH', 'DA_HUY', 'Completed', 'Cancelled'].includes(booking.rawStatus || booking.status) && (
                  <button type="button" className="btn ho-so-action-btn ho-so-action-btn--warm" onClick={() => onRebook(booking.bookingCode)}>
                    Đặt lại
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export default LichSuDatBanTab
