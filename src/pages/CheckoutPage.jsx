import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { formatCurrency } from '../utils/currency'
import { getStorageJSON, setStorageJSON } from '../services/storageService'
import { clearAppliedVoucher, getAppliedVoucher } from '../services/voucherService'

const paymentMethods = [
  {
    value: 'cash',
    label: 'Tiền mặt khi nhận hàng',
    description: 'Thanh toán trực tiếp khi nhận món.',
  },
  {
    value: 'banking',
    label: 'Chuyển khoản',
    description: 'Chuyển khoản trước khi giao hàng.',
  },
]

function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, clearCart, getItemDisplayOptions, getCartItemKey } = useCart()

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'cash',
  })
  const [appliedVoucher, setAppliedVoucher] = useState(null)

  useEffect(() => {
    const voucher = getAppliedVoucher()

    if (!voucher) {
      clearAppliedVoucher()
      return
    }

    setAppliedVoucher(voucher)
  }, [])

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const serviceFee = subtotal * 0.05
  const discountAmount = appliedVoucher ? Math.min(appliedVoucher.amount, subtotal + serviceFee) : 0
  const total = Math.max(0, subtotal + serviceFee - discountAmount)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (cartItems.length === 0) {
      alert('Giỏ hàng đang trống. Vui lòng chọn món trước khi thanh toán.')
      navigate('/menu')
      return
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.')
      return
    }

    const existingOrdersRaw = getStorageJSON(STORAGE_KEYS.ORDERS, [])
    const existingOrders = Array.isArray(existingOrdersRaw) ? existingOrdersRaw : []

    const newOrder = {
      id: Date.now(),
      items: cartItems,
      subtotal,
      serviceFee,
      discountAmount,
      voucherCode: appliedVoucher?.code || '',
      total,
      orderDate: new Date().toISOString(),
      status: 'Mới Đặt',
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
      },
      note: formData.note,
      paymentMethod: formData.paymentMethod,
    }

    setStorageJSON(STORAGE_KEYS.ORDERS, [newOrder, ...existingOrders])
    clearAppliedVoucher()

    if (typeof clearCart === 'function') {
      clearCart()
    }

    alert('Đặt hàng thành công')
    navigate('/profile')
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <p className="checkout-kicker">Checkout</p>
          <h1>Thanh toán đơn hàng</h1>
          <p>Kiểm tra thông tin giao hàng và hoàn tất thanh toán nhanh chóng.</p>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <section className="checkout-form-panel">
            <h2>Thông tin nhận hàng</h2>

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
                  placeholder="Nhập họ tên người nhận"
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
                  Địa chỉ giao hàng
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="form-input"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện"
                  value={formData.address}
                  onChange={handleChange}
                  required
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
                {paymentMethods.map((method) => (
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
                <div className="summary-row summary-total">
                  <span>Tổng tiền</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>

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
