import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import RevenueChart from '../../components/admin/dashboard/RevenueChart'
import { ADMIN_TIME_RANGE_OPTIONS, taoDuLieuThongKeDoanhThu } from '../../features/admin/mockData'
import { dinhDangTienTe } from '../../utils/tienTe'

function AdminThongKePage() {
  const { danhSachDonHang, danhSachDatBan } = useOutletContext()
  const [timeRange, setTimeRange] = useState('today')

  const revenueStats = useMemo(
    () => taoDuLieuThongKeDoanhThu({
      orders: danhSachDonHang,
      bookings: danhSachDatBan,
      timeRange,
    }),
    [danhSachDatBan, danhSachDonHang, timeRange],
  )

  return (
    <div className="admin-page-stack">
      <section className="admin-panel-card" aria-label="Bộ lọc thống kê">
        <div className="admin-panel-card__head">
          <div>
            <p className="admin-section-kicker">Bộ lọc thời gian</p>
            <h2>Khoảng dữ liệu</h2>
          </div>
        </div>
        <div className="admin-filter-chip-row">
          {ADMIN_TIME_RANGE_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`admin-filter-chip ${timeRange === option.key ? 'is-active' : ''}`}
              onClick={() => setTimeRange(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="admin-summary-strip" aria-label="Tổng quan thống kê">
        <article className="admin-summary-strip__card">
          <span>Tổng doanh thu kỳ</span>
          <strong>{dinhDangTienTe(revenueStats.overview.revenue)}</strong>
          <p>Doanh thu sau khi áp dụng bộ lọc thời gian.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Số đơn hoàn thành</span>
          <strong>{revenueStats.overview.completedOrders}</strong>
          <p>Đơn hàng đã hoàn thành trong khoảng thời gian đang xem.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Giá trị đơn trung bình</span>
          <strong>{dinhDangTienTe(revenueStats.overview.averageOrder)}</strong>
          <p>Trung bình theo các đơn hàng thuộc kỳ lọc hiện tại.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Tổng booking kỳ</span>
          <strong>{revenueStats.overview.totalBookings}</strong>
          <p>Booking thuộc khoảng thời gian đang chọn.</p>
        </article>
      </section>

      <section className="admin-summary-strip" aria-label="Thống kê booking">
        <article className="admin-summary-strip__card">
          <span>Tổng booking</span>
          <strong>{revenueStats.bookingStats.total}</strong>
          <p>Tổng số booking của kỳ hiện tại.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Đã hoàn thành</span>
          <strong>{revenueStats.bookingStats.completed}</strong>
          <p>Booking có trạng thái hoàn thành.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Đã hủy</span>
          <strong>{revenueStats.bookingStats.cancelled}</strong>
          <p>Booking có trạng thái hủy trong kỳ.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Tỉ lệ hủy</span>
          <strong>{revenueStats.bookingStats.cancellationRate}%</strong>
          <p>Tỉ lệ booking đã hủy trên tổng booking.</p>
        </article>
      </section>

      <RevenueChart title="Doanh thu 7 ngày gần nhất" revenue={{ summary: revenueStats.overview, series: revenueStats.revenueSeries }} />

      <section className="admin-analytics-grid">
        <article className="admin-panel-card">
          <div className="admin-panel-card__head">
            <div>
              <p className="admin-section-kicker">Top món</p>
              <h2>Món bán chạy</h2>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên món</th>
                  <th>Số lượng</th>
                  <th>Doanh thu</th>
                  <th>% tổng</th>
                </tr>
              </thead>
              <tbody>
                {revenueStats.topDishes.map((dish) => (
                  <tr key={dish.id}>
                    <td>{dish.rank}</td>
                    <td>{dish.name}</td>
                    <td>{dish.quantity}</td>
                    <td>{dinhDangTienTe(dish.revenue)}</td>
                    <td>{dish.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel-card">
          <div className="admin-panel-card__head">
            <div>
              <p className="admin-section-kicker">Cơ cấu danh mục</p>
              <h2>Phân bổ theo nhóm món</h2>
            </div>
          </div>

          <div className="admin-category-share-list">
            {revenueStats.categoryShares.map((item) => (
              <article key={item.category} className="admin-category-share-item">
                <div>
                  <strong>{item.category}</strong>
                  <p>Tính từ doanh thu top món trong kỳ hiện tại.</p>
                </div>
                <div className="admin-category-share-meter">
                  <span style={{ width: `${item.percent}%` }} />
                </div>
                <strong>{item.percent}%</strong>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default AdminThongKePage
