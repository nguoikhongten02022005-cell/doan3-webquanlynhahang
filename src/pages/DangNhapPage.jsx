import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'

function DangNhapPage() {
  const [email, setEmail] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loginError, setLoginError] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { dangNhap } = useXacThuc()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (dangGui) return

    try {
      setDangGui(true)
      const ketQua = await dangNhap(email, matKhau)

      if (!ketQua.success) {
        setLoginError(ketQua.error)
        return
      }

      setLoginError('')
      navigate(location.state?.from || '/', { replace: true })
    } finally {
      setDangGui(false)
    }
  }

  return (
    <section className="xac-thuc-page">
      <div className="xac-thuc-card">
        <h1 className="xac-thuc-title">Đăng nhập</h1>
        <p className="xac-thuc-subtitle">Đăng nhập để tiếp tục sử dụng tài khoản khách hàng của bạn.</p>

        {location.state?.registered && <p className="form-success">Đăng ký thành công. Vui lòng đăng nhập.</p>}

        <form onSubmit={handleSubmit} className="xac-thuc-form">
          <div className="nhom-truong">
            <label htmlFor="login-email" className="nhan-truong">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="truong-nhap"
              placeholder="Nhập email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (loginError) setLoginError('')
              }}
              required
            />
          </div>

          <div className="nhom-truong">
            <label htmlFor="login-password" className="nhan-truong">Mật khẩu</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="truong-nhap"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={matKhau}
              onChange={(e) => {
                setMatKhau(e.target.value)
                if (loginError) setLoginError('')
              }}
              required
            />
          </div>

          {loginError ? <p className="loi-bieu-mau" role="alert">{loginError}</p> : null}

          <button type="submit" className="btn nut-chinh" disabled={dangGui}>
            {dangGui ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="xac-thuc-switch-text">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" className="xac-thuc-switch-link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </section>
  )
}

export default DangNhapPage
