import { useOutletContext } from 'react-router-dom'
import BanAnTab from '../../components/bangDieuKhienNoiBo/BanAnTab'
import { layNhanPhamViTongQuan } from '../../features/bangDieuKhienNoiBo/boChon'

function AdminSoDoBanPage() {
  const {
    xuLyDanhDauBanBan,
    xuLyDanhDauBanSanSang,
    tomTatTonKhoBan,
    tomTatBan,
    danhSachBan,
  } = useOutletContext()

  const phamViLabel = layNhanPhamViTongQuan('all', 'all')

  return (
    <div className="admin-page-stack">
      <section className="admin-legend-row" aria-label="Chú thích trạng thái bàn">
        <span><i className="tone-available" /> Trống</span>
        <span><i className="tone-held" /> Đã đặt trước</span>
        <span><i className="tone-occupied" /> Đang phục vụ</span>
        <span><i className="tone-dirty" /> Cần dọn</span>
      </section>

      <BanAnTab
        xuLyDanhDauBanBan={xuLyDanhDauBanBan}
        xuLyDanhDauBanSanSang={xuLyDanhDauBanSanSang}
        phamViLabel={phamViLabel}
        tomTatTonKhoBan={tomTatTonKhoBan}
        tomTatBan={tomTatBan}
        tables={danhSachBan}
      />
    </div>
  )
}

export default AdminSoDoBanPage
