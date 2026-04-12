import { useOutletContext } from 'react-router-dom'
import BanAnTab from '../../features/noiBo/components/BanAnTab'
import { layNhanPhamViTongQuan } from '../../features/noiBo/boChon'

function NoiBoSoDoBanPage() {
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
    <div className="noi-bo-page-stack">
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

export default NoiBoSoDoBanPage
