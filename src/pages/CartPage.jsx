import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { DEFAULT_VOUCHER } from '../constants/voucher'
import { formatCurrency } from '../utils/currency'
import {
  clearAppliedVoucher as clearStoredVoucher,
  getAppliedVoucher as getStoredVoucher,
  setAppliedVoucher as saveVoucher,
} from '../services/voucherService'

function CartPage() {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, getCartItemKey, getItemDisplayOptions } = useCart()

  const [note, setNote] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [voucherCodeInput, setVoucherCodeInput] = useState('')
  const [appliedVoucher, setAppliedVoucherState] = useState(null)
  const [voucherError, setVoucherError] = useState('')

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceFee = subtotal * 0.05
  const discountAmount = appliedVoucher ? Math.min(appliedVoucher.amount, subtotal + serviceFee) : 0
  const total = Math.max(0, subtotal + serviceFee - discountAmount)

  useEffect(() => {
    const voucher = getStoredVoucher()
    if (voucher) {
      setAppliedVoucherState(voucher)
      setVoucherCodeInput(voucher.code)
    }
  }, [])

  useEffect(() => {
    if (subtotal > 0 || !appliedVoucher) {
      return
    }

    setAppliedVoucherState(null)
    setVoucherError('Giỏ hàng đang trống, chưa thể áp mã giảm giá.')
    clearStoredVoucher()
  }, [subtotal, appliedVoucher])

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống!')
      return
    }

    if (appliedVoucher) {
      saveVoucher(appliedVoucher)
    } else {
      clearStoredVoucher()
    }

    navigate('/checkout')
  }

  const handleApplyVoucher = () => {
    if (subtotal <= 0) {
      setAppliedVoucherState(null)
      setVoucherError('Giỏ hàng đang trống, chưa thể áp mã giảm giá.')
      clearStoredVoucher()
      return
    }

    const normalizedCode = voucherCodeInput.trim().toUpperCase()

    if (normalizedCode !== DEFAULT_VOUCHER.code) {
      setAppliedVoucherState(null)
      setVoucherError('Mã giảm giá không hợp lệ.')
      clearStoredVoucher()
      return
    }

    const voucher = { ...DEFAULT_VOUCHER }
    setAppliedVoucherState(voucher)
    setVoucherCodeInput(voucher.code)
    setVoucherError('')
    saveVoucher(voucher)
  }

  const handleClearVoucher = () => {
    setAppliedVoucherState(null)
    setVoucherCodeInput('')
    setVoucherError('')
    clearStoredVoucher()
  }

  const renderVoucherMessage = () => {
    if (voucherError) {
      return <p className="voucher-message error">{voucherError}</p>
    }

    if (appliedVoucher) {
      return (
        <p className="voucher-message success">
          Đã áp mã {appliedVoucher.code}: -{formatCurrency(appliedVoucher.amount)}
        </p>
      )
    }

    return null
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Giỏ hàng của bạn</h1>
          <p>{cartItems.length} món</p>
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
                const optionLines =
                  typeof getItemDisplayOptions === 'function' ? getItemDisplayOptions(item) : []

                return (
                  <div key={itemKey} className="cart-item">
                    <div className="cart-item-image" style={{ background: item.image }}></div>

                    <div className="cart-item-info">
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
            <div className="summary-card">
              <h2>Tổng kết đơn</h2>

              <div className="voucher-block">
                <div className="voucher-header">
                  <h3>Mã giảm giá</h3>
                  <p>Nhập GIAM20K để giảm 20.000đ</p>
                </div>
                <div className="voucher-controls">
                  <input
                    type="text"
                    className="form-input voucher-input"
                    placeholder="Nhập mã GIAM20K"
                    value={voucherCodeInput}
                    onChange={(event) => {
                      setVoucherCodeInput(event.target.value)
                      if (voucherError) {
                        setVoucherError('')
                      }
                    }}
                  />
                  <button type="button" className="btn btn-primary voucher-apply-btn" onClick={handleApplyVoucher}>
                    Áp dụng
                  </button>
                  {appliedVoucher && (
                    <button type="button" className="btn btn-ghost voucher-clear-btn" onClick={handleClearVoucher}>
                      Bỏ mã
                    </button>
                  )}
                </div>
                {renderVoucherMessage()}
              </div>

              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Phí dịch vụ (5%)</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>

              <div className="summary-row summary-discount">
                <span>Giảm giá {appliedVoucher ? `(${appliedVoucher.code})` : ''}</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Tổng cộng</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <div className="summary-form">
                <div className="form-group">
                  <label className="form-label">Số bàn</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nhập số bàn (nếu có)"
                    value={tableNumber}
                    onChange={(event) => setTableNumber(event.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú cho quán</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Ví dụ: Không hành, ít cay..."
                    rows="3"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
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
