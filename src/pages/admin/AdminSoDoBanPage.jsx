import { useOutletContext } from 'react-router-dom'
import BanAnTab from '../../components/bangDieuKhienNoiBo/BanAnTab'
import { layNhanPhamViTongQuan } from '../../features/bangDieuKhienNoiBo/boChon'

function AdminSoDoBanPage() {
  const {
    xuLyDanhDauBanBan,
    xuLyDanhDauBanSanSang,
    xuLyCheckIn,
    xuLyHoanThanh,
    tomTatTonKhoBan,
    tomTatBan,
    danhSachBan,
    danhSachDatBan,
    danhSachDonHangDaSapXep,
  } = useOutletContext()

  const phamViLabel = layNhanPhamViTongQuan('all', 'all')

  return (
    <div className="admin-page-stack">
      <BanAnTab
        variant="pos"
        bookings={danhSachDatBan}
        orders={danhSachDonHangDaSapXep}
        xuLyCheckIn={xuLyCheckIn}
        xuLyDanhDauBanBan={xuLyDanhDauBanBan}
        xuLyDanhDauBanSanSang={xuLyDanhDauBanSanSang}
        xuLyHoanThanh={xuLyHoanThanh}
        phamViLabel={phamViLabel}
        tomTatTonKhoBan={tomTatTonKhoBan}
        tomTatBan={tomTatBan}
        tables={danhSachBan}
      />
    </div>
  )
}

export default AdminSoDoBanPage
