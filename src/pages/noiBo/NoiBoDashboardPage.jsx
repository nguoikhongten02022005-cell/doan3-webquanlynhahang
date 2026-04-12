import { Col, Flex, Grid, Row, Space, Typography } from 'antd'
import { useOutletContext } from 'react-router-dom'
import BookingAndOrders from '../../features/noiBo/dashboard/BookingAndOrders'
import RevenueChart from '../../features/noiBo/dashboard/RevenueChart'
import StatCards from '../../features/noiBo/dashboard/StatCards'
import TablePressure from '../../features/noiBo/dashboard/TablePressure'
import UrgentActions from '../../features/noiBo/dashboard/UrgentActions'

const { useBreakpoint } = Grid

function NoiBoDashboardPage() {
  const { bangDieuKhienData } = useOutletContext()
  const manHinh = useBreakpoint()
  const laMobile = manHinh.xs && !manHinh.md

  return (
    <Flex vertical gap={laMobile ? 14 : 20} style={{ width: '100%' }}>
      <Space orientation="vertical" size={4} style={{ width: '100%' }}>
        <Typography.Text className="noi-bo-dashboard-kicker">Toàn cảnh vận hành</Typography.Text>
        <Typography.Title level={laMobile ? 4 : 3} style={{ margin: 0 }}>
          Bảng điều khiển nhà hàng hôm nay
        </Typography.Title>
        <Typography.Text type="secondary" className="noi-bo-dashboard-subtitle">
          Theo dõi doanh thu, áp lực bàn và các đầu việc ưu tiên trong cùng một màn hình.
        </Typography.Text>
      </Space>

      <StatCards stats={bangDieuKhienData?.stats} />

      <Row gutter={[laMobile ? 14 : 20, laMobile ? 14 : 20]}>
        <Col xs={24} xl={16}>
          <RevenueChart revenue={bangDieuKhienData?.revenue} />
        </Col>
        <Col xs={24} xl={8}>
          <TablePressure tablePressure={bangDieuKhienData?.tablePressure} />
        </Col>
      </Row>

      <UrgentActions urgentTasks={bangDieuKhienData?.urgentTasks} />

      <BookingAndOrders bookings={bangDieuKhienData?.bookings} orders={bangDieuKhienData?.orders} />
    </Flex>
  )
}

export default NoiBoDashboardPage
