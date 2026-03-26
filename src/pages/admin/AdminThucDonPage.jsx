import { useOutletContext } from 'react-router-dom'
import MonAnTab from '../../components/bangDieuKhienNoiBo/MonAnTab'

function AdminThucDonPage() {
  const { danhSachMon, taiLaiDanhSachMon } = useOutletContext()

  return <MonAnTab dishes={danhSachMon} reloadDishes={taiLaiDanhSachMon} />
}

export default AdminThucDonPage
