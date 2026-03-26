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
    danhSachDatBan,
  } = useOutletContext()

  const phamViLabel = layNhanPhamViTongQuan('all', 'all')

  return (
    <div className="admin-page-stack">
      <BanAnTab
        variant="pos"
        bookings={danhSachDatBan}
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
