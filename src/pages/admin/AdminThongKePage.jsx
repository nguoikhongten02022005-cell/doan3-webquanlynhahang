import { useOutletContext } from 'react-router-dom'
import { dinhDangTienTe } from '../../utils/tienTe'

function AdminThongKePage() {
  const { revenueStats } = useOutletContext()

  return (
    <div className="admin-page-stack">
      <section className="admin-summary-strip" aria-label="Tổng quan thống kê">
        <article className="admin-summary-strip__card">
          <span>Tổng doanh thu kỳ</span>
          <strong>{dinhDangTienTe(revenueStats.overview.revenue)}</strong>
          <p>TODO: thay bằng doanh thu theo filter thời gian thực.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Số đơn hoàn thành</span>
          <strong>{revenueStats.overview.completedOrders}</strong>
          <p>Đơn có trạng thái hoàn thành từ dữ liệu hiện có.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Giá trị đơn trung bình</span>
          <strong>{dinhDangTienTe(revenueStats.overview.averageOrder)}</strong>
          <p>Dựa trên tập đơn đang đồng bộ.</p>
        </article>
      </section>

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
                  <p>TODO: thay bằng dữ liệu thống kê backend thật.</p>
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
