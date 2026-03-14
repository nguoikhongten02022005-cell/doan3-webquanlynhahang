import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { formatCurrency } from '../utils/currency'
import { clearCheckoutDraft, getCheckoutDraft, setCheckoutDraft } from '../services/checkoutDraftService'
import { createOrderApi } from '../services/api/orderApi'
import { clearAppliedVoucher, getAppliedVoucher } from '../services/voucherService'
import { buildCreateOrderPayload, getInvalidOrderItems, PAYMENT_METHOD_OPTIONS } from '../utils/order'

function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart, getItemDisplayOptions, getCartItemKey } = useCart()
  const { currentUser } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    tableNumber: '',
    paymentMethod: 'TIEN_MAT',
  })
  const [appliedVoucher, setAppliedVoucher] = useState(null)

  useEffect(() => {
    const voucher = getAppliedVoucher()

    if (!voucher) {
      clearAppliedVoucher()
    } else {
      setAppliedVoucher(voucher)
    }

    const draft = getCheckoutDraft()
    if (draft) {
      setFormData((prev) => ({
        ...prev,
        note: draft.note,
        tableNumber: draft.tableNumber,
      }))
    }
  }, [])

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const serviceFee = 0
  const discountAmount = appliedVoucher ? Math.min(appliedVoucher.amount, subtotal) : 0
  const total = Math.max(0, subtotal + serviceFee - discountAmount)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => {
      const nextFormData = {
        ...prev,
        [name]: value,
      }

      setCheckoutDraft({
        note: nextFormData.note,
        tableNumber: nextFormData.tableNumber,
      })

      return nextFormData
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (cartItems.length === 0) {
      alert('Giỏ hàng đang trống. Vui lòng chọn món trước khi thanh toán.')
      navigate('/menu')
      return
    }

    if (!formData.fullName || !formData.phone) {
      alert('Vui lòng nhập đầy đủ họ tên và số điện thoại.')
      return
    }

    const invalidOrderItems = getInvalidOrderItems(cartItems)
    if (invalidOrderItems.length > 0) {
      alert('Có món trong giỏ hàng không còn hợp lệ để tạo đơn. Vui lòng quay lại menu và thêm lại món.')
      return
    }

    try {
      const orderPayload = buildCreateOrderPayload({
        cartItems,
        voucherCode: appliedVoucher?.code,
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: currentUser?.email ?? '',
          address: formData.address,
        },
        note: formData.note,
        tableNumber: formData.tableNumber,
        paymentMethod: formData.paymentMethod,
      })

      await createOrderApi(orderPayload)

      clearAppliedVoucher()
      clearCheckoutDraft()

      if (typeof clearCart === 'function') {
        clearCart()
      }

      alert('Đặt hàng thành công')
      navigate('/profile')
    } catch (error) {
      alert(error?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.')
    }
  }

  return (
    <div className="checkout-page checkout-page-editorial">
      <div className="container">
        <div className="checkout-header">
          <p className="checkout-kicker">Hoàn tất đơn gọi món</p>
          <h1>Thanh toán đơn hàng</h1>
          <p>Kiểm tra thông tin liên hệ, vị trí phục vụ và phương thức thanh toán trước khi hoàn tất đơn của bạn.</p>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <section className="checkout-form-panel">
            <h2>Thông tin liên hệ</h2>

            <div className="checkout-form-grid">
              <div className="form-group full">
                <label className="form-label" htmlFor="fullName">
                  Họ tên
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="form-input"
                  placeholder="Nhập họ tên người đặt / nhận món"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  placeholder="0901 234 567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group full">
                <label className="form-label" htmlFor="address">
                  Địa chỉ
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-input"
                  placeholder="Nhập địa chỉ nếu cần giao hoặc xác nhận vị trí phục vụ"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tableNumber">
                  Số bàn
                </label>
                <input
                  id="tableNumber"
                  name="tableNumber"
                  type="text"
                  className="form-input"
                  placeholder="Nhập số bàn (nếu có)"
                  value={formData.tableNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full">
                <label className="form-label" htmlFor="note">
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  name="note"
                  className="form-textarea"
                  placeholder="Ví dụ: không hành, ít cay..."
                  rows="4"
                  value={formData.note}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="checkout-payment-block">
              <h3>Phương thức thanh toán</h3>
              <div className="checkout-payment-options">
                {PAYMENT_METHOD_OPTIONS.map((method) => (
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

          <aside className="checkout-summary-panel">
            <div className="checkout-summary-card">
              <h2>Tóm tắt đơn hàng</h2>

              {cartItems.length === 0 ? (
                <div className="checkout-empty">Chưa có món nào trong giỏ hàng.</div>
              ) : (
                <div className="checkout-item-list">
                  {cartItems.map((item, index) => {
                    const itemKey =
                      typeof getCartItemKey === 'function'
                        ? getCartItemKey(item)
                        : `${item.id}-${index}`
                    const optionLines =
                      typeof getItemDisplayOptions === 'function'
                        ? getItemDisplayOptions(item)
                        : []

                    return (
                      <div key={itemKey} className="checkout-item">
                        <div>
                          <p className="checkout-item-name">{item.name}</p>
                          {optionLines.length > 0 && (
                            <div className="checkout-item-options">
                              {optionLines.map((line) => (
                                <p key={line}>{line}</p>
                              ))}
                            </div>
                          )}
                          <p className="checkout-item-qty">x{item.quantity}</p>
                        </div>
                        <strong>{formatCurrency(item.price * item.quantity)}</strong>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="checkout-totals">
                <div className="summary-row">
                  <span>Tạm tính món</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí dịch vụ tham chiếu</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="summary-row summary-discount">
                  <span>Ước tính giảm giá {appliedVoucher ? `(${appliedVoucher.code})` : ''}</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Tổng ước tính</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>

              <p className="checkout-summary-note">
                Tổng tiền cuối cùng sẽ do backend xác nhận khi tạo đơn hàng từ dữ liệu menu hiện tại.
              </p>

              <button type="submit" className="btn btn-primary w-full" disabled={cartItems.length === 0}>
                Đặt hàng ngay
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
