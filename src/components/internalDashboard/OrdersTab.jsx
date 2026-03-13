import { formatCurrency } from '../../utils/currency'
import { formatDate, getOrderStatusTone } from '../../pages/internalDashboard/formatters'
import { getOrderStatusLabel, getPaymentMethodLabel } from '../../utils/order'

function OrdersTab({ orders }) {
  return (
    <article className="profile-card">
      <div className="host-board-head">
        <h2>Đơn đang mở</h2>
        <span>{orders.length} đơn</span>
      </div>

      <div className="profile-list internal-list-top-gap">
        {orders.length === 0 && (
          <div className="profile-list-item">
            <p className="booking-empty">Chưa có đơn hàng nào.</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="profile-list-item">
            <div className="profile-list-top">
              <strong>DH-{String(order.id).slice(-6)}</strong>
              <span className={`status-chip tone-${getOrderStatusTone(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
            </div>

            <div className="profile-list-meta internal-order-meta">
              <p><span>Khách hàng</span><strong>{order.customer?.fullName || 'Khách lẻ'}</strong></p>
              <p><span>Ngày tạo</span><strong>{formatDate(order.orderDate)}</strong></p>
              <p><span>Tổng tiền</span><strong>{formatCurrency(order.total)}</strong></p>
              <p><span>Thanh toán</span><strong>{getPaymentMethodLabel(order.paymentMethod)}</strong></p>
            </div>

            {order.note && <p className="host-booking-note">Ghi chú đơn: {order.note}</p>}
          </div>
        ))}
      </div>
    </article>
  )
}

export default OrdersTab
