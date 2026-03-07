import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [registerError, setRegisterError] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  const isPasswordMismatch = password !== confirmPassword
  const showPasswordMismatch = confirmPassword.length > 0 && isPasswordMismatch

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isPasswordMismatch) {
      return
    }

    const result = register({ fullName, username, email, password })

    if (!result.success) {
      setRegisterError(result.error)
      return
    }

    setRegisterError('')
    navigate('/login', { state: { registered: true } })
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Đăng ký</h1>
        <p className="auth-subtitle">Tạo tài khoản mới để đặt bàn và theo dõi đơn nhanh hơn.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="register-fullname" className="form-label">
              Họ và Tên
            </label>
            <input
              id="register-fullname"
              name="fullName"
              type="text"
              className="form-input"
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

          <div className="form-group">
            <label htmlFor="register-username" className="form-label">
              Tên tài khoản
            </label>
            <input
              id="register-username"
              name="username"
              type="text"
              className="form-input"
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

          <div className="form-group">
            <label htmlFor="register-email" className="form-label">
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              className="form-input"
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

          <div className="form-group">
            <label htmlFor="register-password" className="form-label">
              Mật khẩu
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              className="form-input"
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

          <div className="form-group">
            <label htmlFor="register-confirm-password" className="form-label">
              Xác nhận mật khẩu
            </label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              className={showPasswordMismatch ? 'form-input form-input-error' : 'form-input'}
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
            <p className="form-error" role="alert">
              Mật khẩu xác nhận không khớp.
            </p>
          )}

          {registerError && (
            <p className="form-error" role="alert">
              {registerError}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={isPasswordMismatch}>
            Đăng ký
          </button>
        </form>

        <p className="auth-switch-text">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-switch-link">
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
