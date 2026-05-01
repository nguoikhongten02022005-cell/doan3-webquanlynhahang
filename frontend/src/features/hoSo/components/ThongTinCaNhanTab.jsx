import { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, InputNumber, Upload } from 'antd'
import { doiDiemTichLuyApi } from '../../../services/api/apiDiemTichLuy'
import { useThongBao } from '../../../context/ThongBaoContext'

const BieuTuongAnhDaiDienNguoiDung = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 19c1.6-3 4-4.5 7-4.5s5.4 1.5 7 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const khoiTaoGiaTriHoSo = (nguoiDung) => ({
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

function ThongTinCaNhanTab({ nguoiDung, tongQuanDiemTichLuy, lichSuDiemTichLuy = [], onLogout, onCapNhatHoSo, onDoiMatKhau, onRefreshDiemTichLuy }) {
  const { hienThongBao } = useThongBao()
  const [formHoSo] = Form.useForm()
  const [formMatKhau] = Form.useForm()
  const [duLieuHoSo, setDuLieuHoSo] = useState(() => khoiTaoGiaTriHoSo(nguoiDung))
  const [daSuaHoSo, setDaSuaHoSo] = useState(false)
  const [xemTruocAnhDaiDien, setXemTruocAnhDaiDien] = useState('')
  const [matKhauForm, setMatKhauForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [dangLuuThongTinHoSo, setDangLuuThongTinHoSo] = useState(false)
  const [dangCapNhatMatKhauHoSo, setDangCapNhatMatKhauHoSo] = useState(false)
  const [soDiemMuonDoi, setSoDiemMuonDoi] = useState(null)
  const [dangDoiDiem, setDangDoiDiem] = useState(false)
  const [phanHoiDoiDiem, setPhanHoiDoiDiem] = useState(null)
  const anhDaiDienMacDinh = String(nguoiDung?.avatarUrl ?? nguoiDung?.avatar ?? '')
  const tongQuanDiem = useMemo(() => ({
    tongDiem: Number(tongQuanDiemTichLuy?.tongDiem || 0),
    diemCoTheDoi: Number(tongQuanDiemTichLuy?.diemCoTheDoi || 0),
    tiLeQuyDoi: Number(tongQuanDiemTichLuy?.tiLeQuyDoi || 0),
  }), [tongQuanDiemTichLuy])

  useEffect(() => {
    if (daSuaHoSo) {
      return
    }

    const giaTriBanDau = khoiTaoGiaTriHoSo(nguoiDung)
    setDuLieuHoSo(giaTriBanDau)
    formHoSo.setFieldsValue(giaTriBanDau)
  }, [daSuaHoSo, formHoSo, nguoiDung])

  useEffect(() => () => {
    if (xemTruocAnhDaiDien) {
      URL.revokeObjectURL(xemTruocAnhDaiDien)
    }
  }, [xemTruocAnhDaiDien])

  const taoXuLyDoiTruongHoSo = (field) => (event) => {
    const value = event?.target?.value ?? ''
    setDaSuaHoSo(true)
    setDuLieuHoSo((prev) => ({ ...prev, [field]: value }))
  }

  const handleDoiAnhDaiDien = (file) => {
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

    if (xemTruocAnhDaiDien) {
      URL.revokeObjectURL(xemTruocAnhDaiDien)
    }

    const anhXemTruocTiepTheo = URL.createObjectURL(file)
    setXemTruocAnhDaiDien(anhXemTruocTiepTheo)
    return false
  }

  const handleLuuHoSo = async () => {
    try {
      const giaTriHopLe = await formHoSo.validateFields()
      setDangLuuThongTinHoSo(true)
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

      setDuLieuHoSo(giaTriHopLe)
      setDaSuaHoSo(false)
      formHoSo.setFieldsValue(giaTriHopLe)

      hienThongBao({
        message: '✅ Đã lưu thông tin thành công',
        tone: 'success',
        duration: 3000,
        title: '',
      })
    } finally {
      setDangLuuThongTinHoSo(false)
    }
  }

  const taoXuLyDoiTruongMatKhau = (field) => (event) => {
    const value = event?.target?.value ?? ''
    setMatKhauForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCapNhatMatKhau = async () => {
    try {
      const values = await formMatKhau.validateFields()
      setDangCapNhatMatKhauHoSo(true)
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
      setDangCapNhatMatKhauHoSo(false)
    }
  }

  const handleDoiDiem = async () => {
    if (!soDiemMuonDoi || soDiemMuonDoi <= 0) {
      hienThongBao({
        message: 'Vui lòng nhập số điểm muốn đổi (lớn hơn 0).',
        tone: 'error',
        duration: 3000,
        title: '',
      })
      return
    }

    if (soDiemMuonDoi > tongQuanDiem.diemCoTheDoi) {
      hienThongBao({
        message: `Số điểm muốn đổi vượt quá điểm có thể đổi (${dinhDangSo(tongQuanDiem.diemCoTheDoi)} điểm).`,
        tone: 'error',
        duration: 3000,
        title: '',
      })
      return
    }

    try {
      setDangDoiDiem(true)
      setPhanHoiDoiDiem(null)
      const phanHoi = await doiDiemTichLuyApi(soDiemMuonDoi)

      if (!phanHoi.duLieu) {
        hienThongBao({
          message: phanHoi.thongDiep || 'Không thể đổi điểm lúc này.',
          tone: 'error',
          duration: 3000,
          title: '',
        })
        return
      }

      setPhanHoiDoiDiem({
        soDiemDaDoi: phanHoi.duLieu.soDiemDaDoi,
        diemTruoc: phanHoi.duLieu.diemTruoc,
        diemSau: phanHoi.duLieu.diemSau,
      })
      setSoDiemMuonDoi(null)

      hienThongBao({
        message: `Đã đổi ${dinhDangSo(phanHoi.duLieu.soDiemDaDoi)} điểm thành công!`,
        tone: 'success',
        duration: 3000,
        title: 'Thành công',
      })
      onRefreshDiemTichLuy?.()
    } catch (error) {
      hienThongBao({
        message: error?.message || 'Không thể đổi điểm lúc này.',
        tone: 'error',
        duration: 3000,
        title: '',
      })
    } finally {
      setDangDoiDiem(false)
    }
  }

  const anhDaiDienHienThi = xemTruocAnhDaiDien || anhDaiDienMacDinh

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
          {anhDaiDienHienThi ? <img src={anhDaiDienHienThi} alt="Ảnh đại diện" /> : <BieuTuongAnhDaiDienNguoiDung />}
        </div>
        <Upload accept="image/*" showUploadList={false} beforeUpload={handleDoiAnhDaiDien}>
          <Button htmlType="button" className="btn ho-so-avatar-btn">
            Đổi ảnh
          </Button>
        </Upload>
      </div>

      <Form form={formHoSo} layout="vertical" initialValues={duLieuHoSo}>
        <div className="ho-so-form-grid">
          <Form.Item className="nhom-truong" label={<span className="nhan-truong">Tên</span>} name="fullName" rules={[{ required: true, message: 'Vui lòng nhập tên.' }]}>
            <Input id="ho-so-full-name" className="truong-nhap" onChange={taoXuLyDoiTruongHoSo('fullName')} />
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
            <Input id="ho-so-email" type="email" className="truong-nhap" onChange={taoXuLyDoiTruongHoSo('email')} />
          </Form.Item>

          <Form.Item className="nhom-truong full" label={<span className="nhan-truong">SĐT</span>} name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại.' }]}>
            <Input id="ho-so-phone" className="truong-nhap" onChange={taoXuLyDoiTruongHoSo('phone')} />
          </Form.Item>
        </div>
      </Form>

      <div className="ho-so-profile-actions">
        <Button htmlType="button" className="btn nut-chinh ho-so-save-btn" loading={dangLuuThongTinHoSo} onClick={handleLuuHoSo}>
          Lưu thay đổi
        </Button>
      </div>

      <section className="ho-so-diem-tich-luy-section" aria-label="Điểm tích lũy">
        <div className="ho-so-subsection-heading">
          <h3>Điểm tích lũy</h3>
          <p>Theo dõi số điểm hiện có và lịch sử biến động điểm từ các đơn hàng của bạn.</p>
        </div>

        <div className="ho-so-diem-tich-luy-grid">
          <article className="ho-so-diem-tich-luy-card">
            <span className="ho-so-diem-tich-luy-label">Tổng điểm hiện có</span>
            <strong className="ho-so-diem-tich-luy-value">{dinhDangSo(tongQuanDiem.tongDiem)}</strong>
          </article>

          <article className="ho-so-diem-tich-luy-card">
            <span className="ho-so-diem-tich-luy-label">Điểm có thể đổi</span>
            <strong className="ho-so-diem-tich-luy-value">{dinhDangSo(tongQuanDiem.diemCoTheDoi)}</strong>
          </article>

          <article className="ho-so-diem-tich-luy-card">
            <span className="ho-so-diem-tich-luy-label">Tỷ lệ quy đổi</span>
            <strong className="ho-so-diem-tich-luy-value">1 điểm / {dinhDangSo(tongQuanDiem.tiLeQuyDoi)}đ</strong>
          </article>
        </div>

        <div className="ho-so-diem-tich-luy-history">
          <div className="ho-so-diem-tich-luy-history-header">
            <h4>Lịch sử điểm gần đây</h4>
            <span>{lichSuDiemTichLuy.length} giao dịch</span>
          </div>

          {lichSuDiemTichLuy.length ? (
            <div className="ho-so-diem-tich-luy-history-list">
              {lichSuDiemTichLuy.map((giaoDich) => (
                <article key={giaoDich.maGiaoDichDiem || `${giaoDich.ngayTao}-${giaoDich.maDonHang}`} className="ho-so-diem-tich-luy-history-item">
                  <div>
                    <strong>{giaoDich.moTa || giaoDich.loaiBienDong || 'Biến động điểm'}</strong>
                    <p>
                      {giaoDich.maDonHang ? `Đơn ${giaoDich.maDonHang} • ` : ''}
                      {dinhDangThoiGianDiem(giaoDich.ngayTao)}
                    </p>
                  </div>
                  <div className="ho-so-diem-tich-luy-history-meta">
                    <strong className={giaoDich.soDiem >= 0 ? 'ho-so-diem-tich-luy-cong' : 'ho-so-diem-tich-luy-tru'}>
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
            <div className="ho-so-diem-tich-luy-empty">Chưa có lịch sử điểm tích lũy.</div>
          )}
        </div>

        <div className="ho-so-doi-diem-section">
          <div className="ho-so-subsection-heading">
            <h4>Đổi điểm tích lũy</h4>
            <p>Sử dụng điểm tích lũy để đổi các ưu đãi đặc biệt.</p>
          </div>

          <div className="ho-so-doi-diem-form">
            <div className="ho-so-doi-diem-input-row">
              <Form.Item className="nhom-truong" label={<span className="nhan-truong">Số điểm muốn đổi</span>}>
                <InputNumber
                  id="ho-so-so-diem-muon-doi"
                  className="truong-nhap"
                  min={1}
                  max={tongQuanDiem.diemCoTheDoi}
                  value={soDiemMuonDoi}
                  onChange={(value) => setSoDiemMuonDoi(value)}
                  placeholder={`Tối đa: ${dinhDangSo(tongQuanDiem.diemCoTheDoi)} điểm`}
                  disabled={dangDoiDiem}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Button
                htmlType="button"
                className="btn nut-chinh ho-so-doi-diem-btn"
                onClick={handleDoiDiem}
                loading={dangDoiDiem}
                disabled={!soDiemMuonDoi || soDiemMuonDoi <= 0}
              >
                Đổi điểm
              </Button>
            </div>

            {phanHoiDoiDiem && (
              <div className="ho-so-doi-diem-result">
                <p className="ho-so-doi-diem-success">
                  Đã đổi <strong>{dinhDangSo(phanHoiDoiDiem.soDiemDaDoi)} điểm</strong> thành công!
                </p>
                <p className="ho-so-doi-diem-balance">
                  Số dư điểm: {dinhDangSo(phanHoiDoiDiem.diemTruoc)} → <strong>{dinhDangSo(phanHoiDoiDiem.diemSau)} điểm</strong>
                </p>
                <Button htmlType="button" className="btn" onClick={onRefreshDiemTichLuy}>
                  Cập nhật lại
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="ho-so-password-section">
        <div className="ho-so-subsection-heading">
          <h3>Đổi mật khẩu</h3>
          <p>Thiết lập lại mật khẩu đăng nhập để bảo mật tài khoản tốt hơn.</p>
        </div>

        <Form form={formMatKhau} layout="vertical" initialValues={matKhauForm} onFinish={handleCapNhatMatKhau}>
          <input type="text" name="username" autoComplete="username" value={duLieuHoSo.email || ''} readOnly hidden />
          <div className="ho-so-form-grid">
            <Form.Item
              className="nhom-truong full"
              label={<span className="nhan-truong">Mật khẩu hiện tại</span>}
              name="currentPassword"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại.' }]}
            >
              <Input.Password id="ho-so-current-password" autoComplete="current-password" className="truong-nhap" onChange={taoXuLyDoiTruongMatKhau('currentPassword')} />
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
              <Input.Password id="ho-so-new-password" autoComplete="new-password" className="truong-nhap" onChange={taoXuLyDoiTruongMatKhau('newPassword')} />
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
              <Input.Password id="ho-so-confirm-password" autoComplete="new-password" className="truong-nhap" onChange={taoXuLyDoiTruongMatKhau('confirmPassword')} />
            </Form.Item>
          </div>

          <div className="ho-so-profile-actions">
            <Button htmlType="submit" className="btn nut-chinh ho-so-save-btn" loading={dangCapNhatMatKhauHoSo}>
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
