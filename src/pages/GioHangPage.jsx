import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGioHang } from '../context/GioHangContext'
import { useThongBao } from '../context/ThongBaoContext'
import { dinhDangTienTe } from '../utils/tienTe'
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

function GioHangPage() {
  const navigate = useNavigate()
  const { cartItems, capNhatSoLuong, xoaKhoiGio, layKhoaMonTrongGio, layTuyChonHienThiMon } = useGioHang()
  const { hienCanhBao } = useThongBao()

  const [ghiChu, setGhiChu] = useState('')
  const [soBan, setSoBan] = useState('')
  const [maVoucherNhap, setMaVoucherNhap] = useState('')
  const [voucherDaApDung, setVoucherDaApDung] = useState(null)
  const [loiVoucher, setLoiVoucher] = useState('')
  const [dangApVoucher, setDangApVoucher] = useState(false)

  const tamTinh = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const phiDichVu = 0
  const soTienGiam = voucherDaApDung ? Math.min(voucherDaApDung.amount, tamTinh + phiDichVu) : 0
  const tongTien = Math.max(0, tamTinh + phiDichVu - soTienGiam)

  useEffect(() => {
    const voucher = getStoredVoucher()
    if (voucher) {
      setVoucherDaApDung(voucher)
      setMaVoucherNhap(voucher.code)
    }

    const banNhapTam = layBanNhapTamThanhToan()
    if (banNhapTam) {
      setGhiChu(banNhapTam.note)
      setSoBan(banNhapTam.tableNumber)
    }
  }, [])

  useEffect(() => {
    if (tamTinh > 0 || !voucherDaApDung) {
      return
    }

    setVoucherDaApDung(null)
    setLoiVoucher('Giỏ hàng đang trống, chưa thể áp mã giảm giá.')
    clearStoredVoucher()
  }, [tamTinh, voucherDaApDung])

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) {
      hienCanhBao('Giỏ hàng đang trống. Hãy chọn món trước khi sang bước thanh toán.')
      xoaBanNhapTamThanhToan()
      return
    }

    if (voucherDaApDung) {
      saveVoucher(voucherDaApDung)
    } else {
      clearStoredVoucher()
    }

    luuBanNhapTamThanhToan({ note: ghiChu, tableNumber: soBan })
    navigate('/thanh-toan')
  }

  const handleApplyVoucher = async () => {
    if (tamTinh <= 0) {
      setVoucherDaApDung(null)
      setLoiVoucher('Giỏ hàng đang trống, chưa thể áp mã giảm giá.')
      clearStoredVoucher()
      return
    }

    const maVoucher = maVoucherNhap.trim().toUpperCase()

    if (!maVoucher) {
      setVoucherDaApDung(null)
      setLoiVoucher('Vui lòng nhập mã giảm giá.')
      clearStoredVoucher()
      return
    }

    try {
      setDangApVoucher(true)
      const { duLieu } = await kiemTraPhieuGiamGiaApi(maVoucher, tamTinh)
      const voucher = duLieu
        ? {
            code: duLieu.code,
            amount: duLieu.discountType === 'FIXED'
              ? Number(duLieu.discountValue || 0)
              : Math.min(
                  (tamTinh * Number(duLieu.discountValue || 0)) / 100,
                  Number(duLieu.maxDiscountAmount || Number.MAX_SAFE_INTEGER),
                ),
          }
        : null
      const voucherHopLe = saveVoucher(voucher)

      if (!voucherHopLe) {
        setVoucherDaApDung(null)
        setLoiVoucher('Mã giảm giá không hợp lệ.')
        clearStoredVoucher()
        return
      }

      setVoucherDaApDung(voucherHopLe)
      setMaVoucherNhap(voucherHopLe.code)
      setLoiVoucher('')
    } catch (error) {
      setVoucherDaApDung(null)
      setLoiVoucher(error?.message || 'Mã giảm giá không hợp lệ.')
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
          Đã áp mã {voucherDaApDung.code}: -{dinhDangTienTe(soTienGiam)}
        </p>
      )
    }

    return null
  }

  return (
    <div className="gio-hang-page gio-hang-page-editorial">
      <div className="container">
        <div className="gio-hang-header">
          <p className="thanh-toan-kicker">Đơn gọi món tại bàn</p>
          <h1>Giỏ hàng của bạn</h1>
          <p>{cartItems.length} món đang chờ được hoàn tất cho bàn ăn tối nay.</p>
        </div>

        <div className="gio-hang-layout">
          <div className="gio-hang-items-section">
            {cartItems.length === 0 ? (
              <div className="gio-hang-empty">
                <p>Giỏ hàng trống</p>
                <button className="btn nut-chinh" onClick={() => navigate('/thuc-don')}>
                  Xem thực đơn
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemKey = typeof layKhoaMonTrongGio === 'function' ? layKhoaMonTrongGio(item) : item.id
                const optionLines = typeof layTuyChonHienThiMon === 'function' ? layTuyChonHienThiMon(item) : []

                return (
                  <div key={itemKey} className="gio-hang-item">
                    <div className="gio-hang-item-image" style={{ background: item.image }}></div>

                    <div className="gio-hang-item-info">
                      <p className="gio-hang-item-kicker">Món đã chọn</p>
                      <h3>{item.name}</h3>
                      <p className="gio-hang-item-price">{dinhDangTienTe(item.price)}</p>
                      {optionLines.length > 0 && (
                        <div className="gio-hang-item-options">
                          {optionLines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="gio-hang-item-actions">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => capNhatSoLuong(itemKey, -1)}
                          aria-label="Giảm số lượng"
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => capNhatSoLuong(itemKey, 1)}
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => xoaKhoiGio(itemKey)}
                        aria-label="Xóa món"
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
                  </div>
                )
              })
            )}
          </div>

          <div className="gio-hang-summary">
            <div className="tom-tat-card gio-hang-tom-tat-card">
              <h2>Tổng kết đơn</h2>

              <div className="voucher-block">
                <div className="voucher-header">
                  <h3>Mã giảm giá</h3>
                  <p>Nhập mã hợp lệ để áp dụng ưu đãi từ hệ thống.</p>
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
                  <button type="button" className="btn nut-chinh voucher-apply-btn" onClick={handleApplyVoucher} disabled={dangApVoucher}>
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
                <span>{dinhDangTienTe(tamTinh)}</span>
              </div>

              <div className="tom-tat-row">
                  <span>Phí dịch vụ theo máy chủ</span>
                <span>{dinhDangTienTe(phiDichVu)}</span>
              </div>

              <div className="tom-tat-row tom-tat-discount">
                <span>Giảm giá {voucherDaApDung ? `(${voucherDaApDung.code})` : ''}</span>
                <span>-{dinhDangTienTe(soTienGiam)}</span>
              </div>

              <div className="tom-tat-divider"></div>

              <div className="tom-tat-row tom-tat-total">
                <span>Tổng cộng ước tính</span>
                <strong>{dinhDangTienTe(tongTien)}</strong>
              </div>

              <p className="thanh-toan-tom-tat-note">
                 Tổng tiền cuối cùng sẽ được máy chủ xác nhận khi tạo đơn hàng.
              </p>

              <div className="tom-tat-form">
                <div className="nhom-truong">
                  <label className="nhan-truong">Số bàn</label>
                  <input
                    type="text"
                    className="truong-nhap"
                    placeholder="Nhập số bàn (nếu có)"
                    value={soBan}
                    onChange={(event) => setSoBan(event.target.value)}
                  />
                </div>

                <div className="nhom-truong">
                  <label className="nhan-truong">Ghi chú cho quán</label>
                  <textarea
                    className="truong-van-ban"
                    placeholder="Ví dụ: Không hành, ít cay..."
                    rows="3"
                    value={ghiChu}
                    onChange={(event) => setGhiChu(event.target.value)}
                  ></textarea>
                </div>
              </div>

              <button
                className="btn nut-chinh w-full"
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
