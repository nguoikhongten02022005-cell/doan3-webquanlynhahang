import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGioHang } from '../context/GioHangContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { useThongBao } from '../context/ThongBaoContext'
import { dinhDangTienTeVietNam } from '../utils/tienTe'
import { xoaBanNhapTamThanhToan, layBanNhapTamThanhToan, luuBanNhapTamThanhToan } from '../services/dichVuBanNhapTamThanhToan'
import { taoDonHangApi } from '../services/api/apiDonHang'
import { xoaPhieuGiamGiaDaApDung, layPhieuGiamGiaDaApDung, tinhSoTienGiamTheoVoucher } from '../services/dichVuPhieuGiamGia'
import { DANH_SACH_PHIEU_GIAM_GIA_GOI_Y } from '../features/gioHang/constants/phieuGiamGia'
import { taoDuLieuTaoDonHang, layMonKhongHopLeTrongDonHang, TUY_CHON_PHUONG_THUC_THANH_TOAN } from '../utils/donHang'

const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.round((tamTinh * 0.05) / 1000) * 1000 : 0)

function ThanhToanPage() {
  const navigate = useNavigate()
  const { cartItems, xoaToanBoGio, layTuyChonHienThiMon, layKhoaMonTrongGio } = useGioHang()
  const { nguoiDungHienTai } = useXacThuc()
  const { hienLoi, hienThanhCong, hienCanhBao } = useThongBao()

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    tableNumber: '',
    paymentMethod: 'TienMat',
  })
  const [appliedVoucher, setAppliedVoucher] = useState(null)

  useEffect(() => {
    const voucher = layPhieuGiamGiaDaApDung()

    if (!voucher) {
      xoaPhieuGiamGiaDaApDung()
    } else {
      setAppliedVoucher(voucher)
    }

    const banNhapTam = layBanNhapTamThanhToan()
    if (banNhapTam) {
      setFormData((prev) => ({
        ...prev,
        note: String(banNhapTam.note ?? '').slice(0, 300),
        tableNumber: '',
      }))
    }
  }, [])

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const serviceFee = tinhPhiDichVu(subtotal)
  const tongTienXetVoucher = subtotal + serviceFee
  const discountAmount = tinhSoTienGiamTheoVoucher(appliedVoucher, tongTienXetVoucher)
  const tongCong = Math.max(0, tongTienXetVoucher - discountAmount)

  const handleChange = (event) => {
    const { name, value } = event.target
    const giaTriDaChuanHoa = name === 'note' ? value.slice(0, 300) : value

    setFormData((prev) => {
      const nextFormData = {
        ...prev,
        [name]: giaTriDaChuanHoa,
        tableNumber: '',
      }

      luuBanNhapTamThanhToan({
        note: nextFormData.note,
        tableNumber: '',
      })

      return nextFormData
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (cartItems.length === 0) {
      hienCanhBao('Giỏ hàng đang trống. Vui lòng chọn món trước khi thanh toán.')
      navigate('/thuc-don')
      return
    }

    if (!formData.fullName || !formData.phone) {
      hienCanhBao('Vui lòng nhập đầy đủ họ tên và số điện thoại.')
      return
    }

    const invalidOrderItems = layMonKhongHopLeTrongDonHang(cartItems)
    if (invalidOrderItems.length > 0) {
      hienLoi('Có món trong giỏ hàng không còn hợp lệ để tạo đơn. Vui lòng quay lại menu và thêm lại món.')
      return
    }

    try {
        const orderPayload = taoDuLieuTaoDonHang({
          cartItems,
          voucherCode: appliedVoucher?.code,
          customer: {
            customerCode: nguoiDungHienTai?.maKH ?? '',
            fullName: formData.fullName,
            phone: formData.phone,
            email: nguoiDungHienTai?.email ?? '',
            address: formData.address,
          },
        note: formData.note,
        tableNumber: formData.tableNumber,
        paymentMethod: formData.paymentMethod,
      })

        await taoDonHangApi(orderPayload)

        xoaPhieuGiamGiaDaApDung()
        xoaBanNhapTamThanhToan()

      if (typeof xoaToanBoGio === 'function') {
        xoaToanBoGio()
      }

      hienThanhCong('Đặt hàng thành công. Bạn có thể theo dõi đơn trong hồ sơ cá nhân.')
      navigate('/ho-so')
    } catch (error) {
      hienLoi(error?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.')
    }
  }

  return (
    <div className="thanh-toan-page thanh-toan-page-editorial">
      <div className="container">
        <div className="thanh-toan-header">
          <p className="thanh-toan-kicker">Hoàn tất đơn gọi món</p>
          <h1>Thanh toán đơn hàng</h1>
        </div>

        <form className="thanh-toan-layout" onSubmit={handleSubmit}>
          <section className="thanh-toan-form-panel">
            <h2>Thông tin liên hệ</h2>

            <div className="thanh-toan-form-grid">
              <div className="nhom-truong full">
                <label className="nhan-truong" htmlFor="fullName">
                  Họ tên
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="truong-nhap"
                  placeholder="Nhập họ tên người đặt hoặc người nhận món"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="nhom-truong">
                <label className="nhan-truong" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="truong-nhap"
                  placeholder="0901 234 567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="nhom-truong full">
                <label className="nhan-truong" htmlFor="address">
                  Địa chỉ
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="truong-nhap"
                  placeholder="Nhập địa chỉ nếu cần giao hoặc xác nhận vị trí phục vụ"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="nhom-truong full">
                <label className="nhan-truong" htmlFor="note">
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  name="note"
                  className="truong-van-ban"
                  placeholder="Dị ứng thực phẩm, yêu cầu đặc biệt về món ăn, hoặc ghi chú khác cho bếp..."
                  rows="4"
                  maxLength={300}
                  value={formData.note}
                  onChange={handleChange}
                />
                <div className="gio-hang-note-counter thanh-toan-note-counter">{formData.note.length}/300</div>
              </div>
            </div>

            <div className="thanh-toan-payment-block">
              <h3>Phương thức thanh toán</h3>
              <div className="thanh-toan-payment-options">
                {TUY_CHON_PHUONG_THUC_THANH_TOAN.map((method) => (
                  <label key={method.value} className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                    />
                    <span>
                      <strong>{method.label}</strong>
                      <small>{method.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <aside className="thanh-toan-tom-tat-panel">
            <div className="thanh-toan-tom-tat-card">
              <h2>Tóm tắt đơn hàng</h2>

              {cartItems.length === 0 ? (
                <div className="thanh-toan-empty">Chưa có món nào trong giỏ hàng.</div>
              ) : (
                <div className="thanh-toan-item-list">
                  {cartItems.map((item, index) => {
                    const itemKey =
                      typeof layKhoaMonTrongGio === 'function'
                        ? layKhoaMonTrongGio(item)
                        : `${item.id}-${index}`
                    const optionLines =
                      typeof layTuyChonHienThiMon === 'function'
                        ? layTuyChonHienThiMon(item)
                        : []

                    return (
                      <div key={itemKey} className="thanh-toan-item">
                        <div>
                          <p className="thanh-toan-item-name">{item.name}</p>
                          {optionLines.length > 0 && (
                            <div className="thanh-toan-item-options">
                              {optionLines.map((line) => (
                                <p key={line}>{line}</p>
                              ))}
                            </div>
                          )}
                          <p className="thanh-toan-item-qty">x{item.quantity}</p>
                        </div>
                        <strong>{dinhDangTienTeVietNam(item.price * item.quantity)}</strong>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="thanh-toan-totals">
                <div className="thanh-toan-voucher-xem">
                  <div className="thanh-toan-voucher-xem-head">
                    <strong>Mã giảm giá khả dụng</strong>
                    <span>{DANH_SACH_PHIEU_GIAM_GIA_GOI_Y.length} mã</span>
                  </div>
                  <div className="thanh-toan-voucher-xem-list">
                    {DANH_SACH_PHIEU_GIAM_GIA_GOI_Y.map((maGiamGia) => {
                      const dangDuocApDung = appliedVoucher?.code === maGiamGia.code

                      return (
                        <div
                          key={maGiamGia.code}
                          className={`thanh-toan-voucher-xem-item ${dangDuocApDung ? 'active' : ''}`}
                        >
                          <div>
                            <strong>{maGiamGia.code}</strong>
                            <p>{maGiamGia.moTa}</p>
                          </div>
                          <span>{dangDuocApDung ? 'Đang áp dụng' : maGiamGia.giaTri}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="tom-tat-row">
                  <span>Tạm tính món</span>
                  <span>{dinhDangTienTeVietNam(subtotal)}</span>
                </div>
                <div className="tom-tat-row">
                  <span>Phí dịch vụ (5%)</span>
                  <span>{dinhDangTienTeVietNam(serviceFee)}</span>
                </div>
                <div className="tom-tat-row tom-tat-discount">
                  <span>Giảm giá {appliedVoucher ? `(${appliedVoucher.code})` : ''}</span>
                  <span>-{dinhDangTienTeVietNam(discountAmount)}</span>
                </div>
                <div className="tom-tat-row tom-tat-total">
                  <span>Tổng cộng</span>
                  <strong>{dinhDangTienTeVietNam(tongCong)}</strong>
                </div>
              </div>

              <p className="thanh-toan-tom-tat-note">
                Tổng tiền cuối cùng sẽ được xác nhận khi đơn hàng được tạo từ dữ liệu thực đơn hiện tại.
              </p>

              <button type="submit" className="btn gio-hang-checkout-btn w-full" disabled={cartItems.length === 0}>
                Đặt hàng ngay
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default ThanhToanPage
