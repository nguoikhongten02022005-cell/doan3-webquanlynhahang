import { useOutletContext } from 'react-router-dom'
import DatBanTab from '../../components/bangDieuKhienNoiBo/DatBanTab'
import { layNhanPhamViTongQuan } from '../../features/bangDieuKhienNoiBo/boChon'

function AdminDatBanPage() {
  const {
    hangDoiDatBan,
    xuLyGanBan,
    xuLyCheckIn,
    xuLyHoanThanh,
    xuLyTaoDatBanNoiBo,
    xuLyKhachKhongDen,
    xuLyCapNhatDatBanNoiBo,
    layBanPhuHopChoDatBan,
    danhSachBan,
    danhSachDatBanChoXuLy,
    danhSachDatBanSapDienRa,
    danhSachDatBanChuaGanBan,
  } = useOutletContext()

  const phamViLabel = layNhanPhamViTongQuan('all', 'all')

  return (
    <div className="admin-page-stack">
      <section className="admin-summary-strip" aria-label="Tóm tắt đặt bàn">
        <article className="admin-summary-strip__card">
          <span>Booking đang theo dõi</span>
          <strong>{hangDoiDatBan.length}</strong>
          <p>{phamViLabel}</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Chờ xác nhận</span>
          <strong>{danhSachDatBanChoXuLy.length}</strong>
          <p>Ưu tiên liên hệ sớm để chốt bàn.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Chưa gán bàn</span>
          <strong>{danhSachDatBanChuaGanBan.length}</strong>
          <p>Cần phân bàn trước khi khách đến.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Sắp đến trong 2 giờ</span>
          <strong>{danhSachDatBanSapDienRa.length}</strong>
          <p>Kiểm tra vị trí và ghi chú đặc biệt.</p>
        </article>
      </section>

      <DatBanTab
        hangDoiDatBan={hangDoiDatBan}
        getAvailableTablesForBooking={(booking) => layBanPhuHopChoDatBan(booking, danhSachBan)}
        handleAssignTables={xuLyGanBan}
        handleCheckIn={xuLyCheckIn}
        handleComplete={xuLyHoanThanh}
        handleCreateInternalBooking={xuLyTaoDatBanNoiBo}
        xuLyKhachKhongDen={xuLyKhachKhongDen}
        handleUpdateInternalBooking={xuLyCapNhatDatBanNoiBo}
        phamViLabel={phamViLabel}
      />
    </div>
  )
}

export default AdminDatBanPage
