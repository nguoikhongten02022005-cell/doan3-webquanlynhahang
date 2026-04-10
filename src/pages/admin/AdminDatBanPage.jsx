import { CalendarOutlined, ClockCircleOutlined, TableOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { useOutletContext } from 'react-router-dom'
import DatBanTab from '../../components/bangDieuKhienNoiBo/DatBanTab'
import { layNhanPhamViTongQuan } from '../../features/bangDieuKhienNoiBo/boChon'
import { laDatBanDaCheckIn } from '../../features/bangDieuKhienNoiBo/boChon'

function AdminDatBanPage() {
  const {
    hangDoiDatBan,
    xuLyGanBan,
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

  const phamViLabel = layNhanPhamViTongQuan('all', 'all')

  const summaryItems = [
    {
      key: 'watching',
      label: 'Booking đang theo dõi',
      value: hangDoiDatBan.length,
      description: phamViLabel,
      icon: <CalendarOutlined />,
      accent: 'from-slate-900 to-slate-700',
    },
    {
      key: 'pending',
      label: 'Chờ xác nhận',
      value: danhSachDatBanChoXuLy.length,
      description: 'Ưu tiên liên hệ sớm để chốt bàn.',
      icon: <ClockCircleOutlined />,
      accent: 'from-amber-500 to-orange-500',
    },
    {
      key: 'unassigned',
      label: 'Chưa gán bàn',
      value: danhSachDatBanChuaGanBan.length,
      description: 'Cần phân bàn trước khi khách đến.',
      icon: <TableOutlined />,
      accent: 'from-rose-500 to-orange-500',
    },
    {
      key: 'arriving',
      label: 'Sắp đến 2 giờ',
      value: danhSachDatBanSapDienRa.length,
      description: 'Kiểm tra vị trí và ghi chú đặc biệt.',
      icon: <ClockCircleOutlined />,
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      key: 'checked-in',
      label: 'Đã check-in',
      value: hangDoiDatBan.filter((booking) => laDatBanDaCheckIn(booking)).length,
      description: 'Đang phục vụ hoặc đã xếp bàn.',
      icon: <TableOutlined />,
      accent: 'from-blue-500 to-cyan-500',
    },
  ]

  return (
    <div className="space-y-4">
      <Row gutter={[16, 16]}>
        {summaryItems.map((item) => (
          <Col key={item.key} xs={24} sm={12} xl={6}>
            <Card>
              <Statistic title={item.label} value={item.value} prefix={item.icon} />
              <div className="mt-2 text-xs text-slate-500">{item.description}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <DatBanTab
        hangDoiDatBan={hangDoiDatBan}
        getAvailableTablesForBooking={(booking) => layBanPhuHopChoDatBan(booking, danhSachBan)}
        handleAssignTables={xuLyGanBan}
        handleQuickStatusChange={(booking, status) => xuLyCapNhatDatBanNoiBo(booking.id, { status: status, trangThai: status })}
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

export default AdminDatBanPage
