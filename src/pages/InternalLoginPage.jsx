import { useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function InternalLoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { canAccessInternal, isAuthenticated, internalLogin, logout } = useAuth()

  if (isAuthenticated && canAccessInternal) {
    return <Navigate to="/internal/dashboard" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    ;(async () => {
      const result = await internalLogin(identifier, password)

      if (!result.success) {
        setLoginError(result.error)
        return
      }

      if (!['admin', 'staff'].includes(result.user?.role)) {
        logout()
        setLoginError('Tài khoản này không có quyền truy cập khu vực nội bộ.')
        return
      }

      setLoginError('')
      navigate(location.state?.from || '/internal/dashboard', { replace: true })
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
            <p className="form-error" role="alert">
              {loginError}
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Vào khu vực nội bộ
          </button>
        </form>

        <p className="auth-switch-text">
          Bạn là khách hàng?{' '}
          <Link to="/login" className="auth-switch-link">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </section>
  )
}

export default InternalLoginPage
