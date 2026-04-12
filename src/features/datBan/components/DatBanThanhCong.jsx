import { Link } from 'react-router-dom'
import { SITE_CONTACT } from '../../../constants/lienHeTrang'

function DatBanThanhCong({ confirmation }) {
  return (
    <section className="dat-ban-success-screen dat-ban-customer-card dat-ban-customer-card-soft">
      <div className="dat-ban-success-hero">
        <span className="dat-ban-success-emoji">🎉</span>
        <p className="eyebrow">Đặt bàn thành công</p>
        <h2>Yêu cầu của bạn đã được ghi nhận.</h2>
        <p>
          Chúng tôi đã gửi thông tin xác nhận ban đầu cho bạn. Host sẽ ưu tiên sắp xếp khu vực phù hợp nhất với lịch hẹn đã chọn.
        </p>
      </div>

      <div className="dat-ban-success-ticket">
        <strong>Mã đặt bàn: {confirmation.bookingCode}</strong>
        <span>📅 {confirmation.dateTimeLabel}</span>
        <span>👥 {confirmation.guests} khách • {confirmation.areaLabel}</span>
      </div>

      <div className="dat-ban-success-contact-grid">
        <div>
          <span>📱 SMS xác nhận</span>
          <strong>{confirmation.phone}</strong>
        </div>
        <div>
          <span>📧 Email xác nhận</span>
          <strong>{confirmation.email}</strong>
        </div>
      </div>

      <div className="dat-ban-success-map-card">
        <div>
          <strong>{SITE_CONTACT.address}</strong>
          <p>{SITE_CONTACT.hours[0].value}</p>
        </div>
        <a className="btn nut-phu" href={SITE_CONTACT.phoneHref}>
          📞 Gọi hotline
        </a>
      </div>

      <div className="dat-ban-success-actions">
        <Link className="btn nut-phu" to="/">🏠 Về trang chủ</Link>
        <Link className="btn nut-phu" to="/ho-so">📋 Xem lịch sử đặt bàn</Link>
        <Link className="btn nut-chinh" to="/thuc-don">🍽️ Xem thực đơn trước</Link>
      </div>
    </section>
  )
}

export default DatBanThanhCong
