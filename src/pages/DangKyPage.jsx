import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'
import { thucHienDangKy } from '../services/queries/dotBienXacThuc'

function DangKyPage() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registerError, setRegisterError] = useState('')
  const navigate = useNavigate()
  const { dangKy } = useXacThuc()

  const isPasswordMismatch = password !== confirmPassword
  const showPasswordMismatch = confirmPassword.length > 0 && isPasswordMismatch

  const dangKyMutation = useMutation({
    mutationFn: async (thongTinDangKy) => thucHienDangKy(dangKy, thongTinDangKy),
    onSuccess: (ketQua) => {
      if (!ketQua.success) {
        setRegisterError(ketQua.error)
        return
      }

      setRegisterError('')
      navigate('/dang-nhap', { state: { registered: true } })
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isPasswordMismatch) {
      return
    }

    await dangKyMutation.mutateAsync({ fullName, username, email, password })
  }

  return (
    <section className="xac-thuc-page xac-thuc-page-editorial xac-thuc-page-register">
      <div className="xac-thuc-shell">
        <div className="xac-thuc-aside">
          <p className="xac-thuc-kicker">Tạo tài khoản cho trải nghiệm tại bàn</p>
          <h1 className="xac-thuc-title">Đăng ký để đặt bàn, theo dõi đơn và giữ mọi trải nghiệm trong một nơi.</h1>
          <p className="xac-thuc-subtitle">
            Một tài khoản giúp bạn quay lại nhanh hơn, lưu lịch sử booking và đồng bộ hành trình đặt món.
          </p>
          <div className="xac-thuc-aside-note">
            <span>Quyền lợi thành viên</span>
            <strong>Đặt bàn nhanh · Theo dõi hồ sơ · Xem lịch sử đơn</strong>
          </div>
        </div>

        <div className="xac-thuc-card">
          <p className="xac-thuc-card-kicker">Tạo tài khoản mới</p>
          <h2 className="xac-thuc-card-title">Đăng ký</h2>
          <p className="xac-thuc-card-subtitle">Tạo tài khoản mới để đặt bàn và theo dõi đơn nhanh hơn.</p>

          <form onSubmit={handleSubmit} className="xac-thuc-form">
            <div className="nhom-truong">
              <label htmlFor="register-fullname" className="nhan-truong">
                Họ và Tên
              </label>
              <input
                id="register-fullname"
                name="fullName"
                type="text"
                className="truong-nhap"
                placeholder="Nhập họ và tên"
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (registerError) {
                    setRegisterError('')
                  }
                }}
                required
              />
            </div>

            <div className="nhom-truong">
              <label htmlFor="register-username" className="nhan-truong">
                Tên tài khoản
              </label>
              <input
                id="register-username"
                name="username"
                type="text"
                className="truong-nhap"
                placeholder="Nhập tên tài khoản"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (registerError) {
                    setRegisterError('')
                  }
                }}
                required
              />
            </div>

            <div className="nhom-truong">
              <label htmlFor="register-email" className="nhan-truong">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                className="truong-nhap"
                placeholder="Nhập email của bạn"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (registerError) {
                    setRegisterError('')
                  }
                }}
                required
              />
            </div>

            <div className="nhom-truong">
              <label htmlFor="register-password" className="nhan-truong">
                Mật khẩu
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                className="truong-nhap"
                placeholder="Nhập mật khẩu"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (registerError) {
                    setRegisterError('')
                  }
                }}
                required
              />
            </div>

            <div className="nhom-truong">
              <label htmlFor="register-confirm-password" className="nhan-truong">
                Xác nhận mật khẩu
              </label>
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                className={showPasswordMismatch ? 'truong-nhap truong-nhap-error' : 'truong-nhap'}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (registerError) {
                    setRegisterError('')
                  }
                }}
                aria-invalid={showPasswordMismatch ? 'true' : 'false'}
                required
              />
            </div>

            {showPasswordMismatch && (
              <p className="loi-bieu-mau" role="alert">
                Mật khẩu xác nhận không khớp.
              </p>
            )}

            {registerError && (
              <p className="loi-bieu-mau" role="alert">
                {registerError}
              </p>
            )}

            <button type="submit" className="btn nut-chinh" disabled={isPasswordMismatch || dangKyMutation.isPending}>
              {dangKyMutation.isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>

          <p className="xac-thuc-switch-text">
            Đã có tài khoản?{' '}
            <Link to="/dang-nhap" className="xac-thuc-switch-link">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default DangKyPage
