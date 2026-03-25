import { dinhDangTienTe } from '../../utils/tienTe'
import { dinhDangNgay, laySacThaiDonHang } from '../../features/bangDieuKhienNoiBo/dinhDang'
import { layNhanTrangThaiDonHang, layNhanPhuongThucThanhToan } from '../../utils/donHang'

function DonHangTab({ orders }) {
  return (
    <article className="ho-so-card">
      <div className="van-hanh-board-head">
        <h2>Đơn đang mở</h2>
        <span>{orders.length} đơn</span>
      </div>

      <div className="ho-so-list noi-bo-list-top-gap">
        {orders.length === 0 && (
          <div className="ho-so-list-item">
            <p className="dat-ban-empty">Chưa có đơn hàng nào.</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.id} className="ho-so-list-item">
            <div className="ho-so-list-top">
              <strong>{order.orderCode || order.code || order.id || 'DH-000001'}</strong>
              <span className={`nhan-trang-thai tone-${laySacThaiDonHang(order.status)}`}>{layNhanTrangThaiDonHang(order.status)}</span>
            </div>

            <div className="ho-so-list-meta noi-bo-don-hang-meta">
              <p><span>Khách hàng</span><strong>{order.customer?.fullName || 'Khách lẻ'}</strong></p>
              <p><span>Ngày tạo</span><strong>{dinhDangNgay(order.orderDate)}</strong></p>
              <p><span>Tổng tiền</span><strong>{dinhDangTienTe(order.total)}</strong></p>
              <p><span>Thanh toán</span><strong>{layNhanPhuongThucThanhToan(order.paymentMethod)}</strong></p>
            </div>

            {order.note && <p className="van-hanh-dat-ban-note">Ghi chú đơn: {order.note}</p>}
          </div>
        ))}
      </div>
    </article>
  )
}

export default DonHangTab
