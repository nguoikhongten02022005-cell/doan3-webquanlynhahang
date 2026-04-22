import { Card, Col, Row, Table, Tabs, Tag, Typography } from 'antd'
import DashboardEmptyState from './DashboardEmptyState'
import { ClockCircleOutlined, EnvironmentOutlined, InboxOutlined, TableOutlined } from '@ant-design/icons'
import { dinhDangSoKhach, layNhanChoNgoi, layNhanTrangThaiDatBan, laySacThaiTrangThaiDatBan, laySacThaiDonHang } from '../dinhDang'
import { layNhanTrangThaiDonHang } from '../../../utils/donHang'
import { dinhDangTienTe } from '../../../utils/tienTe'

const MAU_NHAN_DAT_BAN = {
  danger: 'error',
  warning: 'warning',
  success: 'success',
  neutral: 'blue',
}

const MAU_NHAN_DON_HANG = {
  danger: 'error',
  warning: 'warning',
  success: 'success',
  neutral: 'processing',
}

const taoEmptyState = (tieuDe, moTa) => (
  <DashboardEmptyState table title={tieuDe} description={moTa} />
)

function DatBanVaDonHang({ bookings, orders }) {
  const danhSachBooking = Array.isArray(bookings) ? bookings : []
  const danhSachDonHang = Array.isArray(orders) ? orders : []

  const cotDatBan = [
    {
      title: 'Booking',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (_, booking) => (
        <div className="noi-bo-dashboard-list-item">
          <Typography.Text strong>
            {booking.bookingCode || booking.id} · {booking.name} ({dinhDangSoKhach(booking.guests)})
          </Typography.Text>
          <div className="noi-bo-dashboard-list-meta">
            <span><ClockCircleOutlined /> {booking.time || '--'}</span>
            <span><EnvironmentOutlined /> {layNhanChoNgoi(booking.seatingArea)}</span>
            <span><TableOutlined /> {booking.assignedTables?.[0]?.code || '--'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={MAU_NHAN_DAT_BAN[laySacThaiTrangThaiDatBan(status)] || 'default'}>
          {layNhanTrangThaiDatBan(status)}
        </Tag>
      ),
    },
  ]

  const cotDonHang = [
    {
      title: 'Đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (_, order) => (
        <div className="noi-bo-dashboard-list-item">
          <Typography.Text strong>{order.orderCode || order.id} · {order.customer?.fullName || 'Khách lẻ'}</Typography.Text>
          <div className="noi-bo-dashboard-list-meta">
            <span><InboxOutlined /> {order.tableNumber || '--'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Bàn',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      render: (value) => value || '--',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (value) => dinhDangTienTe(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={MAU_NHAN_DON_HANG[laySacThaiDonHang(status)] || 'default'}>
          {layNhanTrangThaiDonHang(status)}
        </Tag>
      ),
    },
  ]

  const bangDatBan = (
    <Table
      className="noi-bo-dashboard-table"
      rowKey="id"
      size="small"
      pagination={danhSachBooking.length > 5 ? { pageSize: 5, size: 'small' } : false}
      columns={cotDatBan}
      dataSource={danhSachBooking}
      scroll={danhSachBooking.length > 0 ? { x: 720, y: 300 } : { x: 720 }}
      locale={{
        emptyText: taoEmptyState('Không có booking ưu tiên', 'Các booking cần chú ý sẽ hiển thị tại đây.'),
      }}
    />
  )

  const bangDonHang = (
    <Table
      className="noi-bo-dashboard-table"
      rowKey="id"
      size="small"
      pagination={danhSachDonHang.length > 5 ? { pageSize: 5, size: 'small' } : false}
      columns={cotDonHang}
      dataSource={danhSachDonHang}
      scroll={danhSachDonHang.length > 0 ? { x: 620, y: 300 } : { x: 620 }}
      locale={{
        emptyText: taoEmptyState('Không có đơn đang xử lý', 'Các đơn mở cần theo dõi sẽ hiển thị tại đây.'),
      }}
    />
  )

  return (
    <>
      <div className="noi-bo-dashboard-mobile-only">
        <Card className="noi-bo-dashboard-card" styles={{ body: { padding: '12px 14px' } }}>
          <Tabs
            items={[
              {
                key: 'bookings',
                label: 'Booking',
                children: bangDatBan,
              },
              {
                key: 'orders',
                label: 'Đơn hàng',
                children: bangDonHang,
              },
            ]}
          />
        </Card>
      </div>

      <div className="noi-bo-dashboard-desktop-only">
        <Row className="noi-bo-dashboard-secondary-grid" gutter={[16, 16]}>
          <Col xs={24} xxl={13}>
            <Card className="noi-bo-dashboard-card" title="Booking ưu tiên" styles={{ body: { padding: '12px 14px' } }}>
              {bangDatBan}
            </Card>
          </Col>
          <Col xs={24} xxl={11}>
            <Card className="noi-bo-dashboard-card" title="Đơn đang xử lý" styles={{ body: { padding: '12px 14px' } }}>
              {bangDonHang}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default DatBanVaDonHang
