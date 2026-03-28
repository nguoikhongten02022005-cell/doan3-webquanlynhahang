import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { VAI_TRO_XAC_THUC } from '../services/dichVuXacThuc'
import { useXacThuc } from '../hooks/useXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'

const TAI_KHOAN_NOI_BO_LOCAL = Object.freeze([
  {
    identifier: 'admin@nhahang.local',
    username: 'admin.local',
    password: 'secret123',
    roleLabel: 'Admin local',
  },
  {
    identifier: 'staff@nhahang.local',
    username: 'staff.local',
    password: 'secret123',
    roleLabel: 'Nhân viên local',
  },
])

const LOI_DANG_NHAP_NOI_BO_LOCAL = 'Sai tài khoản nội bộ. Hãy dùng tài khoản admin hoặc nhân viên local được hiển thị trên form đăng nhập.'
const LOI_DANG_NHAP_NOI_BO_DEMO = 'Sai tài khoản cục bộ. Hãy bật backend mode nếu muốn đăng nhập nội bộ bằng API thật.'

function DangNhapNoiBoPage() {
  const [tenDangNhapHoacEmail, setTenDangNhapHoacEmail] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loiDangNhap, setLoiDangNhap] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { coTheVaoNoiBo, daDangNhap, dangNhapNoiBo, dangXuat } = useXacThuc()
  const backendMode = coSuDungMayChu()

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
          {backendMode
            ? 'Đăng nhập bằng tài khoản nội bộ thật để truy cập Admin Panel và dữ liệu backend local.'
            : 'Frontend hiện không kết nối backend. Hãy bật backend mode để dùng tài khoản nội bộ thật.'}
        </p>

        <div className="admin-demo-credentials" aria-label={backendMode ? 'Tài khoản nội bộ local' : 'Tài khoản cục bộ nội bộ'}>
          {TAI_KHOAN_NOI_BO_LOCAL.map((account) => (
            <button
              key={account.username}
              type="button"
              className="admin-demo-credentials__item"
              onClick={() => {
                setTenDangNhapHoacEmail(account.identifier)
                setMatKhau(account.password)
                setLoiDangNhap('')
              }}
            >
              <div>
                <strong>{account.roleLabel}</strong>
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
          <strong>{backendMode ? 'Tài khoản nội bộ local' : 'Khu vực dành cho nhân sự'}</strong>
          <p>{backendMode ? 'Hệ thống đang dùng backend local, bạn có thể đăng nhập bằng tài khoản admin hoặc nhân viên thật.' : 'Frontend hiện đang chạy cục bộ, chưa dùng backend thật.'}</p>
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
