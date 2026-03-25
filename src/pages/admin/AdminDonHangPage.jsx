import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import DonHangTab from '../../components/bangDieuKhienNoiBo/DonHangTab'
import { dinhDangTienTe } from '../../utils/tienTe'

function AdminDonHangPage() {
  const { danhSachDonHangDaSapXep, tomTatDonHang } = useOutletContext()

  const donChoXuLy = useMemo(
    () => danhSachDonHangDaSapXep.filter((order) => ['MOI_TAO', 'DANG_CHUAN_BI', 'DANG_PHUC_VU'].includes(order.status)).length,
    [danhSachDonHangDaSapXep],
  )

  return (
    <div className="admin-page-stack">
      <section className="admin-summary-strip" aria-label="Tóm tắt đơn hàng">
        <article className="admin-summary-strip__card">
          <span>Đơn đang mở</span>
          <strong>{tomTatDonHang.total}</strong>
          <p>{donChoXuLy} đơn cần xử lý ngay.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Đơn chờ bếp/phục vụ</span>
          <strong>{tomTatDonHang.pending}</strong>
          <p>Ưu tiên ca đang đông khách.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Doanh thu ghi nhận</span>
          <strong>{dinhDangTienTe(tomTatDonHang.revenue)}</strong>
          <p>Dựa trên các đơn hiện có.</p>
        </article>
      </section>

      <DonHangTab orders={danhSachDonHangDaSapXep} />
    </div>
  )
}

export default AdminDonHangPage
