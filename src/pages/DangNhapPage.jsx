import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'

const TAI_KHOAN_KHACH_HANG_LOCAL = {
  identifier: 'khach1@gmail.com',
  username: 'ND004',
  password: '123',
}

function DangNhapPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { dangNhap } = useXacThuc()

  const handleSubmit = (e) => {
    e.preventDefault()

    ;(async () => {
      const ketQua = await dangNhap(identifier, password)

      if (!ketQua.success) {
        setLoginError(ketQua.error)
        return
      }

      setLoginError('')
      navigate(location.state?.from || '/')
    })()
  }

  return (
    <section className="xac-thuc-page">
      <div className="xac-thuc-card">
        <h1 className="xac-thuc-title">Đăng nhập</h1>
        <p className="xac-thuc-subtitle">Chào mừng bạn quay trở lại nhà hàng của chúng tôi.</p>

        {location.state?.registered && <p className="form-success">Đăng ký thành công. Vui lòng đăng nhập.</p>}

        <form onSubmit={handleSubmit} className="xac-thuc-form">
          <div className="nhom-truong">
            <label htmlFor="login-identifier" className="nhan-truong">
              Tên tài khoản hoặc Email
            </label>
            <input
              id="login-identifier"
              name="identifier"
              type="text"
              className="truong-nhap"
              placeholder="Nhập tên tài khoản hoặc email"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value)
                if (loginError) {
                  setLoginError('')
                }
              }}
              required
            />
          </div>

          <div className="nhom-truong">
            <label htmlFor="login-password" className="nhan-truong">
              Mật khẩu
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="truong-nhap"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (loginError) {
                  setLoginError('')
                }
              }}
              required
            />
          </div>

          {loginError && (
            <p className="loi-bieu-mau" role="alert">
              {loginError}
            </p>
          )}

          <button type="submit" className="btn nut-chinh">
            Đăng nhập
          </button>
        </form>

        <div className="xac-thuc-demo-note" aria-live="polite">
          {coSuDungMayChu() ? (
            <>
              <strong>Đăng nhập bằng backend local</strong>
              <p>Email: <span>{TAI_KHOAN_KHACH_HANG_LOCAL.identifier}</span></p>
              <p>Mã người dùng: <span>{TAI_KHOAN_KHACH_HANG_LOCAL.username}</span></p>
              <p>Mật khẩu: <span>{TAI_KHOAN_KHACH_HANG_LOCAL.password}</span></p>
              <p>
                Chưa có tài khoản?{' '}
                <Link to="/dang-ky" className="xac-thuc-switch-link">
                  Tạo tài khoản mới
                </Link>
              </p>
            </>
          ) : (
            <>
              <strong>Đăng nhập cục bộ</strong>
              <p>Frontend hiện không kết nối backend. Hãy bật backend mode để dùng tài khoản thật.</p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default DangNhapPage
