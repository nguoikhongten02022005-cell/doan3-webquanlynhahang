import { Card, Col, Row, Statistic } from 'antd'
import { dinhDangTienTe } from '../../../utils/tienTe'

const STAT_VALUE_STYLE = {
  fontSize: 30,
  fontWeight: 700,
  lineHeight: 1.05,
}

const STAT_TITLE_STYLE = {
  color: '#6b7280',
  fontSize: 13,
}

function StatCards({ stats }) {
  const items = [
    {
      key: 'today-revenue',
      title: 'Doanh thu hôm nay',
      value: stats?.todayRevenue || 0,
      formatter: (value) => dinhDangTienTe(Number(value) || 0),
    },
    {
      key: 'open-bookings',
      title: 'Booking đang mở',
      value: stats?.openBookings || 0,
    },
    {
      key: 'serving-tables',
      title: 'Bàn đang phục vụ',
      value: stats?.servingTables || 0,
    },
  ]

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col key={item.key} xs={24} sm={12} lg={8}>
          <Card className="noi-bo-dashboard-card" variant="borderless" styles={{ body: { padding: '10px 14px' } }}>
            <Statistic title={item.title} value={item.value} formatter={item.formatter} styles={{ title: STAT_TITLE_STYLE, content: STAT_VALUE_STYLE }} />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default StatCards
