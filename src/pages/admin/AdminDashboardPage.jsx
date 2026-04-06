import { Col, Flex, Grid, Row, Space, Typography } from 'antd'
import { useOutletContext } from 'react-router-dom'
import BookingAndOrders from '../../components/admin/dashboard/BookingAndOrders'
import RevenueChart from '../../components/admin/dashboard/RevenueChart'
import StatCards from '../../components/admin/dashboard/StatCards'
import TablePressure from '../../components/admin/dashboard/TablePressure'
import UrgentActions from '../../components/admin/dashboard/UrgentActions'

const { useBreakpoint } = Grid

function AdminDashboardPage() {
  const { dashboardData } = useOutletContext()
  const manHinh = useBreakpoint()
  const laMobile = manHinh.xs && !manHinh.md

  return (
    <Flex vertical gap={laMobile ? 14 : 20} style={{ width: '100%' }}>
      <Space orientation="vertical" size={4} style={{ width: '100%' }}>
        <Typography.Text className="admin-dashboard-kicker">Toàn cảnh vận hành</Typography.Text>
        <Typography.Title level={laMobile ? 4 : 3} style={{ margin: 0 }}>
          Dashboard nhà hàng hôm nay
        </Typography.Title>
        <Typography.Text type="secondary" className="admin-dashboard-subtitle">
          Theo dõi doanh thu, áp lực bàn và các đầu việc ưu tiên trong cùng một màn hình.
        </Typography.Text>
      </Space>

      <StatCards stats={dashboardData?.stats} />

      <Row gutter={[laMobile ? 14 : 20, laMobile ? 14 : 20]}>
        <Col xs={24} xl={16}>
          <RevenueChart revenue={dashboardData?.revenue} />
        </Col>
        <Col xs={24} xl={8}>
          <TablePressure tablePressure={dashboardData?.tablePressure} />
        </Col>
      </Row>

      <UrgentActions urgentTasks={dashboardData?.urgentTasks} />

      <BookingAndOrders bookings={dashboardData?.bookings} orders={dashboardData?.orders} />
    </Flex>
  )
}

export default AdminDashboardPage
