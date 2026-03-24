import { Link } from 'react-router-dom'

function DangKyPage() {
  return (
    <section className="xac-thuc-page xac-thuc-page-editorial xac-thuc-page-register">
      <div className="xac-thuc-card xac-thuc-card-demo-only">
        <h1 className="xac-thuc-title">Đăng ký tạm thời không mở</h1>
        <p className="xac-thuc-subtitle">
          Luồng khách hàng hiện đang chạy ở chế độ demo để minh họa đăng nhập, nên chức năng tạo tài khoản bằng API đã được tắt.
        </p>

        <div className="xac-thuc-demo-note xac-thuc-demo-note--centered">
          <strong>Vui lòng dùng tài khoản demo ở trang đăng nhập</strong>
          <p>Đăng nhập bằng thông tin demo để tiếp tục trải nghiệm luồng khách hàng.</p>
        </div>

        <p className="xac-thuc-switch-text">
          Quay lại{' '}
          <Link to="/dang-nhap" className="xac-thuc-switch-link">
            trang đăng nhập
          </Link>
        </p>
      </div>
    </section>
  )
}

export default DangKyPage
