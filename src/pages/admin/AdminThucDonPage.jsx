import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import MonAnTab from '../../components/bangDieuKhienNoiBo/MonAnTab'
import { CAC_DANH_MUC_CHUAN_THUC_DON } from '../../constants/danhMucThucDon'

function AdminThucDonPage() {
  const { danhSachMon, taiLaiDanhSachMon } = useOutletContext()

  const tongDanhMuc = useMemo(
    () => CAC_DANH_MUC_CHUAN_THUC_DON.filter((category) => danhSachMon.some((dish) => dish.category === category)).length,
    [danhSachMon],
  )

  const monGiaCaoNhat = useMemo(
    () => [...danhSachMon].sort((left, right) => (right.priceValue || 0) - (left.priceValue || 0))[0],
    [danhSachMon],
  )

  return (
    <div className="admin-page-stack">
      <section className="admin-summary-strip" aria-label="Tóm tắt thực đơn">
        <article className="admin-summary-strip__card">
          <span>Tổng số món</span>
          <strong>{danhSachMon.length}</strong>
          <p>Danh sách đang đồng bộ với menu hiện tại.</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Danh mục hoạt động</span>
          <strong>{tongDanhMuc}</strong>
          <p>{CAC_DANH_MUC_CHUAN_THUC_DON.join(' • ')}</p>
        </article>
        <article className="admin-summary-strip__card">
          <span>Món giá cao nhất</span>
          <strong>{monGiaCaoNhat?.name || '—'}</strong>
          <p>{monGiaCaoNhat?.price || 'Chưa có dữ liệu'}</p>
        </article>
      </section>

      <MonAnTab dishes={danhSachMon} reloadDishes={taiLaiDanhSachMon} />
    </div>
  )
}

export default AdminThucDonPage
