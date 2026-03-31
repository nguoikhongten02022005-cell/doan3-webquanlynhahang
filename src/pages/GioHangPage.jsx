import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGioHang } from '../context/GioHangContext'
import { useThongBao } from '../context/ThongBaoContext'
import { dinhDangTienTeVietNam } from '../utils/tienTe'
import {
  xoaBanNhapTamThanhToan,
  layBanNhapTamThanhToan,
  luuBanNhapTamThanhToan,
} from '../services/dichVuBanNhapTamThanhToan'
import {
  xoaPhieuGiamGiaDaApDung as clearStoredVoucher,
  layPhieuGiamGiaDaApDung as getStoredVoucher,
  luuPhieuGiamGiaDaApDung as saveVoucher,
} from '../services/dichVuPhieuGiamGia'
import { kiemTraPhieuGiamGiaApi } from '../services/api/apiPhieuGiamGia'

const tinhPhiDichVu = (tamTinh) => (tamTinh > 0 ? Math.round((tamTinh * 0.05) / 1000) * 1000 : 0)

const tinhSoTienGiam = (voucher, tamTinh, phiDichVu) => {
  if (!voucher) {
    return 0
  }

  const phanTramGiam = Number(voucher.discountPercent || 0)
  const soTienGiamTamTinh = phanTramGiam > 0
    ? Math.round((tamTinh * phanTramGiam) / 100)
    : Number(voucher.amount || 0)

  if (!Number.isFinite(soTienGiamTamTinh) || soTienGiamTamTinh <= 0) {
    return 0
  }

  return Math.min(soTienGiamTamTinh, tamTinh)
}

function GioHangPage() {
  const navigate = useNavigate()
  const { cartItems, capNhatSoLuong, xoaKhoiGio, layKhoaMonTrongGio, layTuyChonHienThiMon } = useGioHang()
  const { hienCanhBao } = useThongBao()

  const [ghiChu, setGhiChu] = useState('')
  const [maVoucherNhap, setMaVoucherNhap] = useState('')
  const [voucherDaApDung, setVoucherDaApDung] = useState(null)
  const [loiVoucher, setLoiVoucher] = useState('')
  const [dangApVoucher, setDangApVoucher] = useState(false)

  const tongSoLuongMon = cartItems.reduce((tong, item) => tong + item.quantity, 0)
  const tamTinh = cartItems.reduce((tong, item) => tong + item.price * item.quantity, 0)
  const phiDichVu = tinhPhiDichVu(tamTinh)
  const soTienGiam = tinhSoTienGiam(voucherDaApDung, tamTinh, phiDichVu)
  const tongTien = Math.max(0, tamTinh + phiDichVu - soTienGiam)

  useEffect(() => {
    const voucher = getStoredVoucher()
    if (voucher) {
      setVoucherDaApDung(voucher)
      setMaVoucherNhap(voucher.code)
    }

    const banNhapTam = layBanNhapTamThanhToan()
    if (banNhapTam) {
      setGhiChu(String(banNhapTam.note ?? '').slice(0, 300))
    }
  }, [])

  useEffect(() => {
    if (tamTinh > 0 || !voucherDaApDung) {
      return
    }

    setVoucherDaApDung(null)
    setLoiVoucher('❌ Mã không hợp lệ hoặc đã hết hạn')
    clearStoredVoucher()
  }, [tamTinh, voucherDaApDung])

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) {
      hienCanhBao('Giỏ hàng đang trống. Hãy chọn món trước khi sang bước thanh toán.')
      xoaBanNhapTamThanhToan()
      return
    }

    if (voucherDaApDung) {
      saveVoucher({
        ...voucherDaApDung,
        amount: soTienGiam,
      })
    } else {
      clearStoredVoucher()
    }

    luuBanNhapTamThanhToan({ note: ghiChu, tableNumber: '' })
    navigate('/thanh-toan')
  }

  const handleApplyVoucher = async () => {
    if (tamTinh <= 0) {
      setVoucherDaApDung(null)
      setLoiVoucher('❌ Mã không hợp lệ hoặc đã hết hạn')
      clearStoredVoucher()
      return
    }

    const maVoucher = maVoucherNhap.trim().toUpperCase()

    if (!maVoucher) {
      setVoucherDaApDung(null)
      setLoiVoucher('❌ Mã không hợp lệ hoặc đã hết hạn')
      clearStoredVoucher()
      return
    }

    setDangApVoucher(true)

    try {
      const { duLieu } = await kiemTraPhieuGiamGiaApi(maVoucher, tamTinh)
      if (!duLieu) {
        setVoucherDaApDung(null)
        setLoiVoucher('❌ Mã không hợp lệ hoặc đã hết hạn')
        clearStoredVoucher()
        return
      }

      const laGiamPhanTram = String(duLieu.discountType || '').toLowerCase() === 'phantram'
      const phanTramGiam = laGiamPhanTram ? Number(duLieu.discountValue || 0) : 0
      const soTienGiamCoDinh = laGiamPhanTram ? 0 : Number(duLieu.discountValue || 0)
      const soTienGiamTamTinh = laGiamPhanTram
        ? Math.round((tamTinh * phanTramGiam) / 100)
        : soTienGiamCoDinh
      const soTienGiamToiDa = duLieu.maxDiscountAmount == null
        ? soTienGiamTamTinh
        : Math.min(soTienGiamTamTinh, Number(duLieu.maxDiscountAmount || 0))

      const voucherHopLe = saveVoucher({
        code: duLieu.code || maVoucher,
        discountPercent: phanTramGiam,
        amount: soTienGiamToiDa,
      })

      if (!voucherHopLe) {
        setVoucherDaApDung(null)
        setLoiVoucher('❌ Mã không hợp lệ hoặc đã hết hạn')
        clearStoredVoucher()
        return
      }

      setVoucherDaApDung(voucherHopLe)
      setMaVoucherNhap(voucherHopLe.code)
      setLoiVoucher('')
    } catch (error) {
      setVoucherDaApDung(null)
      setLoiVoucher(`❌ ${error?.message || 'Mã không hợp lệ hoặc đã hết hạn'}`)
      clearStoredVoucher()
    } finally {
      setDangApVoucher(false)
    }
  }

  const handleClearVoucher = () => {
    setVoucherDaApDung(null)
    setMaVoucherNhap('')
    setLoiVoucher('')
    clearStoredVoucher()
  }

  const renderVoucherMessage = () => {
    if (loiVoucher) {
      return <p className="voucher-message error">{loiVoucher}</p>
    }

    if (voucherDaApDung) {
      return (
        <p className="voucher-message success">
          ✅ Áp dụng thành công — Giảm {voucherDaApDung.discountPercent || 0}%
        </p>
      )
    }

    return null
  }

  return (
    <div className="gio-hang-page gio-hang-page-editorial">
      <div className="container">
        <div className="gio-hang-layout">
          <div className="gio-hang-items-section">
            <div className="gio-hang-list-head">
              <h2>Giỏ hàng của bạn</h2>
              <span>{tongSoLuongMon > 0 ? `${tongSoLuongMon} món` : 'Giỏ hàng trống'}</span>
            </div>

            {cartItems.length === 0 ? (
              <div className="gio-hang-empty">
                <p>Giỏ hàng trống</p>
                <button type="button" className="btn nut-chinh" onClick={() => navigate('/thuc-don')}>
                  Xem thực đơn
                </button>
              </div>
            ) : (
              <div className="gio-hang-item-list">
                {cartItems.map((item) => {
                  const itemKey = typeof layKhoaMonTrongGio === 'function' ? layKhoaMonTrongGio(item) : item.id
                  const optionLines = typeof layTuyChonHienThiMon === 'function' ? layTuyChonHienThiMon(item) : []
                  const coAnh = typeof item.image === 'string' && item.image.trim().length > 0
                  const moTaNgan = String(optionLines.join(' • ') || item.description || 'Món sẽ được chuẩn bị ngay sau khi bạn xác nhận đơn.')
                    .trim()
                  const tongTienMon = item.price * item.quantity

                  return (
                    <article key={itemKey} className="gio-hang-item">
                      <div className="gio-hang-item-media">
                        {coAnh ? (
                          <img className="gio-hang-item-image" src={item.image} alt={item.name} loading="lazy" />
                        ) : (
                          <div className="gio-hang-item-image gio-hang-item-image-placeholder" aria-hidden="true">
                            {item.name?.slice(0, 1) || 'M'}
                          </div>
                        )}
                      </div>

                      <div className="gio-hang-item-content">
                        <div className="gio-hang-item-top">
                          <div className="gio-hang-item-copy">
                            <h3>{item.name}</h3>
                            <p className="gio-hang-item-description" title={moTaNgan}>{moTaNgan}</p>
                          </div>

                          <button
                            type="button"
                            className="remove-btn gio-hang-remove-btn"
                            onClick={() => xoaKhoiGio(itemKey)}
                            aria-label={`Xóa nhanh ${item.name}`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path
                                d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="gio-hang-item-bottom">
                          <div className="quantity-control" aria-label={`Số lượng món ${item.name}`}>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => capNhatSoLuong(itemKey, -1)}
                              aria-label="Giảm số lượng"
                            >
                              -
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => capNhatSoLuong(itemKey, 1)}
                              aria-label="Tăng số lượng"
                            >
                              +
                            </button>
                          </div>

                          <strong className="gio-hang-item-total">{dinhDangTienTeVietNam(tongTienMon)}</strong>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>

          <div className="gio-hang-summary">
            <div className="tom-tat-card gio-hang-tom-tat-card">
              <h2>Tổng kết đơn</h2>

              <div className="voucher-block">
                <div className="voucher-header">
                  <h3>Mã giảm giá</h3>
                </div>
                <div className="voucher-controls">
                  <input
                    type="text"
                    className="truong-nhap voucher-input"
                    placeholder="Nhập mã giảm giá"
                    value={maVoucherNhap}
                    onChange={(event) => {
                      setMaVoucherNhap(event.target.value)
                      if (loiVoucher) {
                        setLoiVoucher('')
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn nut-chinh voucher-apply-btn"
                    onClick={handleApplyVoucher}
                    disabled={dangApVoucher}
                  >
                    {dangApVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                  </button>
                  {voucherDaApDung && (
                    <button type="button" className="btn nut-phu voucher-clear-btn" onClick={handleClearVoucher}>
                      Bỏ mã
                    </button>
                  )}
                </div>
                {renderVoucherMessage()}
              </div>

              <div className="tom-tat-row">
                <span>Tạm tính</span>
                <span>{dinhDangTienTeVietNam(tamTinh)}</span>
              </div>

              <div className="tom-tat-row">
                <span>Phí dịch vụ (5%)</span>
                <span>{dinhDangTienTeVietNam(phiDichVu)}</span>
              </div>

              {voucherDaApDung && (
                <div className="tom-tat-row tom-tat-discount">
                  <span>Giảm giá ({voucherDaApDung.code})</span>
                  <span>-{dinhDangTienTeVietNam(soTienGiam)}</span>
                </div>
              )}

              <div className="tom-tat-divider"></div>

              <div className="tom-tat-row tom-tat-total">
                <span>Tổng cộng</span>
                <strong>{dinhDangTienTeVietNam(tongTien)}</strong>
              </div>

              <div className="tom-tat-form">
                <div className="nhom-truong">
                  <label className="nhan-truong" htmlFor="gio-hang-note">Ghi chú cho quán</label>
                  <textarea
                    id="gio-hang-note"
                    className="truong-van-ban"
                    placeholder="Dị ứng thực phẩm, yêu cầu đặc biệt về món ăn, hoặc ghi chú khác cho bếp..."
                    rows="3"
                    maxLength={300}
                    value={ghiChu}
                    onChange={(event) => setGhiChu(event.target.value.slice(0, 300))}
                  ></textarea>
                  <div className="gio-hang-note-counter">{ghiChu.length}/300</div>
                </div>
              </div>

              <button
                type="button"
                className="btn gio-hang-checkout-btn w-full"
                onClick={handleGoToCheckout}
                disabled={cartItems.length === 0}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GioHangPage
