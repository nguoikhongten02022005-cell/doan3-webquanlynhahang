import { Link } from 'react-router-dom'
import { dinhDangNgay } from '../../features/bangDieuKhienNoiBo/dinhDang'
import { dinhDangTienTeVietNam } from '../../utils/tienTe'

const DonHangIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6.5h16l-1.4 7.2a2 2 0 0 1-2 1.6H9.1a2 2 0 0 1-2-1.5L5.5 4.8A1 1 0 0 0 4.5 4H3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="19" r="1.25" fill="currentColor" />
    <circle cx="17" cy="19" r="1.25" fill="currentColor" />
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const DishIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 4.5v5a2 2 0 0 0 4 0v-5M8 4.5v15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M15 4.5c1.7 2 2.5 4 2.5 6.2S16.7 15 15 17v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const MoneyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.7" />
    <path d="M7 9.5h.01M17 14.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

function LichSuDonHangTab({ orders, onOpenOrderDetail }) {
  return (
    <article className="ho-so-card">
      <div className="ho-so-section-heading">
        <div>
          <h2>Lịch sử đơn hàng</h2>
          <p>Theo dõi các đơn đã đặt gần đây và xem nhanh chi tiết món.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="ho-so-empty-state">
          <div className="ho-so-empty-icon">
            <DonHangIcon />
          </div>
          <h3>Bạn chưa có đơn hàng nào</h3>
          <p>Khám phá thực đơn để chọn những món yêu thích cho bữa ăn tiếp theo.</p>
          <Link to="/thuc-don" className="btn nut-chinh ho-so-empty-action">
            Xem thực đơn
          </Link>
        </div>
      ) : (
        <div className="ho-so-history-grid">
          {orders.map((order) => (
            <div key={order.orderCode} className="ho-so-history-card">
              <div className="ho-so-history-header">
                <strong>{order.orderCode}</strong>
                <span className={`nhan-trang-thai tone-${order.statusTone}`}>{order.statusLabel}</span>
              </div>

              <div className="ho-so-history-meta-grid">
                <div className="ho-so-history-meta-item">
                  <span className="ho-so-history-meta-icon"><CalendarIcon /></span>
                  <div>
                    <span>Ngày giờ</span>
                    <strong>{dinhDangNgay(order.date)} • {order.time}</strong>
                  </div>
                </div>

                <div className="ho-so-history-meta-item">
                  <span className="ho-so-history-meta-icon"><DishIcon /></span>
                  <div>
                    <span>Số món</span>
                    <strong>{order.itemCount} món</strong>
                  </div>
                </div>

                <div className="ho-so-history-meta-item">
                  <span className="ho-so-history-meta-icon"><MoneyIcon /></span>
                  <div>
                    <span>Tổng tiền</span>
                    <strong>{dinhDangTienTeVietNam(order.total)}</strong>
                  </div>
                </div>
              </div>

              <div className="ho-so-history-actions">
                <button type="button" className="btn nut-phu ho-so-action-btn ho-so-action-btn--accent" onClick={() => onOpenOrderDetail(order.orderCode)}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

export default LichSuDonHangTab
