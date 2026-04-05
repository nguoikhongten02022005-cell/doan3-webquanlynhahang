import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert } from 'antd'
import { useXacThuc } from '../hooks/useXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'

const SO_DIEN_THOAI_REGEX = /^\d{10}$/

function DangKyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { dangKy } = useXacThuc()
  const backendMode = coSuDungMayChu()

  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    matKhau: '',
    xacNhanMatKhau: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [dangGui, setDangGui] = useState(false)

  const validate = (values) => {
    const nextErrors = {}

    if (values.hoTen.trim().length < 2) nextErrors.hoTen = 'Họ tên phải có ít nhất 2 ký tự.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = 'Email không hợp lệ.'
    if (!SO_DIEN_THOAI_REGEX.test(values.soDienThoai.trim())) nextErrors.soDienThoai = 'Số điện thoại phải gồm đúng 10 chữ số.'
    if (values.matKhau.length < 8) nextErrors.matKhau = 'Mật khẩu phải có ít nhất 8 ký tự.'
    if (values.xacNhanMatKhau !== values.matKhau) nextErrors.xacNhanMatKhau = 'Xác nhận mật khẩu không khớp.'

    return nextErrors
  }

  const formHopLe = useMemo(() => Object.keys(validate(formData)).length === 0, [formData])

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value
    setFormData((current) => ({ ...current, [field]: value }))
    if (submitError) setSubmitError('')
    if (Object.keys(formErrors).length > 0) {
      const nextValues = { ...formData, [field]: value }
      setFormErrors(validate(nextValues))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (dangGui) return

    const nextErrors = validate(formData)
    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      setDangGui(true)
      const ketQua = await dangKy(formData)

      if (!ketQua.success) {
        setSubmitError(ketQua.error)
        return
      }

      navigate(location.state?.from || '/', { replace: true })
    } finally {
      setDangGui(false)
    }
  }

  return (
    <section className="xac-thuc-page xac-thuc-page-editorial xac-thuc-page-register">
      <div className="xac-thuc-card">
        <h1 className="xac-thuc-title">Đăng ký tài khoản</h1>
        <p className="xac-thuc-subtitle">
          {backendMode
            ? 'Tạo tài khoản khách hàng để đặt bàn, theo dõi đơn và lưu thông tin cá nhân.'
            : 'Chế độ demo hiện không hỗ trợ đăng ký tài khoản khách hàng mới.'}
        </p>
        {!backendMode ? <Alert type="info" showIcon message="Ứng dụng đang ở chế độ demo. Hãy bật backend mode để dùng đăng ký thật." style={{ marginBottom: 16 }} /> : null}

        <form onSubmit={handleSubmit} className="xac-thuc-form">
          <div className="nhom-truong">
            <label htmlFor="register-full-name" className="nhan-truong">Họ và tên</label>
            <input id="register-full-name" autoComplete="name" className={`truong-nhap ${formErrors.hoTen ? 'truong-nhap-error' : ''}`} value={formData.hoTen} onChange={handleFieldChange('hoTen')} required />
            {formErrors.hoTen ? <p className="loi-bieu-mau">{formErrors.hoTen}</p> : null}
          </div>

          <div className="nhom-truong">
            <label htmlFor="register-email" className="nhan-truong">Email</label>
            <input id="register-email" type="email" autoComplete="email" className={`truong-nhap ${formErrors.email ? 'truong-nhap-error' : ''}`} value={formData.email} onChange={handleFieldChange('email')} required />
            {formErrors.email ? <p className="loi-bieu-mau">{formErrors.email}</p> : null}
          </div>

          <div className="nhom-truong">
            <label htmlFor="register-phone" className="nhan-truong">Số điện thoại</label>
            <input id="register-phone" autoComplete="tel" className={`truong-nhap ${formErrors.soDienThoai ? 'truong-nhap-error' : ''}`} value={formData.soDienThoai} onChange={handleFieldChange('soDienThoai')} required />
            {formErrors.soDienThoai ? <p className="loi-bieu-mau">{formErrors.soDienThoai}</p> : null}
          </div>

          <div className="nhom-truong">
            <label htmlFor="register-password" className="nhan-truong">Mật khẩu</label>
            <input id="register-password" type="password" autoComplete="new-password" className={`truong-nhap ${formErrors.matKhau ? 'truong-nhap-error' : ''}`} value={formData.matKhau} onChange={handleFieldChange('matKhau')} required />
            {formErrors.matKhau ? <p className="loi-bieu-mau">{formErrors.matKhau}</p> : null}
          </div>

          <div className="nhom-truong">
            <label htmlFor="register-confirm-password" className="nhan-truong">Xác nhận mật khẩu</label>
            <input id="register-confirm-password" type="password" autoComplete="new-password" className={`truong-nhap ${formErrors.xacNhanMatKhau ? 'truong-nhap-error' : ''}`} value={formData.xacNhanMatKhau} onChange={handleFieldChange('xacNhanMatKhau')} required />
            {formErrors.xacNhanMatKhau ? <p className="loi-bieu-mau">{formErrors.xacNhanMatKhau}</p> : null}
          </div>

          {submitError ? <p className="loi-bieu-mau" role="alert">{submitError}</p> : null}

          <button type="submit" className="btn nut-chinh" disabled={dangGui || !formHopLe}>
            {dangGui ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <p className="xac-thuc-switch-text">
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" className="xac-thuc-switch-link">
            Đăng nhập
          </Link>
        </p>
      </div>
    </section>
  )
}

export default DangKyPage
