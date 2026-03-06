import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartPage() {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart } = useCart()

  const [note, setNote] = useState('')
  const [tableNumber, setTableNumber] = useState('')

  const handleGoToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống!')
      return
    }

    navigate('/checkout')
  }

  const removeItem = (id) => {
    removeFromCart(id)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceFee = subtotal * 0.05
  const total = subtotal + serviceFee

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
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image" style={{ background: item.image }}></div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">{item.price.toLocaleString('vi-VN')}₫</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                      aria-label="Xóa món"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Tổng kết đơn</h2>

              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>

              <div className="summary-row">
                <span>Phí dịch vụ (5%)</span>
                <span>{serviceFee.toLocaleString('vi-VN')}₫</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Tổng cộng</span>
                <strong>{total.toLocaleString('vi-VN')}₫</strong>
              </div>

              <div className="summary-form">
                <div className="form-group">
                  <label className="form-label">Số bàn</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nhập số bàn (nếu có)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú cho quán</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Ví dụ: Không hành, ít cay..."
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
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
