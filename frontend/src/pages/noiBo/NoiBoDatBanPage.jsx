import { useCallback, useMemo } from 'react'
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, TableOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { useOutletContext } from 'react-router-dom'
import DatBanTab from '../../features/noiBo/components/DatBanTab'
import { layNhanBoLocTongQuan, laDatBanDaCheckIn } from '../../features/noiBo/boChon'

function NoiBoDatBanPage() {
  const {
    hangDoiDatBan,
    xuLyGanBan,
    xuLyCapNhatTrangThaiDatBan,
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

  const phamViLabel = layNhanBoLocTongQuan('all', 'all')
  const tongDaCheckIn = useMemo(
    () => hangDoiDatBan.filter((booking) => laDatBanDaCheckIn(booking)).length,
    [hangDoiDatBan],
  )

  const layDanhSachBanPhuHop = useCallback(
    (booking) => layBanPhuHopChoDatBan(booking, danhSachBan),
    [danhSachBan, layBanPhuHopChoDatBan],
  )

  const xuLyCapNhatTrangThaiNhanh = useCallback(
    (booking, status) => xuLyCapNhatTrangThaiDatBan(booking.id, status, 'Không thể cập nhật trạng thái booking.'),
    [xuLyCapNhatTrangThaiDatBan],
  )

  const danhSachThongKe = useMemo(() => [
    {
      key: 'watching',
      label: 'Booking đang theo dõi',
      value: hangDoiDatBan.length,
      description: phamViLabel,
      icon: <CalendarOutlined />,
    },
    {
      key: 'pending',
      label: 'Chờ xác nhận',
      value: danhSachDatBanChoXuLy.length,
      description: 'Ưu tiên liên hệ sớm để chốt bàn.',
      icon: <ClockCircleOutlined />,
      color: '#d97706',
    },
    {
      key: 'unassigned',
      label: 'Chưa gán bàn',
      value: danhSachDatBanChuaGanBan.length,
      description: 'Cần phân bàn trước khi khách đến.',
      icon: <TableOutlined />,
      color: '#dc2626',
    },
    {
      key: 'arriving',
      label: 'Sắp đến 2 giờ',
      value: danhSachDatBanSapDienRa.length,
      description: 'Kiểm tra vị trí và ghi chú đặc biệt.',
      icon: <ClockCircleOutlined />,
      color: '#059669',
    },
    {
      key: 'checked-in',
      label: 'Đã check-in',
      value: tongDaCheckIn,
      description: 'Đang phục vụ hoặc đã xếp bàn.',
      icon: <CheckCircleOutlined />,
      color: '#2563eb',
    },
  ], [
    danhSachDatBanChoXuLy.length,
    danhSachDatBanChuaGanBan.length,
    danhSachDatBanSapDienRa.length,
    hangDoiDatBan.length,
    phamViLabel,
    tongDaCheckIn,
  ])

  return (
    <div className="noi-bo-dat-ban-page">
      <Row gutter={[16, 16]}>
        {danhSachThongKe.map((thongKe, index) => (
          <Col key={thongKe.key} xs={24} sm={12} xl={index < 3 ? 8 : 12}>
            <Card className="noi-bo-dat-ban-summary-card">
              <Statistic
                title={thongKe.label}
                value={thongKe.value}
                prefix={thongKe.icon}
                styles={thongKe.color ? { content: { color: thongKe.color } } : undefined}
              />
              <div className="noi-bo-dat-ban-summary-note">{thongKe.description}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <DatBanTab
        hangDoiDatBan={hangDoiDatBan}
        getAvailableTablesForBooking={layDanhSachBanPhuHop}
        handleAssignTables={xuLyGanBan}
        handleQuickStatusChange={xuLyCapNhatTrangThaiNhanh}
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

export default NoiBoDatBanPage
