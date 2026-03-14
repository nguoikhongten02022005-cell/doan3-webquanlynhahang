import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'

function DangNhapNoiBoPage() {
  const [tenDangNhapHoacEmail, setTenDangNhapHoacEmail] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loiDangNhap, setLoiDangNhap] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { coTheVaoNoiBo, daDangNhap, dangNhapNoiBo, dangXuat } = useXacThuc()

  if (daDangNhap && coTheVaoNoiBo) {
    return <Navigate to="/noi-bo/bang-dieu-khien" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    ;(async () => {
      const ketQua = await dangNhapNoiBo(tenDangNhapHoacEmail, matKhau)

      if (!ketQua.success) {
        setLoiDangNhap(ketQua.error)
        return
      }

      if (!['admin', 'staff'].includes(ketQua.user?.role)) {
        await dangXuat()
        setLoiDangNhap('Tài khoản này không có quyền truy cập khu vực nội bộ.')
        return
      }

      setLoiDangNhap('')
      navigate(location.state?.from || '/noi-bo/bang-dieu-khien', { replace: true })
    })()
  }

  return (
    <section className="auth-page internal-login-page">
      <div className="auth-card internal-login-card">
        <p className="profile-kicker">Khu vực nội bộ</p>
        <h1 className="auth-title">Đăng nhập nhân sự</h1>
        <p className="auth-subtitle">
          Dành cho quản trị viên và nhân viên vận hành truy cập bảng điều khiển nội bộ.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="internal-login-identifier" className="form-label">
              Tên tài khoản hoặc Email
            </label>
            <input
              id="internal-login-identifier"
              name="identifier"
              type="text"
              className="form-input"
              placeholder="Nhập tài khoản nội bộ"
              autoComplete="username"
              value={tenDangNhapHoacEmail}
              onChange={(e) => {
                setTenDangNhapHoacEmail(e.target.value)
                if (loiDangNhap) {
                  setLoiDangNhap('')
                }
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="internal-login-password" className="form-label">
              Mật khẩu
            </label>
            <input
              id="internal-login-password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={matKhau}
              onChange={(e) => {
                setMatKhau(e.target.value)
                if (loiDangNhap) {
                  setLoiDangNhap('')
                }
              }}
              required
            />
          </div>

          {loiDangNhap && (
            <p className="form-error" role="alert">
              {loiDangNhap}
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Vào khu vực nội bộ
          </button>
        </form>

        <p className="auth-switch-text">
          Bạn là khách hàng?{' '}
          <Link to="/dang-nhap" className="auth-switch-link">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </section>
  )
}

export default DangNhapNoiBoPage
