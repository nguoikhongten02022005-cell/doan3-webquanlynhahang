import { useEffect, useRef, useState } from 'react'
import { useThongBao } from '../../context/ThongBaoContext'

const UserAvatarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 19c1.6-3 4-4.5 7-4.5s5.4 1.5 7 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const taoGiaTriHoSoBanDau = (nguoiDung) => ({
  fullName: String(nguoiDung?.fullName ?? nguoiDung?.name ?? ''),
  email: String(nguoiDung?.email ?? ''),
  phone: String(nguoiDung?.phone ?? ''),
})

function ThongTinCaNhanTab({ nguoiDung, onLogout, onCapNhatHoSo, onDoiMatKhau }) {
  const { hienThongBao } = useThongBao()
  const [formData, setFormData] = useState(() => taoGiaTriHoSoBanDau(nguoiDung))
  const [avatarPreview, setAvatarPreview] = useState('')
  const [matKhauForm, setMatKhauForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [matKhauErrors, setMatKhauErrors] = useState({})
  const fileInputRef = useRef(null)
  const avatarMacDinh = String(nguoiDung?.avatarUrl ?? nguoiDung?.avatar ?? '')

  useEffect(() => {
    setFormData(taoGiaTriHoSoBanDau(nguoiDung))
  }, [nguoiDung])

  useEffect(() => () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const handleProfileFieldChange = (field) => (event) => {
    const value = event.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    const nextPreview = URL.createObjectURL(file)
    setAvatarPreview(nextPreview)
    event.target.value = ''
  }

  const handleSaveProfile = async () => {
    const ketQua = await onCapNhatHoSo?.(formData)
    if (!ketQua?.success) {
      hienThongBao({
        message: ketQua?.error || 'Không thể cập nhật hồ sơ.',
        tone: 'error',
        duration: 3000,
        title: '',
      })
      return
    }

    hienThongBao({
      message: '✅ Đã lưu thông tin thành công',
      tone: 'success',
      duration: 3000,
      title: '',
    })
  }

  const validatePasswordForm = (values) => {
    const nextErrors = {}

    if (!values.currentPassword.trim()) {
      nextErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.'
    }

    if (!values.newPassword.trim()) {
      nextErrors.newPassword = 'Vui lòng nhập mật khẩu mới.'
    } else if (values.newPassword.trim().length < 8) {
      nextErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự.'
    }

    if (!values.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.'
    } else if (values.confirmPassword !== values.newPassword) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.'
    }

    return nextErrors
  }

  const handlePasswordFieldChange = (field) => (event) => {
    const value = event.target.value
    setMatKhauForm((prev) => {
      const nextValues = { ...prev, [field]: value }
      if (Object.keys(matKhauErrors).length > 0) {
        setMatKhauErrors(validatePasswordForm(nextValues))
      }
      return nextValues
    })
  }

  const handleUpdatePassword = async () => {
    const nextErrors = validatePasswordForm(matKhauForm)
    setMatKhauErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const ketQua = await onDoiMatKhau?.(matKhauForm)
    if (!ketQua?.success) {
      hienThongBao({
        message: ketQua?.error || 'Không thể cập nhật mật khẩu.',
        tone: 'error',
        duration: 3000,
        title: '',
      })
      return
    }

    setMatKhauForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    hienThongBao({
      message: 'Đã cập nhật mật khẩu thành công.',
      tone: 'success',
      duration: 3000,
      title: 'Thành công',
    })
  }

  const avatarSrc = avatarPreview || avatarMacDinh

  return (
    <article className="ho-so-card ho-so-personal-card">
      <div className="ho-so-section-heading">
        <div>
          <h2>Thông tin cá nhân</h2>
          <p>Cập nhật hồ sơ cơ bản để việc đặt bàn và thanh toán diễn ra nhanh hơn.</p>
        </div>
        <button type="button" className="btn ho-so-logout-btn" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>

      <div className="ho-so-avatar-block">
        <div className="ho-so-avatar-preview" aria-label="Ảnh đại diện">
          {avatarSrc ? <img src={avatarSrc} alt="Ảnh đại diện" /> : <UserAvatarIcon />}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="ho-so-avatar-input" onChange={handleAvatarChange} />
        <button type="button" className="btn ho-so-avatar-btn" onClick={() => fileInputRef.current?.click()}>
          Đổi ảnh
        </button>
      </div>

      <div className="ho-so-form-grid">
        <div className="nhom-truong">
          <label className="nhan-truong" htmlFor="ho-so-full-name">Tên</label>
          <input id="ho-so-full-name" className="truong-nhap" value={formData.fullName} onChange={handleProfileFieldChange('fullName')} />
        </div>

        <div className="nhom-truong">
          <label className="nhan-truong" htmlFor="ho-so-email">Email</label>
          <input id="ho-so-email" type="email" className="truong-nhap" value={formData.email} onChange={handleProfileFieldChange('email')} />
        </div>

        <div className="nhom-truong full">
          <label className="nhan-truong" htmlFor="ho-so-phone">SĐT</label>
          <input id="ho-so-phone" className="truong-nhap" value={formData.phone} onChange={handleProfileFieldChange('phone')} />
        </div>
      </div>

      <div className="ho-so-profile-actions">
        <button type="button" className="btn nut-chinh ho-so-save-btn" onClick={handleSaveProfile}>
          Lưu thay đổi
        </button>
      </div>

      <div className="ho-so-password-section">
        <div className="ho-so-subsection-heading">
          <h3>Đổi mật khẩu</h3>
          <p>Thiết lập lại mật khẩu đăng nhập để bảo mật tài khoản tốt hơn.</p>
        </div>

        <div className="ho-so-form-grid">
          <div className="nhom-truong full">
            <label className="nhan-truong" htmlFor="ho-so-current-password">Mật khẩu hiện tại</label>
            <input
              id="ho-so-current-password"
              type="password"
              className={`truong-nhap ${matKhauErrors.currentPassword ? 'truong-nhap-error' : ''}`}
              value={matKhauForm.currentPassword}
              onChange={handlePasswordFieldChange('currentPassword')}
            />
            {matKhauErrors.currentPassword && <p className="ho-so-form-error">{matKhauErrors.currentPassword}</p>}
          </div>

          <div className="nhom-truong">
            <label className="nhan-truong" htmlFor="ho-so-new-password">Mật khẩu mới</label>
            <input
              id="ho-so-new-password"
              type="password"
              className={`truong-nhap ${matKhauErrors.newPassword ? 'truong-nhap-error' : ''}`}
              value={matKhauForm.newPassword}
              onChange={handlePasswordFieldChange('newPassword')}
            />
            {matKhauErrors.newPassword && <p className="ho-so-form-error">{matKhauErrors.newPassword}</p>}
          </div>

          <div className="nhom-truong">
            <label className="nhan-truong" htmlFor="ho-so-confirm-password">Xác nhận mật khẩu mới</label>
            <input
              id="ho-so-confirm-password"
              type="password"
              className={`truong-nhap ${matKhauErrors.confirmPassword ? 'truong-nhap-error' : ''}`}
              value={matKhauForm.confirmPassword}
              onChange={handlePasswordFieldChange('confirmPassword')}
            />
            {matKhauErrors.confirmPassword && <p className="ho-so-form-error">{matKhauErrors.confirmPassword}</p>}
          </div>
        </div>

        <div className="ho-so-profile-actions">
          <button type="button" className="btn nut-chinh ho-so-save-btn" onClick={handleUpdatePassword}>
            Cập nhật mật khẩu
          </button>
          <button type="button" className="btn ho-so-logout-btn ho-so-logout-btn--mobile" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </article>
  )
}

export default ThongTinCaNhanTab
