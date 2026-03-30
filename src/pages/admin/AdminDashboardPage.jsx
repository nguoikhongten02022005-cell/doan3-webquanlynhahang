import { Col, Flex, Row } from 'antd'
import { useOutletContext } from 'react-router-dom'
import BookingAndOrders from '../../components/admin/dashboard/BookingAndOrders'
import RevenueChart from '../../components/admin/dashboard/RevenueChart'
import StatCards from '../../components/admin/dashboard/StatCards'
import TablePressure from '../../components/admin/dashboard/TablePressure'
import UrgentActions from '../../components/admin/dashboard/UrgentActions'

function AdminDashboardPage() {
  const { dashboardData } = useOutletContext()

  return (
    <Flex vertical gap={16} style={{ width: '100%' }}>
      <StatCards stats={dashboardData?.stats} />

      <Row gutter={[16, 16]}>
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
