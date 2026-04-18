import { Card, Col, Row, Statistic } from 'antd'
import { dinhDangTienTe } from '../../../utils/tienTe'

const KIEU_GIA_TRI_THONG_KE = {
  fontSize: 30,
  fontWeight: 700,
  lineHeight: 1.05,
}

const KIEU_TIEU_DE_THONG_KE = {
  color: '#6b7280',
  fontSize: 13,
}

function TheThongKe({ stats }) {
  const danhSachTheThongKe = [
    {
      key: 'today-revenue',
      title: 'Doanh thu hôm nay',
      value: stats?.todayRevenue || 0,
      formatter: (value) => dinhDangTienTe(Number(value) || 0),
    },
    {
      key: 'open-bookings',
      title: 'Đơn đặt bàn đang mở',
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
      {danhSachTheThongKe.map((theThongKe) => (
        <Col key={theThongKe.key} xs={24} sm={12} lg={8}>
          <Card className="noi-bo-dashboard-card" variant="borderless" styles={{ body: { padding: '10px 14px' } }}>
            <Statistic title={theThongKe.title} value={theThongKe.value} formatter={theThongKe.formatter} styles={{ title: KIEU_TIEU_DE_THONG_KE, content: KIEU_GIA_TRI_THONG_KE }} />
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default TheThongKe
