import { Card, Col, Row, Table, Tabs, Tag, Typography } from 'antd'
import { ClockCircleOutlined, EnvironmentOutlined, InboxOutlined, TableOutlined } from '@ant-design/icons'
import DashboardEmptyState from './DashboardEmptyState'
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

const dinhDangSoNguyen = (value) => (Number(value) || 0).toLocaleString('vi-VN')

const taoEmptyState = (tieuDe, moTa) => (
  <DashboardEmptyState table title={tieuDe} description={moTa} />
)

const taoTieuDeKhoi = ({ kicker, title, count, noun }) => (
  <div className="noi-bo-dashboard-table-section__header">
    <div className="noi-bo-dashboard-table-section__copy">
      <Typography.Text className="noi-bo-dashboard-table-section__kicker">{kicker}</Typography.Text>
      <Typography.Title level={5} className="noi-bo-dashboard-table-section__title">{title}</Typography.Title>
    </div>
    <Typography.Text className="noi-bo-dashboard-table-section__count">
      {`${dinhDangSoNguyen(count)} ${noun}`}
    </Typography.Text>
  </div>
)

const taoPhanTrang = (tongSoDong) => (tongSoDong > 6 ? { pageSize: 6, size: 'small', showSizeChanger: false } : false)
const taoScroll = (tongSoDong, x) => (tongSoDong > 6 ? { x, y: 336 } : { x })

function DatBanVaDonHang({ bookings, orders, loading = false }) {
  const danhSachBooking = Array.isArray(bookings) ? bookings : []
  const danhSachDonHang = Array.isArray(orders) ? orders : []
  const duLieuBangDatBan = danhSachBooking.map((booking, index) => ({
    ...booking,
    __dashboardRowKey: booking.id || booking.bookingCode || `booking-${index}-${booking.name || 'khach'}-${booking.time || 'na'}`,
  }))
  const duLieuBangDonHang = danhSachDonHang.map((order, index) => ({
    ...order,
    __dashboardRowKey: order.id || order.orderCode || `order-${index}-${order.customer?.fullName || 'khach'}-${order.tableNumber || 'na'}`,
  }))

  const cotDatBan = [
    {
      title: 'Booking ưu tiên',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
      width: 320,
      render: (_, booking) => (
        <div className="noi-bo-dashboard-list-item">
          <Typography.Text strong>
            {booking.bookingCode || booking.id} · {booking.name || 'Khách đặt bàn'}
          </Typography.Text>
          <div className="noi-bo-dashboard-list-meta">
            <span>{dinhDangSoKhach(booking.guests || 0)}</span>
            <span><ClockCircleOutlined /> {booking.time || '--'}</span>
            <span><EnvironmentOutlined /> {layNhanChoNgoi(booking.seatingArea)}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Bàn',
      dataIndex: 'danhSachBanDaGan',
      key: 'danhSachBanDaGan',
      width: 110,
      align: 'center',
      render: (danhSachBanDaGan) => danhSachBanDaGan?.[0]?.code || 'Chưa gán',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status) => (
        <Tag color={MAU_NHAN_DAT_BAN[laySacThaiTrangThaiDatBan(status)] || 'default'}>
          {layNhanTrangThaiDatBan(status)}
        </Tag>
      ),
    },
  ]

  const cotDonHang = [
    {
      title: 'Đơn đang xử lý',
      dataIndex: 'id',
      key: 'id',
      width: 280,
      render: (_, order) => (
        <div className="noi-bo-dashboard-list-item">
          <Typography.Text strong>{order.orderCode || order.id} · {order.customer?.fullName || 'Khách lẻ'}</Typography.Text>
          <div className="noi-bo-dashboard-list-meta">
            <span><InboxOutlined /> {order.customer?.phone || 'Phục vụ tại quầy / bàn'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Bàn',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      width: 96,
      align: 'center',
      render: (value) => value || '--',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 132,
      align: 'right',
      render: (value) => dinhDangTienTe(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
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
      rowKey="__dashboardRowKey"
      size="small"
      loading={loading}
      pagination={taoPhanTrang(danhSachBooking.length)}
      columns={cotDatBan}
      dataSource={duLieuBangDatBan}
      scroll={taoScroll(danhSachBooking.length, 640)}
      locale={{
        emptyText: taoEmptyState('Không có booking ưu tiên', 'Các booking cần xác nhận hoặc sắp đến sẽ hiển thị tại đây.'),
      }}
    />
  )

  const bangDonHang = (
    <Table
      className="noi-bo-dashboard-table"
      rowKey="__dashboardRowKey"
      size="small"
      loading={loading}
      pagination={taoPhanTrang(danhSachDonHang.length)}
      columns={cotDonHang}
      dataSource={duLieuBangDonHang}
      scroll={taoScroll(danhSachDonHang.length, 620)}
      locale={{
        emptyText: taoEmptyState('Không có đơn đang xử lý', 'Các đơn mở cần theo dõi sẽ hiển thị tại đây.'),
      }}
    />
  )

  const khoiDatBan = (
    <div className="noi-bo-dashboard-table-section">
      {taoTieuDeKhoi({
        kicker: 'Ưu tiên theo dõi',
        title: 'Booking ưu tiên',
        count: danhSachBooking.length,
        noun: 'booking',
      })}
      {bangDatBan}
    </div>
  )

  const khoiDonHang = (
    <div className="noi-bo-dashboard-table-section">
      {taoTieuDeKhoi({
        kicker: 'Theo dõi phục vụ',
        title: 'Đơn đang xử lý',
        count: danhSachDonHang.length,
        noun: 'đơn',
      })}
      {bangDonHang}
    </div>
  )

  if (loading) {
    return (
      <Row className="noi-bo-dashboard-secondary-grid" gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card className="noi-bo-dashboard-card noi-bo-dashboard-table-card" loading />
        </Col>
        <Col xs={24} xl={12}>
          <Card className="noi-bo-dashboard-card noi-bo-dashboard-table-card" loading />
        </Col>
      </Row>
    )
  }

  return (
    <>
      <div className="noi-bo-dashboard-mobile-only">
        <Card className="noi-bo-dashboard-card noi-bo-dashboard-table-card" styles={{ body: { padding: '12px 14px' } }}>
          <Tabs
            items={[
              {
                key: 'bookings',
                label: `Booking (${dinhDangSoNguyen(danhSachBooking.length)})`,
                children: khoiDatBan,
              },
              {
                key: 'orders',
                label: `Đơn hàng (${dinhDangSoNguyen(danhSachDonHang.length)})`,
                children: khoiDonHang,
              },
            ]}
          />
        </Card>
      </div>

      <div className="noi-bo-dashboard-desktop-only">
        <Row className="noi-bo-dashboard-secondary-grid" gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card className="noi-bo-dashboard-card noi-bo-dashboard-table-card" styles={{ body: { padding: '12px 14px' } }}>
              {khoiDatBan}
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card className="noi-bo-dashboard-card noi-bo-dashboard-table-card" styles={{ body: { padding: '12px 14px' } }}>
              {khoiDonHang}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default DatBanVaDonHang
