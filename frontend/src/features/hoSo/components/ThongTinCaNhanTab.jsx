import { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, Upload } from 'antd'
import { useThongBao } from '../../../context/ThongBaoContext'

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

const dinhDangThoiGianDiem = (giaTri) => {
  if (!giaTri) return '--'

  const thoiGian = new Date(giaTri)
  if (Number.isNaN(thoiGian.getTime())) return String(giaTri)

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(thoiGian)
}

const dinhDangSo = (giaTri) => new Intl.NumberFormat('vi-VN').format(Number(giaTri || 0))

function ThongTinCaNhanTab({ nguoiDung, tongQuanDiemTichLuy, lichSuDiemTichLuy = [], onLogout, onCapNhatHoSo, onDoiMatKhau }) {
  const { hienThongBao } = useThongBao()
  const [formHoSo] = Form.useForm()
  const [formMatKhau] = Form.useForm()
  const [formData, setFormData] = useState(() => taoGiaTriHoSoBanDau(nguoiDung))
  const [daChinhSuaHoSo, setDaChinhSuaHoSo] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [matKhauForm, setMatKhauForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [dangLuuHoSo, setDangLuuHoSo] = useState(false)
  const [dangCapNhatMatKhau, setDangCapNhatMatKhau] = useState(false)
  const avatarMacDinh = String(nguoiDung?.avatarUrl ?? nguoiDung?.avatar ?? '')
  const tongQuanDiem = useMemo(() => ({
    tongDiem: Number(tongQuanDiemTichLuy?.tongDiem || 0),
    diemCoTheDoi: Number(tongQuanDiemTichLuy?.diemCoTheDoi || 0),
    tiLeQuyDoi: Number(tongQuanDiemTichLuy?.tiLeQuyDoi || 0),
  }), [tongQuanDiemTichLuy])

  useEffect(() => {
    if (daChinhSuaHoSo) {
      return
    }

    const giaTriBanDau = taoGiaTriHoSoBanDau(nguoiDung)
    setFormData(giaTriBanDau)
    formHoSo.setFieldsValue(giaTriBanDau)
  }, [daChinhSuaHoSo, formHoSo, nguoiDung])

  useEffect(() => () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const handleProfileFieldChange = (field) => (event) => {
    const value = event?.target?.value ?? ''
    setDaChinhSuaHoSo(true)
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = (file) => {
    if (!file) {
      return false
    }

    if (!file.type?.startsWith('image/')) {
      hienThongBao({
        message: 'Vui lòng chọn file ảnh hợp lệ.',
        tone: 'error',
        duration: 3000,
        title: '',
      })
      return Upload.LIST_IGNORE
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }

    const nextPreview = URL.createObjectURL(file)
    setAvatarPreview(nextPreview)
    return false
  }

  const handleSaveProfile = async () => {
    try {
      const giaTriHopLe = await formHoSo.validateFields()
      setDangLuuHoSo(true)
      const ketQua = await onCapNhatHoSo?.(giaTriHopLe)
      if (!ketQua?.success) {
        hienThongBao({
          message: ketQua?.error || 'Không thể cập nhật hồ sơ.',
          tone: 'error',
          duration: 3000,
          title: '',
        })
        return
      }

      setFormData(giaTriHopLe)
      setDaChinhSuaHoSo(false)
      formHoSo.setFieldsValue(giaTriHopLe)

      hienThongBao({
        message: '✅ Đã lưu thông tin thành công',
        tone: 'success',
        duration: 3000,
        title: '',
      })
    } finally {
      setDangLuuHoSo(false)
    }
  }

  const handlePasswordFieldChange = (field) => (event) => {
    const value = event?.target?.value ?? ''
    setMatKhauForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdatePassword = async () => {
    try {
      const values = await formMatKhau.validateFields()
      setDangCapNhatMatKhau(true)
      const ketQua = await onDoiMatKhau?.(values)
      if (!ketQua?.success) {
        hienThongBao({
          message: ketQua?.error || 'Không thể cập nhật mật khẩu.',
          tone: 'error',
          duration: 3000,
          title: '',
        })
        return
      }

      const giaTriMacDinh = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
      setMatKhauForm(giaTriMacDinh)
      formMatKhau.setFieldsValue(giaTriMacDinh)
      hienThongBao({
        message: 'Đã cập nhật mật khẩu thành công.',
        tone: 'success',
        duration: 3000,
        title: 'Thành công',
      })
    } finally {
      setDangCapNhatMatKhau(false)
    }
  }

  const avatarSrc = avatarPreview || avatarMacDinh

  return (
    <article className="ho-so-card ho-so-personal-card ho-so-ant-hybrid">
      <div className="ho-so-section-heading">
        <div>
          <h2>Thông tin cá nhân</h2>
          <p>Cập nhật hồ sơ cơ bản để việc đặt bàn và thanh toán diễn ra nhanh hơn.</p>
        </div>
        <Button htmlType="button" className="btn ho-so-logout-btn" onClick={onLogout}>
          Đăng xuất
        </Button>
      </div>

      <div className="ho-so-avatar-block">
        <div className="ho-so-avatar-preview" aria-label="Ảnh đại diện">
          {avatarSrc ? <img src={avatarSrc} alt="Ảnh đại diện" /> : <UserAvatarIcon />}
        </div>
        <Upload accept="image/*" showUploadList={false} beforeUpload={handleAvatarChange}>
          <Button htmlType="button" className="btn ho-so-avatar-btn">
            Đổi ảnh
          </Button>
        </Upload>
      </div>

      <Form form={formHoSo} layout="vertical" initialValues={formData}>
        <div className="ho-so-form-grid">
          <Form.Item className="nhom-truong" label={<span className="nhan-truong">Tên</span>} name="fullName" rules={[{ required: true, message: 'Vui lòng nhập tên.' }]}>
            <Input id="ho-so-full-name" className="truong-nhap" onChange={handleProfileFieldChange('fullName')} />
          </Form.Item>

          <Form.Item
            className="nhom-truong"
            label={<span className="nhan-truong">Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email.' },
              { type: 'email', message: 'Email không hợp lệ.' },
            ]}
          >
            <Input id="ho-so-email" type="email" className="truong-nhap" onChange={handleProfileFieldChange('email')} />
          </Form.Item>

          <Form.Item className="nhom-truong full" label={<span className="nhan-truong">SĐT</span>} name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại.' }]}>
            <Input id="ho-so-phone" className="truong-nhap" onChange={handleProfileFieldChange('phone')} />
          </Form.Item>
        </div>
      </Form>

      <div className="ho-so-profile-actions">
        <Button htmlType="button" className="btn nut-chinh ho-so-save-btn" loading={dangLuuHoSo} onClick={handleSaveProfile}>
          Lưu thay đổi
        </Button>
      </div>

      <section className="ho-so-loyalty-section" aria-label="Điểm tích lũy">
        <div className="ho-so-subsection-heading">
          <h3>Điểm tích lũy</h3>
          <p>Theo dõi số điểm hiện có và lịch sử biến động điểm từ các đơn hàng của bạn.</p>
        </div>

        <div className="ho-so-loyalty-grid">
          <article className="ho-so-loyalty-card">
            <span className="ho-so-loyalty-label">Tổng điểm hiện có</span>
            <strong className="ho-so-loyalty-value">{dinhDangSo(tongQuanDiem.tongDiem)}</strong>
          </article>

          <article className="ho-so-loyalty-card">
            <span className="ho-so-loyalty-label">Điểm có thể đổi</span>
            <strong className="ho-so-loyalty-value">{dinhDangSo(tongQuanDiem.diemCoTheDoi)}</strong>
          </article>

          <article className="ho-so-loyalty-card">
            <span className="ho-so-loyalty-label">Tỷ lệ quy đổi</span>
            <strong className="ho-so-loyalty-value">1 điểm / {dinhDangSo(tongQuanDiem.tiLeQuyDoi)}đ</strong>
          </article>
        </div>

        <div className="ho-so-loyalty-history">
          <div className="ho-so-loyalty-history-header">
            <h4>Lịch sử điểm gần đây</h4>
            <span>{lichSuDiemTichLuy.length} giao dịch</span>
          </div>

          {lichSuDiemTichLuy.length ? (
            <div className="ho-so-loyalty-history-list">
              {lichSuDiemTichLuy.map((giaoDich) => (
                <article key={giaoDich.maGiaoDichDiem || `${giaoDich.ngayTao}-${giaoDich.maDonHang}`} className="ho-so-loyalty-history-item">
                  <div>
                    <strong>{giaoDich.moTa || giaoDich.loaiBienDong || 'Biến động điểm'}</strong>
                    <p>
                      {giaoDich.maDonHang ? `Đơn ${giaoDich.maDonHang} • ` : ''}
                      {dinhDangThoiGianDiem(giaoDich.ngayTao)}
                    </p>
                  </div>
                  <div className="ho-so-loyalty-history-meta">
                    <strong className={giaoDich.soDiem >= 0 ? 'ho-so-loyalty-plus' : 'ho-so-loyalty-minus'}>
                      {giaoDich.soDiem >= 0 ? '+' : ''}{dinhDangSo(giaoDich.soDiem)} điểm
                    </strong>
                    <span>
                      {dinhDangSo(giaoDich.soDiemTruoc)} → {dinhDangSo(giaoDich.soDiemSau)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="ho-so-loyalty-empty">Chưa có lịch sử điểm tích lũy.</div>
          )}
        </div>
      </section>

      <div className="ho-so-password-section">
        <div className="ho-so-subsection-heading">
          <h3>Đổi mật khẩu</h3>
          <p>Thiết lập lại mật khẩu đăng nhập để bảo mật tài khoản tốt hơn.</p>
        </div>

        <Form form={formMatKhau} layout="vertical" initialValues={matKhauForm} onFinish={handleUpdatePassword}>
          <input type="text" name="username" autoComplete="username" value={formData.email || ''} readOnly hidden />
          <div className="ho-so-form-grid">
            <Form.Item
              className="nhom-truong full"
              label={<span className="nhan-truong">Mật khẩu hiện tại</span>}
              name="currentPassword"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại.' }]}
            >
              <Input.Password id="ho-so-current-password" autoComplete="current-password" className="truong-nhap" onChange={handlePasswordFieldChange('currentPassword')} />
            </Form.Item>

            <Form.Item
              className="nhom-truong"
              label={<span className="nhan-truong">Mật khẩu mới</span>}
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới.' },
                { min: 8, message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' },
              ]}
            >
              <Input.Password id="ho-so-new-password" autoComplete="new-password" className="truong-nhap" onChange={handlePasswordFieldChange('newPassword')} />
            </Form.Item>

            <Form.Item
              className="nhom-truong"
              label={<span className="nhan-truong">Xác nhận mật khẩu mới</span>}
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu mới.' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }

                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'))
                  },
                }),
              ]}
            >
              <Input.Password id="ho-so-confirm-password" autoComplete="new-password" className="truong-nhap" onChange={handlePasswordFieldChange('confirmPassword')} />
            </Form.Item>
          </div>

          <div className="ho-so-profile-actions">
            <Button htmlType="submit" className="btn nut-chinh ho-so-save-btn" loading={dangCapNhatMatKhau}>
              Cập nhật mật khẩu
            </Button>
            <Button htmlType="button" className="btn ho-so-logout-btn ho-so-logout-btn--mobile" onClick={onLogout}>
              Đăng xuất
            </Button>
          </div>
        </Form>
      </div>
    </article>
  )
}

export default ThongTinCaNhanTab
