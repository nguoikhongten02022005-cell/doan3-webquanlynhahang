import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGioHang } from '../context/GioHangContext'
import { useXacThuc } from '../hooks/useXacThuc'
import { useThongBao } from '../context/ThongBaoContext'
import { dinhDangTienTeVietNam } from '../utils/tienTe'
import { xoaBanNhapTamThanhToan, layBanNhapTamThanhToan, luuBanNhapTamThanhToan } from '../services/dichVuBanNhapTamThanhToan'
import { taoDonHangApi } from '../services/api/apiDonHang'
import { xoaPhieuGiamGiaDaApDung, layPhieuGiamGiaDaApDung, tinhSoTienGiamTheoPhieuGiamGia } from '../services/dichVuPhieuGiamGia'
import { layTongQuanDiemTichLuyApi } from '../services/api/apiDiemTichLuy'
import { DANH_SACH_PHIEU_GIAM_GIA_GOI_Y } from '../features/gioHang/constants/phieuGiamGia'
import { taoDuLieuTaoDonHang, layMonKhongHopLeTrongDonHang, TUY_CHON_PHUONG_THUC_THANH_TOAN } from '../utils/donHang'
import { tinhPhiDichVu } from '../utils/phiDichVu'

const TI_LE_DIEM = 100
const GIA_TRI_DIEM = 10000

const tinhSoTienGiamTuDiem = (soDiem) => Math.floor(soDiem / TI_LE_DIEM) * GIA_TRI_DIEM

function ThanhToanPage() {
  const navigate = useNavigate()
  const { cartItems, xoaToanBoGio, layTuyChonHienThiMon, layKhoaMonTrongGio } = useGioHang()
  const { nguoiDungHienTai } = useXacThuc()
  const { hienLoi, hienThanhCong, hienCanhBao } = useThongBao()

  const [duLieuForm, setDuLieuForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    tableNumber: '',
    paymentMethod: 'TienMat',
  })
  const [phieuGiamGiaDaApDung, setPhieuGiamGiaDaApDung] = useState(null)
  const [soDiem, setSoDiem] = useState(0)
  const [thongTinDiem, setThongTinDiem] = useState(null)
  const [dangTaiDiem, setDangTaiDiem] = useState(false)

  useEffect(() => {
    const phieuGiamGiaDaLuu = layPhieuGiamGiaDaApDung()

    if (!phieuGiamGiaDaLuu) {
      xoaPhieuGiamGiaDaApDung()
    } else {
      setPhieuGiamGiaDaApDung(phieuGiamGiaDaLuu)
    }

    const banNhapTam = layBanNhapTamThanhToan()
    if (banNhapTam) {
      setDuLieuForm((prev) => ({
        ...prev,
        note: String(banNhapTam.note ?? '').slice(0, 300),
        tableNumber: '',
      }))
    }

    if (nguoiDungHienTai?.maKH) {
      setDangTaiDiem(true)
      layTongQuanDiemTichLuyApi(nguoiDungHienTai.maKH)
        .then((res) => setThongTinDiem(res.data || res))
        .catch(() => setThongTinDiem(null))
        .finally(() => setDangTaiDiem(false))
    }
  }, [nguoiDungHienTai])

  const tamTinh = useMemo(
    () => cartItems.reduce((tong, item) => tong + item.price * item.quantity, 0),
    [cartItems],
  )

  const phiDichVu = tinhPhiDichVu(tamTinh)
  const tongTienXetPhieuGiamGia = tamTinh + phiDichVu
  const soTienGiam = tinhSoTienGiamTheoPhieuGiamGia(phieuGiamGiaDaApDung, tongTienXetPhieuGiamGia)
  const soTienGiamTuDiem = tinhSoTienGiamTuDiem(soDiem)
  const tongCong = Math.max(0, tongTienXetPhieuGiamGia - soTienGiam - soTienGiamTuDiem)

  const handleDoiTruong = (event) => {
    const { name, value } = event.target
    const giaTriDaChuanHoa = name === 'note' ? value.slice(0, 300) : value

    setDuLieuForm((prev) => {
      const duLieuFormKeTiep = {
        ...prev,
        [name]: giaTriDaChuanHoa,
        tableNumber: '',
      }

      luuBanNhapTamThanhToan({
        note: duLieuFormKeTiep.note,
        tableNumber: '',
      })

      return duLieuFormKeTiep
    })
  }

  const handleDiemChange = (e) => {
    const giaTri = Number(e.target.value) || 0
    const diemToiDa = thongTinDiem?.tongDiem || 0
    const diemCoTheDung = Math.min(diemToiDa, Math.floor(tongTienXetPhieuGiamGia / GIA_TRI_DIEM) * TI_LE_DIEM)
    setSoDiem(Math.max(0, Math.min(giaTri, diemCoTheDung)))
  }

  const handleGuiDon = async (event) => {
    event.preventDefault()

    if (cartItems.length === 0) {
      hienCanhBao('Giỏ hàng đang trống. Vui lòng chọn món trước khi thanh toán.')
      navigate('/thuc-don')
      return
    }

    if (!duLieuForm.fullName || !duLieuForm.phone) {
      hienCanhBao('Vui lòng nhập đầy đủ họ tên và số điện thoại.')
      return
    }

    const danhSachMonKhongHopLe = layMonKhongHopLeTrongDonHang(cartItems)
    if (danhSachMonKhongHopLe.length > 0) {
      hienLoi('Có món trong giỏ hàng không còn hợp lệ để tạo đơn. Vui lòng quay lại menu và thêm lại món.')
      return
    }

    try {
        const payloadTaoDonHang = taoDuLieuTaoDonHang({
          cartItems,
          voucherCode: phieuGiamGiaDaApDung?.code,
          soDiem: soDiem > 0 ? soDiem : undefined,
          customer: {
            customerCode: nguoiDungHienTai?.maKH ?? '',
            fullName: duLieuForm.fullName,
            phone: duLieuForm.phone,
            email: nguoiDungHienTai?.email ?? '',
            address: duLieuForm.address,
          },
        note: duLieuForm.note,
        tableNumber: duLieuForm.tableNumber,
        paymentMethod: duLieuForm.paymentMethod,
      })

        await taoDonHangApi(payloadTaoDonHang)

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

        <form className="thanh-toan-layout" onSubmit={handleGuiDon}>
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
                  value={duLieuForm.fullName}
                  onChange={handleDoiTruong}
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
                  value={duLieuForm.phone}
                  onChange={handleDoiTruong}
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
                  value={duLieuForm.address}
                  onChange={handleDoiTruong}
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
                  value={duLieuForm.note}
                  onChange={handleDoiTruong}
                />
                <div className="gio-hang-note-counter thanh-toan-note-counter">{duLieuForm.note.length}/300</div>
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
                      checked={duLieuForm.paymentMethod === method.value}
                      onChange={handleDoiTruong}
                    />
                    <span>
                      <strong>{method.label}</strong>
                      <small>{method.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {thongTinDiem && (
              <div className="thanh-toan-points-block">
                <h3>Điểm tích lũy</h3>
                <div className="thanh-toan-points-info">
                  <span>Số dư điểm: <strong>{thongTinDiem.tongDiem || 0} điểm</strong></span>
                  {dangTaiDiem && <span className="thanh-toan-points-loading">Đang tải...</span>}
                </div>
                {thongTinDiem.tongDiem > 0 ? (
                  <div className="thanh-toan-points-input">
                    <label htmlFor="soDiem">Sử dụng điểm (100 điểm = 10.000đ)</label>
                    <input
                      id="soDiem"
                      type="number"
                      min="0"
                      max={Math.min(thongTinDiem.tongDiem, Math.floor(tongTienXetPhieuGiamGia / GIA_TRI_DIEM) * TI_LE_DIEM)}
                      value={soDiem}
                      onChange={handleDiemChange}
                      className="truong-nhap"
                    />
                    {soDiem > 0 && (
                      <span className="thanh-toan-points-value">
                        Giảm: <strong>{dinhDangTienTeVietNam(soTienGiamTuDiem)}</strong>
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="thanh-toan-points-empty">Bạn chưa có điểm tích lũy.</p>
                )}
              </div>
            )}
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
                      const dangDuocApDung = phieuGiamGiaDaApDung?.code === maGiamGia.code

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
                  <span>{dinhDangTienTeVietNam(tamTinh)}</span>
                </div>
                <div className="tom-tat-row">
                  <span>Phí dịch vụ (5%)</span>
                  <span>{dinhDangTienTeVietNam(phiDichVu)}</span>
                </div>
                <div className="tom-tat-row tom-tat-discount">
                  <span>Giảm giá {phieuGiamGiaDaApDung ? `(${phieuGiamGiaDaApDung.code})` : ''}</span>
                  <span>-{dinhDangTienTeVietNam(soTienGiam)}</span>
                </div>
                {soDiem > 0 && (
                  <div className="tom-tat-row tom-tat-discount">
                    <span>Giảm điểm ({soDiem} điểm)</span>
                    <span>-{dinhDangTienTeVietNam(soTienGiamTuDiem)}</span>
                  </div>
                )}
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
