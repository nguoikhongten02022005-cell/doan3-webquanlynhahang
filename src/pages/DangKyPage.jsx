import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'

function DangKyPage() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { dangKy } = useXacThuc()
  const backendMode = coSuDungMayChu()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (dangGui || !backendMode) {
      return
    }

    setDangGui(true)

    try {
      const ketQua = await dangKy({
        fullName,
        username,
        email,
        phone,
        password,
      })

      if (!ketQua.success) {
        setSubmitError(ketQua.error)
        return
      }

      setSubmitError('')
      navigate(location.state?.from || '/', { replace: true })
    } finally {
      setDangGui(false)
    }
  }

  return (
    <section className="xac-thuc-page xac-thuc-page-editorial xac-thuc-page-register">
      <div className="xac-thuc-card xac-thuc-card-demo-only">
        <h1 className="xac-thuc-title">Tạo tài khoản</h1>
        <p className="xac-thuc-subtitle">
          {backendMode
            ? 'Tạo tài khoản khách hàng mới để sử dụng đầy đủ các luồng thật của hệ thống.'
            : 'Frontend hiện chưa kết nối backend, nên chức năng tạo tài khoản tạm thời chưa khả dụng.'}
        </p>

        {backendMode ? (
          <form onSubmit={handleSubmit} className="xac-thuc-form">
            <div className="nhom-truong">
              <label htmlFor="register-full-name" className="nhan-truong">Họ và tên</label>
              <input id="register-full-name" className="truong-nhap" value={fullName} onChange={(e) => { setFullName(e.target.value); if (submitError) setSubmitError('') }} required />
            </div>

            <div className="nhom-truong">
              <label htmlFor="register-username" className="nhan-truong">Tên tài khoản</label>
              <input id="register-username" className="truong-nhap" value={username} onChange={(e) => { setUsername(e.target.value); if (submitError) setSubmitError('') }} required />
            </div>

            <div className="nhom-truong">
              <label htmlFor="register-email" className="nhan-truong">Email</label>
              <input id="register-email" type="email" className="truong-nhap" value={email} onChange={(e) => { setEmail(e.target.value); if (submitError) setSubmitError('') }} required />
            </div>

            <div className="nhom-truong">
              <label htmlFor="register-phone" className="nhan-truong">Số điện thoại</label>
              <input id="register-phone" className="truong-nhap" value={phone} onChange={(e) => { setPhone(e.target.value); if (submitError) setSubmitError('') }} />
            </div>

            <div className="nhom-truong">
              <label htmlFor="register-password" className="nhan-truong">Mật khẩu</label>
              <input id="register-password" type="password" className="truong-nhap" value={password} onChange={(e) => { setPassword(e.target.value); if (submitError) setSubmitError('') }} required />
            </div>

            {submitError && (
              <p className="loi-bieu-mau" role="alert">
                {submitError}
              </p>
            )}

            <button type="submit" className="btn nut-chinh" disabled={dangGui}>
              {dangGui ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>
        ) : (
          <div className="xac-thuc-demo-note xac-thuc-demo-note--centered">
            <strong>Backend mode đang tắt</strong>
            <p>Hãy bật backend mode để mở đăng ký bằng API thật.</p>
          </div>
        )}

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
