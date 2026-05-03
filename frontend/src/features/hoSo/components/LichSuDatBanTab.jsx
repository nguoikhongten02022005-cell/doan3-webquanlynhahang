import { useState } from 'react'
import { Link } from 'react-router-dom'
import { dinhDangNgay } from '../../noiBo/dinhDang'

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

const ChevronIcon = ({ expanded }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ width: 16, height: 16, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const formatCurrency = (amount) => {
  if (amount == null) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function LichSuDatBanTab({ bookings, onCancelBooking, onRebook }) {
  const [chiTietMoRong, setChiTietMoRong] = useState(null)

  const toggleChiTiet = (key) => {
    setChiTietMoRong(prev => prev === key ? null : key)
  }

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
          {bookings.map((booking, index) => {
            const cardKey = booking.bookingCode || booking.id || booking.bookingId || `${booking.date || 'booking'}-${booking.time || index}`
            const moRong = chiTietMoRong === cardKey
            const danhSachMon = booking.menuItems || booking.chiTietMonAn || []
            const coMonAn = Array.isArray(danhSachMon) && danhSachMon.length > 0
            const tongTien = danhSachMon.reduce((sum, mon) => sum + (mon.gia || 0) * (mon.soLuong || mon.quantity || 1), 0)

            return (
            <div key={cardKey} className="ho-so-history-card">
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

              {coMonAn && (
                <div className="ho-so-history-detail-toggle">
                  <button
                    type="button"
                    className="btn ho-so-action-btn ho-so-action-btn--detail"
                    onClick={() => toggleChiTiet(cardKey)}
                  >
                    <span>Xem chi tiết món đã đặt</span>
                    <ChevronIcon expanded={moRong} />
                  </button>

                  {moRong && (
                    <div className="ho-so-history-mon-an">
                      <table className="ho-so-mon-table">
                        <thead>
                          <tr>
                            <th>Món</th>
                            <th>SL</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {danhSachMon.map((mon, idx) => (
                            <tr key={mon.id || mon.idMon || idx}>
                              <td>{mon.tenMon || mon.ten}</td>
                              <td>{mon.soLuong || mon.quantity || 1}</td>
                              <td>{formatCurrency(mon.gia)}</td>
                              <td>{formatCurrency((mon.gia || 0) * (mon.soLuong || mon.quantity || 1))}</td>
                            </tr>
                          ))}
                        </tbody>
                        {tongTien > 0 && (
                          <tfoot>
                            <tr>
                              <td colSpan={3}><strong>Tổng cộng</strong></td>
                              <td><strong>{formatCurrency(tongTien)}</strong></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  )}
                </div>
              )}

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
          )})}
        </div>
      )}
    </article>
  )
}

export default LichSuDatBanTab
