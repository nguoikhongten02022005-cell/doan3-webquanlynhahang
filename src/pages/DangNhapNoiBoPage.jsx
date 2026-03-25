import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { VAI_TRO_XAC_THUC } from '../services/dichVuXacThuc'
import { useXacThuc } from '../hooks/useXacThuc'
import { TAI_KHOAN_NOI_BO_DEMO } from '../constants/xacThucDemo'

function DangNhapNoiBoPage() {
  const [tenDangNhapHoacEmail, setTenDangNhapHoacEmail] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loiDangNhap, setLoiDangNhap] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { coTheVaoNoiBo, daDangNhap, dangNhapNoiBo, dangXuat } = useXacThuc()

  if (daDangNhap && coTheVaoNoiBo) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (dangGui) {
      return
    }

    setDangGui(true)

    try {
      const ketQua = await dangNhapNoiBo(tenDangNhapHoacEmail, matKhau)

      if (!ketQua.success) {
        setLoiDangNhap(ketQua.error)
        return
      }

      if (![VAI_TRO_XAC_THUC.QUAN_TRI, VAI_TRO_XAC_THUC.NHAN_VIEN].includes(ketQua.user?.role)) {
        await dangXuat()
        setLoiDangNhap('Tài khoản này không có quyền truy cập khu vực nội bộ.')
        return
      }

      setLoiDangNhap('')
      navigate(location.state?.from || '/admin/dashboard', { replace: true })
    } finally {
      setDangGui(false)
    }
  }

  return (
    <section className="xac-thuc-page noi-bo-login-page admin-login-page">
      <div className="xac-thuc-card admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-brand__mark">NH</div>
          <div>
            <p className="admin-login-brand__kicker">Nguyên Vị</p>
            <strong>Operations Console</strong>
          </div>
        </div>

        <h1 className="xac-thuc-title">Đăng nhập quản trị</h1>
        <p className="xac-thuc-subtitle">
          Ưu tiên hoàn thiện frontend trước backend, nên bạn có thể dùng tài khoản demo để xem toàn bộ Admin Panel ngay.
        </p>

        <div className="admin-demo-credentials" aria-label="Tài khoản demo nội bộ">
          {TAI_KHOAN_NOI_BO_DEMO.map((account) => (
            <button
              key={account.username}
              type="button"
              className="admin-demo-credentials__item"
              onClick={() => {
                setTenDangNhapHoacEmail(account.username)
                setMatKhau(account.password)
                setLoiDangNhap('')
              }}
            >
              <div>
                <strong>{account.user.role === 'admin' ? 'Admin demo' : 'Nhân viên demo'}</strong>
                <p>{account.identifier}</p>
              </div>
              <span>{account.username} / {account.password}</span>
            </button>
          ))}
        </div>

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
              placeholder="Nhập tên tài khoản hoặc email"
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

          <button type="submit" className="btn nut-chinh admin-login-submit" disabled={dangGui}>
            {dangGui ? 'Đang đăng nhập...' : 'Vào Admin Panel'}
          </button>
        </form>

        <div className="xac-thuc-demo-note admin-login-note" aria-live="polite">
          <strong>Khu vực dành cho nhân sự</strong>
          <p>Hiện frontend đang ưu tiên trước backend, nên có sẵn tài khoản demo admin và nhân viên để bạn kiểm tra giao diện.</p>
          <p>
            Bạn là khách hàng?{' '}
            <Link to="/dang-nhap" className="xac-thuc-switch-link">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default DangNhapNoiBoPage
