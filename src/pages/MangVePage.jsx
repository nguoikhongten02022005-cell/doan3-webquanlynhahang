import { Link } from 'react-router-dom'

function MangVePage() {
  return (
    <section style={{ padding: 'clamp(2rem, 6vw, 4rem) 0' }}>
      <div className="container">
        <div
          style={{
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            background: '#fff',
            border: '1px solid #eadfD3',
          }}
        >
          <h1 className="xac-thuc-title" style={{ marginBottom: '1rem' }}>Đặt món mang về</h1>
          <p className="xac-thuc-subtitle" style={{ marginBottom: '1.5rem' }}>
            Chọn món, hẹn giờ đến lấy và thanh toán chuyển khoản trước khi nhà hàng xác nhận đơn.
          </p>
          <div className="ho-so-profile-actions" style={{ justifyContent: 'center' }}>
            <Link to="/mang-ve/thuc-don" className="btn nut-chinh">Xem thực đơn mang về</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MangVePage
