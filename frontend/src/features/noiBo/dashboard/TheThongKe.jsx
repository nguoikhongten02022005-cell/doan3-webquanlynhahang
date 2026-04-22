import { Card, Col, Row, Statistic } from 'antd'
import { dinhDangTienTe } from '../../../utils/tienTe'

const KIEU_GIA_TRI_THONG_KE = {
  color: '#1C1917',
  fontSize: 34,
  fontWeight: 800,
  lineHeight: 1,
}

const KIEU_TIEU_DE_THONG_KE = {
  color: '#78716C',
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.5,
}

function TheThongKe({ stats }) {
  const danhSachTheThongKe = [
    {
      key: 'today-revenue',
      title: 'Doanh thu hôm nay',
      value: stats?.todayRevenue || 0,
      tone: 'revenue',
      formatter: (value) => dinhDangTienTe(Number(value) || 0),
    },
    {
      key: 'open-bookings',
      title: 'Đơn đặt bàn đang mở',
      value: stats?.openBookings || 0,
      tone: 'warning',
    },
    {
      key: 'serving-tables',
      title: 'Bàn đang phục vụ',
      value: stats?.servingTables || 0,
      tone: 'neutral',
    },
  ]

  return (
    <Row className="noi-bo-dashboard-kpi-grid" gutter={[16, 16]}>
      {danhSachTheThongKe.map((theThongKe) => (
        <Col key={theThongKe.key} xs={24} sm={12} lg={8}>
          <Card className={`noi-bo-dashboard-card noi-bo-dashboard-kpi-card noi-bo-dashboard-kpi-card--${theThongKe.tone}`} variant="borderless" styles={{ body: { padding: '16px 18px' } }}>
            <Statistic title={theThongKe.title} value={theThongKe.value} formatter={theThongKe.formatter} styles={{ title: KIEU_TIEU_DE_THONG_KE, content: KIEU_GIA_TRI_THONG_KE }} />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default TheThongKe
