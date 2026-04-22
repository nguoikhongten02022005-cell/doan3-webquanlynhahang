import { Card, Col, Row, Typography } from 'antd'
import { dinhDangTienTe } from '../../../utils/tienTe'

const dinhDangSoNguyen = (value) => (Number(value) || 0).toLocaleString('vi-VN')

function TheThongKe({ stats, loading = false }) {
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
      formatter: dinhDangSoNguyen,
    },
    {
      key: 'serving-tables',
      title: 'Bàn đang phục vụ',
      value: stats?.servingTables || 0,
      tone: 'neutral',
      formatter: dinhDangSoNguyen,
    },
  ]

  return (
    <Row className="noi-bo-dashboard-kpi-grid" gutter={[16, 16]}>
      {danhSachTheThongKe.map((theThongKe) => {
        const giaTriHienThi = theThongKe.formatter(theThongKe.value)

        return (
          <Col key={theThongKe.key} xs={24} sm={12} lg={8}>
            <Card
              className={`noi-bo-dashboard-card noi-bo-dashboard-kpi-card noi-bo-dashboard-kpi-card--${theThongKe.tone}`}
              loading={loading}
              styles={{ body: { padding: '18px 18px 16px' } }}
            >
              <div className="noi-bo-dashboard-kpi-card__content">
                <Typography.Text className="noi-bo-dashboard-kpi-card__title">
                  {theThongKe.title}
                </Typography.Text>
                <Typography.Text className="noi-bo-dashboard-kpi-card__value" title={giaTriHienThi}>
                  {giaTriHienThi}
                </Typography.Text>
              </div>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default TheThongKe
