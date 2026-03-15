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
    <section className="xac-thuc-page noi-bo-login-page">
      <div className="xac-thuc-card noi-bo-login-card">
        <p className="ho-so-kicker">Khu vực nội bộ</p>
        <h1 className="xac-thuc-title">Đăng nhập nhân sự</h1>
        <p className="xac-thuc-subtitle">
          Dành cho quản trị viên và nhân viên vận hành truy cập bảng điều khiển nội bộ.
        </p>

        <form onSubmit={handleSubmit} className="xac-thuc-form">
          <div className="nhom-truong">
            <label htmlFor="noi-bo-login-identifier" className="nhan-truong">
              Tên tài khoản hoặc Email
            </label>
            <input
              id="noi-bo-login-identifier"
              name="identifier"
              type="text"
              className="truong-nhap"
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

          <div className="nhom-truong">
            <label htmlFor="noi-bo-login-password" className="nhan-truong">
              Mật khẩu
            </label>
            <input
              id="noi-bo-login-password"
              name="password"
              type="password"
              className="truong-nhap"
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
            <p className="loi-bieu-mau" role="alert">
              {loiDangNhap}
            </p>
          )}

          <button type="submit" className="btn nut-chinh">
            Vào khu vực nội bộ
          </button>
        </form>

        <p className="xac-thuc-switch-text">
          Bạn là khách hàng?{' '}
          <Link to="/dang-nhap" className="xac-thuc-switch-link">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </section>
  )
}

export default DangNhapNoiBoPage
