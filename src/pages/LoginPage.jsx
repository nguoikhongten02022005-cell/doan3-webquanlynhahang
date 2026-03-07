import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()

    const result = login(identifier, password)

    if (!result.success) {
      setLoginError(result.error)
      return
    }

    setLoginError('')
    navigate('/')
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Đăng nhập</h1>
        <p className="auth-subtitle">Chào mừng bạn quay trở lại nhà hàng của chúng tôi.</p>

        {location.state?.registered && <p className="form-success">Đăng ký thành công. Vui lòng đăng nhập.</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-identifier" className="form-label">
              Tên tài khoản hoặc Email
            </label>
            <input
              id="login-identifier"
              name="identifier"
              type="text"
              className="form-input"
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

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Mật khẩu
            </label>
            <input
              id="login-password"
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
            Đăng nhập
          </button>
        </form>

        <p className="auth-switch-text">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="auth-switch-link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
