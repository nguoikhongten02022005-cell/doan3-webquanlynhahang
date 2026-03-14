import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/currency'
import {
  clearCheckoutDraft,
  getCheckoutDraft,
  setCheckoutDraft,
} from '../services/checkoutDraftService'
import {
  clearAppliedVoucher as clearStoredVoucher,
  getAppliedVoucher as getStoredVoucher,
  setAppliedVoucher as saveVoucher,
} from '../services/voucherService'
import { validateVoucherApi } from '../services/api/voucherApi'

function CartPage() {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, getCartItemKey, getItemDisplayOptions } = useCart()

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

    const draft = getCheckoutDraft()
    if (draft) {
      setGhiChu(draft.note)
      setSoBan(draft.tableNumber)
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
      alert('Giỏ hàng trống!')
      clearCheckoutDraft()
      return
    }

    if (voucherDaApDung) {
      saveVoucher(voucherDaApDung)
    } else {
      clearStoredVoucher()
    }

    setCheckoutDraft({ note: ghiChu, tableNumber: soBan })
    navigate('/checkout')
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
      const { duLieu } = await validateVoucherApi(maVoucher, tamTinh)
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
          Đã áp mã {voucherDaApDung.code}: -{formatCurrency(soTienGiam)}
        </p>
      )
    }

    return null
  }

  return (
    <div className="cart-page cart-page-editorial">
      <div className="container">
        <div className="cart-header">
          <p className="checkout-kicker">Đơn gọi món tại bàn</p>
          <h1>Giỏ hàng của bạn</h1>
          <p>{cartItems.length} món đang chờ được hoàn tất cho bàn ăn tối nay.</p>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <p>Giỏ hàng trống</p>
                <button className="btn btn-primary" onClick={() => navigate('/menu')}>
                  Xem thực đơn
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemKey = typeof getCartItemKey === 'function' ? getCartItemKey(item) : item.id
                const optionLines = typeof getItemDisplayOptions === 'function' ? getItemDisplayOptions(item) : []

                return (
                  <div key={itemKey} className="cart-item">
                    <div className="cart-item-image" style={{ background: item.image }}></div>

                    <div className="cart-item-info">
                      <p className="cart-item-kicker">Món đã chọn</p>
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">{formatCurrency(item.price)}</p>
                      {optionLines.length > 0 && (
                        <div className="cart-item-options">
                          {optionLines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(itemKey, -1)}
                          aria-label="Giảm số lượng"
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(itemKey, 1)}
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(itemKey)}
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

          <div className="cart-summary">
            <div className="summary-card cart-summary-card">
              <h2>Tổng kết đơn</h2>

              <div className="voucher-block">
                <div className="voucher-header">
                  <h3>Mã giảm giá</h3>
                  <p>Nhập mã hợp lệ để áp dụng giảm giá từ hệ thống.</p>
                </div>
                <div className="voucher-controls">
                  <input
                    type="text"
                    className="form-input voucher-input"
                    placeholder="Nhập mã giảm giá"
                    value={maVoucherNhap}
                    onChange={(event) => {
                      setMaVoucherNhap(event.target.value)
                      if (loiVoucher) {
                        setLoiVoucher('')
                      }
                    }}
                  />
                  <button type="button" className="btn btn-primary voucher-apply-btn" onClick={handleApplyVoucher} disabled={dangApVoucher}>
                    {dangApVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                  </button>
                  {voucherDaApDung && (
                    <button type="button" className="btn btn-ghost voucher-clear-btn" onClick={handleClearVoucher}>
                      Bỏ mã
                    </button>
                  )}
                </div>
                {renderVoucherMessage()}
              </div>

              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(tamTinh)}</span>
              </div>

              <div className="summary-row">
                <span>Phí dịch vụ theo backend</span>
                <span>{formatCurrency(phiDichVu)}</span>
              </div>

              <div className="summary-row summary-discount">
                <span>Giảm giá {voucherDaApDung ? `(${voucherDaApDung.code})` : ''}</span>
                <span>-{formatCurrency(soTienGiam)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Tổng cộng ước tính</span>
                <strong>{formatCurrency(tongTien)}</strong>
              </div>

              <p className="checkout-summary-note">
                Tổng tiền cuối cùng sẽ được backend xác nhận khi tạo đơn hàng.
              </p>

              <div className="summary-form">
                <div className="form-group">
                  <label className="form-label">Số bàn</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nhập số bàn (nếu có)"
                    value={soBan}
                    onChange={(event) => setSoBan(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú cho quán</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Ví dụ: Không hành, ít cay..."
                    rows="3"
                    value={ghiChu}
                    onChange={(event) => setGhiChu(event.target.value)}
                  ></textarea>
                </div>
              </div>

              <button
                className="btn btn-primary w-full"
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

export default CartPage
