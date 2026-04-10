import { Link } from 'react-router-dom'

function MangVePage() {
  return (
    <section className="xac-thuc-page xac-thuc-page-editorial">
      <div className="xac-thuc-card">
        <h1 className="xac-thuc-title">Đặt món mang về</h1>
        <p className="xac-thuc-subtitle">Chọn món, hẹn giờ đến lấy và thanh toán chuyển khoản trước khi nhà hàng xác nhận đơn.</p>
        <div className="ho-so-profile-actions">
          <Link to="/mang-ve/thuc-don" className="btn nut-chinh">Vào menu mang về</Link>
        </div>
      </div>
    </section>
  )
}

export default MangVePage
