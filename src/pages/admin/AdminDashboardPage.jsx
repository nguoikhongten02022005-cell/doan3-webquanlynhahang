import { Col, Row, Space } from 'antd'
import { useOutletContext } from 'react-router-dom'
import BookingAndOrders from '../../components/admin/dashboard/BookingAndOrders'
import RevenueChart from '../../components/admin/dashboard/RevenueChart'
import StatCards from '../../components/admin/dashboard/StatCards'
import TablePressure from '../../components/admin/dashboard/TablePressure'
import UrgentActions from '../../components/admin/dashboard/UrgentActions'

function AdminDashboardPage() {
  const { dashboardData } = useOutletContext()

  return (
    <Space size="middle" style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
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
    </Space>
  )
}

export default AdminDashboardPage
