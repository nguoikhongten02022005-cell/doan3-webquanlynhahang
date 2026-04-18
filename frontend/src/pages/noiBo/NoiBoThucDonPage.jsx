import { Alert, Space, Typography } from 'antd'
import { useOutletContext } from 'react-router-dom'
import MonAnTab from '../../features/noiBo/components/MonAnTab'
import { useXacThuc } from '../../hooks/useXacThuc'

function NoiBoThucDonPage() {
  const { danhSachMon, taiLaiDanhSachMon } = useOutletContext()
  const { laQuanLy } = useXacThuc()

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      {!laQuanLy ? (
        <Alert
          type="info"
          showIcon
          title="Nhân viên chỉ được xem nhanh danh sách món tại khu vực nội bộ."
          description="Các thao tác thêm, sửa, xóa và cập nhật hiển thị món hiện chỉ dành cho quản lý."
        />
      ) : null}
      <MonAnTab dishes={danhSachMon} reloadDishes={taiLaiDanhSachMon} cheDoChiXem={!laQuanLy} />
    </Space>
  )
}

export default NoiBoThucDonPage
