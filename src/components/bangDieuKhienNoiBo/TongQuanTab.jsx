import { HOST_NHAN_TRANG_THAI_DAT_BAN } from '../../data/duLieuDatBan'
import { dinhDangTienTe } from '../../utils/tienTe'
import {
  dinhDangNgay,
  dinhDangNgayGio,
  dinhDangSoKhach,
  laySacThaiTrangThaiDatBan,
  laySacThaiDonHang,
  layNhanChoNgoi,
} from '../../features/bangDieuKhienNoiBo/dinhDang'
import { layNhanTrangThaiDonHang } from '../../utils/donHang'
import { layGhiChuUuTienDatBan } from '../../features/bangDieuKhienNoiBo/boChon'

function TongQuanTab({
  danhSachDatBanDangHoatDong,
  hangDoiDatBan,
  soLuongDatBanDaCheckIn,
  danhSachDatBanDaXacNhan,
  isAdmin,
  danhSachDonHangDangMo,
  canhBaoVanHanh,
  tomTatDonHang,
  danhSachDatBanChoXuLy,
  phamViLabel,
  tomTatBan,
  tomTatTonKhoBan,
  danhSachDatBanSapDienRa,
  danhSachDatBanChuaGanBan,
  urgentItems,
  tomTatTaiKhoan,
}) {
  return (
    <div className="noi-bo-dashboard-stack">
      <section className="van-hanh-stats-grid noi-bo-kpi-grid">
        <article className="van-hanh-stat-card noi-bo-kpi-card">
          <span>Booking đang theo dõi</span>
          <strong>{danhSachDatBanDangHoatDong.length}</strong>
          <p>{phamViLabel}</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-kpi-card">
          <span>Chờ xác nhận</span>
          <strong>{danhSachDatBanChoXuLy.length}</strong>
          <p>Ưu tiên gọi lại và chốt bàn sớm.</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-kpi-card">
          <span>Bàn đang phục vụ / giữ chỗ</span>
          <strong>{tomTatTonKhoBan.occupied + tomTatTonKhoBan.held}</strong>
          <p>{tomTatTonKhoBan.available} bàn còn sẵn sàng nhận khách.</p>
        </article>
        <article className="van-hanh-stat-card noi-bo-kpi-card">
          <span>Đơn đang mở</span>
          <strong>{danhSachDonHangDangMo.length}</strong>
          <p>{dinhDangTienTe(tomTatDonHang.revenue)} doanh thu ghi nhận.</p>
        </article>
      </section>

      <section className="van-hanh-board-card noi-bo-priority-board">
        <div className="van-hanh-board-head">
          <h2>Cần xử lý ngay</h2>
          <span>{canhBaoVanHanh} mục đang mở</span>
        </div>

        <div className="noi-bo-priority-grid">
          {urgentItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`noi-bo-priority-card tone-${item.tone}`}
              onClick={item.action}
            >
              <span>{item.title}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="noi-bo-operations-grid">
        <article className={`van-hanh-board-card noi-bo-operations-card ${hangDoiDatBan.length === 0 ? 'noi-bo-board-card-compact noi-bo-operations-card-empty' : ''}`}>
          <div className="van-hanh-board-head">
            <h2>Booking ưu tiên</h2>
            <span>{phamViLabel}</span>
          </div>

          {hangDoiDatBan.length === 0 ? (
            <div className="van-hanh-empty-state noi-bo-empty-state-compact">Chưa có booking phù hợp với bộ lọc hiện tại.</div>
          ) : (
            <div className="noi-bo-board-list">
              {hangDoiDatBan.slice(0, 4).map((booking) => (
                <article key={booking.id} className="noi-bo-board-item">
                  <div className="noi-bo-board-item-top">
                    <div>
                      <strong>{booking.bookingCode || booking.code || `DB-${booking.id}`}</strong>
                      <p>{booking.name} · {dinhDangSoKhach(booking.guests)}</p>
                    </div>
                    <span className={`nhan-trang-thai tone-${laySacThaiTrangThaiDatBan(booking.status)}`}>
                      {HOST_NHAN_TRANG_THAI_DAT_BAN[booking.status] || booking.status}
                    </span>
                  </div>
                  <div className="ho-so-list-meta noi-bo-board-meta">
                    <p><span>Thời gian</span><strong>{dinhDangNgayGio(booking.date, booking.time)}</strong></p>
                    <p><span>Khu vực</span><strong>{layNhanChoNgoi(booking.seatingArea)}</strong></p>
                  </div>
                  <p className="noi-bo-board-note">
                    {booking.assignedTables?.length > 0
                      ? `Bàn: ${booking.assignedTables.map((table) => table.code).join(', ')}`
                      : 'Chưa gán bàn cụ thể.'}
                  </p>
                  {(layGhiChuUuTienDatBan(booking) || booking.notes) && (
                    <p className="noi-bo-board-note">{layGhiChuUuTienDatBan(booking) || booking.notes}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </article>

        <article className={`van-hanh-board-card noi-bo-operations-card ${danhSachDonHangDangMo.length === 0 ? 'noi-bo-board-card-compact noi-bo-operations-card-empty' : ''}`}>
          <div className="van-hanh-board-head">
            <h2>Đơn đang xử lý</h2>
            <span>{danhSachDonHangDangMo.length} đơn mở</span>
          </div>

          {danhSachDonHangDangMo.length === 0 ? (
            <div className="van-hanh-empty-state noi-bo-empty-state-compact">Không có đơn mở cần xử lý.</div>
          ) : (
            <div className="noi-bo-board-list">
              {danhSachDonHangDangMo.slice(0, 4).map((order) => (
                <article key={order.id} className="noi-bo-board-item">
                  <div className="noi-bo-board-item-top">
                    <div>
                      <strong>{order.orderCode || order.code || order.id || 'DH-000001'}</strong>
                      <p>{order.customer?.fullName || 'Khách lẻ'}</p>
                    </div>
                    <span className={`nhan-trang-thai tone-${laySacThaiDonHang(order.status)}`}>
                      {layNhanTrangThaiDonHang(order.status)}
                    </span>
                  </div>
                  <div className="ho-so-list-meta noi-bo-board-meta">
                    <p><span>Ngày tạo</span><strong>{dinhDangNgay(order.orderDate)}</strong></p>
                    <p><span>Tổng tiền</span><strong>{dinhDangTienTe(order.total)}</strong></p>
                  </div>
                  {order.note && <p className="noi-bo-board-note">{order.note}</p>}
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="van-hanh-board-card noi-bo-operations-card noi-bo-ban-pressure-card">
          <div className="van-hanh-board-head">
            <h2>Áp lực bàn ăn</h2>
            <span>{tomTatTonKhoBan.dirty + danhSachDatBanChuaGanBan.length} điểm cần chú ý</span>
          </div>

          <div className="noi-bo-board-list noi-bo-board-list-scroll">
            {tomTatBan.map((area) => (
              <article key={area.id} className="noi-bo-board-item">
                <div className="noi-bo-board-item-top">
                  <strong>{area.name}</strong>
                  <span className={`nhan-trang-thai tone-${area.occupancyRate >= 0.75 ? 'danger' : area.occupancyRate >= 0.5 ? 'warning' : 'success'}`}>
                    {area.available}/{area.total} bàn trống
                  </span>
                </div>
                <p className="noi-bo-board-note">
                  {area.occupied} đang phục vụ · {area.held} giữ chỗ · {area.dirty} đang dọn.
                </p>
              </article>
            ))}
          </div>
        </article>
      </div>

      <div className="noi-bo-secondary-grid">
        <article className="van-hanh-board-card">
          <div className="van-hanh-board-head">
            <h2>Doanh thu ghi nhận</h2>
            <span>Theo đơn hiện có</span>
          </div>
          <div className="noi-bo-revenue-card">
            <strong>{dinhDangTienTe(tomTatDonHang.revenue)}</strong>
            <p>
              Theo dõi nhanh doanh thu và số đơn đang mở để cân đối phục vụ theo ca.
            </p>
          </div>
        </article>

        {isAdmin ? (
          <article className="van-hanh-board-card">
            <div className="van-hanh-board-head">
              <h2>Tổ chức nội bộ</h2>
              <span>{tomTatTaiKhoan.admins + tomTatTaiKhoan.staffs} tài khoản nội bộ</span>
            </div>
            <div className="noi-bo-overview-list">
              <div className="noi-bo-overview-item">
                <span>Quản trị viên</span>
                <strong>{tomTatTaiKhoan.admins}</strong>
              </div>
              <div className="noi-bo-overview-item">
                <span>Nhân viên vận hành</span>
                <strong>{tomTatTaiKhoan.staffs}</strong>
              </div>
              <div className="noi-bo-overview-item">
                <span>Booking đã xác nhận</span>
                <strong>{danhSachDatBanDaXacNhan.length}</strong>
              </div>
            </div>
          </article>
        ) : (
          <article className="van-hanh-board-card">
            <div className="van-hanh-board-head">
              <h2>Tóm tắt ca làm</h2>
              <span>Ưu tiên cho staff</span>
            </div>
            <div className="noi-bo-overview-list">
              <div className="noi-bo-overview-item">
                <span>Khách sắp đến</span>
                <strong>{danhSachDatBanSapDienRa.length}</strong>
              </div>
              <div className="noi-bo-overview-item">
                <span>Booking đã check-in</span>
                <strong>{soLuongDatBanDaCheckIn}</strong>
              </div>
              <div className="noi-bo-overview-item">
                <span>Chưa gán bàn</span>
                <strong>{danhSachDatBanChuaGanBan.length}</strong>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

export default TongQuanTab
