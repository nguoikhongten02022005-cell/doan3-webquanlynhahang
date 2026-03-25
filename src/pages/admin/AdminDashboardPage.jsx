import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import TongQuanTab from '../../components/bangDieuKhienNoiBo/TongQuanTab'
import { useXacThuc } from '../../hooks/useXacThuc'
import { ADMIN_RECENT_ACTIVITY } from '../../features/admin/mockData'
import { layNhanPhamViTongQuan } from '../../features/bangDieuKhienNoiBo/boChon'
import { dinhDangTienTe } from '../../utils/tienTe'

function AdminDashboardPage() {
  const { laAdmin } = useXacThuc()
  const {
    tomTatTaiKhoan,
    danhSachDatBanDangHoatDong,
    hangDoiDatBan,
    danhSachDatBanDaXacNhan,
    danhSachDonHangDangMo,
    tomTatDonHang,
    danhSachDatBanChoXuLy,
    tomTatTonKhoBan,
    tomTatBan,
    danhSachDatBanSapDienRa,
    danhSachDatBanChuaGanBan,
    urgentItems,
    revenueStats,
  } = useOutletContext()

  const phamViLabel = layNhanPhamViTongQuan('all', 'all')
  const soLuongDatBanDaCheckIn = useMemo(
    () => danhSachDatBanDangHoatDong.filter((booking) => booking.status === 'DA_CHECK_IN' || booking.status === 'DA_XEP_BAN').length,
    [danhSachDatBanDangHoatDong],
  )

  const maxRevenue = Math.max(...revenueStats.revenueSeries.map((item) => item.revenue), 1)

  return (
    <div className="admin-page-stack admin-page-stack--dashboard">
      <section className="admin-hero-grid">
        <article className="admin-panel-card admin-panel-card--chart">
          <div className="admin-panel-card__head">
            <div>
              <p className="admin-section-kicker">Tổng quan theo tuần</p>
              <h2>Doanh thu 7 ngày gần nhất</h2>
            </div>
            <strong className="admin-panel-card__figure">{dinhDangTienTe(revenueStats.overview.revenue)}</strong>
          </div>

          <div className="admin-revenue-chart" aria-label="Biểu đồ doanh thu 7 ngày gần nhất">
            {revenueStats.revenueSeries.map((item) => (
              <div key={item.label} className="admin-revenue-chart__item">
                <div
                  className="admin-revenue-chart__bar"
                  style={{ height: `${Math.max((item.revenue / maxRevenue) * 100, 12)}%` }}
                  title={`${item.label}: ${dinhDangTienTe(item.revenue)}`}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel-card admin-panel-card--activity">
          <div className="admin-panel-card__head">
            <div>
              <p className="admin-section-kicker">Nhịp vận hành</p>
              <h2>Việc cần lưu ý trong ca</h2>
            </div>
          </div>

          <div className="admin-activity-list">
            {ADMIN_RECENT_ACTIVITY.map((item) => (
              <article key={item.id} className={`admin-activity-item tone-${item.tone}`}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-summary-strip" aria-label="Tóm tắt nhanh dashboard">
        <article className="admin-summary-strip__card">
          <span>Doanh thu hôm nay</span>
          <strong>{dinhDangTienTe(revenueStats.overview.revenue)}</strong>
          <p>{revenueStats.overview.completedOrders} đơn đã hoàn thành.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Booking đang mở</span>
          <strong>{hangDoiDatBan.length}</strong>
          <p>{danhSachDatBanChoXuLy.length} booking chờ xác nhận.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Đang phục vụ</span>
          <strong>{tomTatTonKhoBan.occupied}</strong>
          <p>{tomTatTonKhoBan.available} bàn sẵn sàng đón khách.</p>
        </article>
      </section>

      <TongQuanTab
        tomTatTaiKhoan={tomTatTaiKhoan}
        danhSachDatBanDangHoatDong={danhSachDatBanDangHoatDong}
        hangDoiDatBan={hangDoiDatBan}
        soLuongDatBanDaCheckIn={soLuongDatBanDaCheckIn}
        danhSachDatBanDaXacNhan={danhSachDatBanDaXacNhan}
        isAdmin={laAdmin}
        danhSachDonHangDangMo={danhSachDonHangDangMo}
        canhBaoVanHanh={urgentItems.reduce((sum, item) => sum + item.value, 0)}
        tomTatDonHang={tomTatDonHang}
        danhSachDatBanChoXuLy={danhSachDatBanChoXuLy}
        phamViLabel={phamViLabel}
        tomTatTonKhoBan={tomTatTonKhoBan}
        tomTatBan={tomTatBan}
        danhSachDatBanSapDienRa={danhSachDatBanSapDienRa}
        danhSachDatBanChuaGanBan={danhSachDatBanChuaGanBan}
        urgentItems={urgentItems}
      />
    </div>
  )
}

export default AdminDashboardPage
