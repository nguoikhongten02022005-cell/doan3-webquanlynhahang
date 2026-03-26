import { Card, Col, Row, Table, Tabs, Tag, Typography } from 'antd'
import { ClockCircleOutlined, EnvironmentOutlined, InboxOutlined, TableOutlined } from '@ant-design/icons'
import { HOST_NHAN_TRANG_THAI_DAT_BAN } from '../../../data/duLieuDatBan'
import { dinhDangSoKhach, layNhanChoNgoi } from '../../../features/bangDieuKhienNoiBo/dinhDang'
import { layNhanTrangThaiDonHang } from '../../../utils/donHang'
import { laySacThaiTrangThaiDatBan, laySacThaiDonHang } from '../../../features/bangDieuKhienNoiBo/dinhDang'
import { dinhDangTienTe } from '../../../utils/tienTe'

const BOOKING_TAG_COLOR = {
  danger: 'error',
  warning: 'warning',
  success: 'success',
  neutral: 'blue',
}

const ORDER_TAG_COLOR = {
  danger: 'error',
  warning: 'warning',
  success: 'success',
  neutral: 'processing',
}

function BookingAndOrders({ bookings, orders }) {
  const bookingColumns = [
    {
      title: 'Booking',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      render: (_, booking) => (
        <div className="admin-dashboard-list-item">
          <Typography.Text strong>
            {booking.bookingCode || booking.id} · {booking.name} ({dinhDangSoKhach(booking.guests)})
          </Typography.Text>
          <div className="admin-dashboard-list-meta">
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
        <Tag color={BOOKING_TAG_COLOR[laySacThaiTrangThaiDatBan(status)] || 'default'}>
          {HOST_NHAN_TRANG_THAI_DAT_BAN[status] || status}
        </Tag>
      ),
    },
  ]

  const orderColumns = [
    {
      title: 'Đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (_, order) => (
        <div className="admin-dashboard-list-item">
          <Typography.Text strong>{order.orderCode || order.id} · {order.customer?.fullName || 'Khách lẻ'}</Typography.Text>
          <div className="admin-dashboard-list-meta">
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
        <Tag color={ORDER_TAG_COLOR[laySacThaiDonHang(status)] || 'default'}>
          {layNhanTrangThaiDonHang(status)}
        </Tag>
      ),
    },
  ]

  const bookingTable = (
    <Table
      rowKey="id"
      size="small"
      pagination={{ pageSize: 5, size: 'small' }}
      columns={bookingColumns}
      dataSource={bookings || []}
      scroll={{ x: 720, y: 316 }}
    />
  )

  const orderTable = (
    <Table
      rowKey="id"
      size="small"
      pagination={{ pageSize: 5, size: 'small' }}
      columns={orderColumns}
      dataSource={orders || []}
      scroll={{ x: 620, y: 316 }}
    />
  )

  return (
    <>
      <div className="admin-dashboard-mobile-only">
        <Card className="admin-dashboard-card" styles={{ body: { padding: '10px 14px' } }}>
          <Tabs
            items={[
              {
                key: 'bookings',
                label: 'Booking',
                children: bookingTable,
              },
              {
                key: 'orders',
                label: 'Đơn hàng',
                children: orderTable,
              },
            ]}
          />
        </Card>
      </div>

      <div className="admin-dashboard-desktop-only">
        <Row gutter={[16, 16]}>
          <Col xs={24} xxl={13}>
            <Card className="admin-dashboard-card" title="Booking ưu tiên" styles={{ body: { padding: '10px 14px' } }}>
              {bookingTable}
            </Card>
          </Col>
          <Col xs={24} xxl={11}>
            <Card className="admin-dashboard-card" title="Đơn đang xử lý" styles={{ body: { padding: '10px 14px' } }}>
              {orderTable}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default BookingAndOrders
