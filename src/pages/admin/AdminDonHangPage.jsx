import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import DonHangTab from '../../components/bangDieuKhienNoiBo/DonHangTab'

function AdminDonHangPage() {
  const {
    danhSachDonHangDaSapXep,
    tomTatDonHang,
    layChiTietDonHang,
    xuLyCapNhatTrangThaiDonHang,
  } = useOutletContext()

  const donChoXuLy = useMemo(
    () => danhSachDonHangDaSapXep.filter((order) => ['MOI_TAO', 'DANG_CHUAN_BI', 'DANG_PHUC_VU'].includes(order.status)).length,
    [danhSachDonHangDaSapXep],
  )

  return (
    <div className="admin-page-stack">
      <DonHangTab
        orders={danhSachDonHangDaSapXep}
        tomTatDonHang={tomTatDonHang}
        donChoXuLy={donChoXuLy}
        layChiTietDonHang={layChiTietDonHang}
        onUpdateOrderStatus={xuLyCapNhatTrangThaiDonHang}
      />
    </div>
  )
}

export default AdminDonHangPage
