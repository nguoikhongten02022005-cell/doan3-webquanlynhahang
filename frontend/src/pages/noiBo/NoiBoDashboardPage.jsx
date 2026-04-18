import { Col, Flex, Grid, Row, Space, Typography } from 'antd'
import { useOutletContext } from 'react-router-dom'
import DatBanVaDonHang from '../../features/noiBo/dashboard/DatBanVaDonHang'
import BieuDoDoanhThu from '../../features/noiBo/dashboard/BieuDoDoanhThu'
import TheThongKe from '../../features/noiBo/dashboard/TheThongKe'
import ApLucBanAn from '../../features/noiBo/dashboard/ApLucBanAn'
import HanhDongUuTien from '../../features/noiBo/dashboard/HanhDongUuTien'

const { useBreakpoint } = Grid

function NoiBoDashboardPage() {
  const { bangDieuKhienData } = useOutletContext()
  const manHinh = useBreakpoint()
  const laMobile = manHinh.xs && !manHinh.md

  return (
    <Flex vertical gap={laMobile ? 14 : 20} style={{ width: '100%' }}>
      <Space orientation="vertical" size={4} style={{ width: '100%' }}>
        <Typography.Title level={laMobile ? 4 : 3} style={{ margin: 0 }}>
          Bảng điều khiển nhà hàng hôm nay
        </Typography.Title>
        <Typography.Text type="secondary" className="noi-bo-dashboard-subtitle">
          Theo dõi doanh thu, áp lực bàn và các đầu việc ưu tiên trong cùng một màn hình.
        </Typography.Text>
      </Space>

      <TheThongKe stats={bangDieuKhienData?.stats} />

      <Row gutter={[laMobile ? 14 : 20, laMobile ? 14 : 20]}>
        <Col xs={24} xl={16}>
          <BieuDoDoanhThu revenue={bangDieuKhienData?.revenue} />
        </Col>
        <Col xs={24} xl={8}>
          <ApLucBanAn tablePressure={bangDieuKhienData?.tablePressure} />
        </Col>
      </Row>

      <HanhDongUuTien urgentTasks={bangDieuKhienData?.urgentTasks} />

      <DatBanVaDonHang bookings={bangDieuKhienData?.bookings} orders={bangDieuKhienData?.orders} />
    </Flex>
  )
}

export default NoiBoDashboardPage
