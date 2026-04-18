import { useMemo, useState } from 'react'
import { Card, Col, Row, Segmented, Space, Statistic, Table, Typography } from 'antd'
import BieuDoDoanhThu from '../../features/noiBo/dashboard/BieuDoDoanhThu'
import { NOI_BO_THONG_KE_KHOANG_THOI_GIAN, taoDuLieuThongKeDoanhThu } from '../../features/noiBo/thongKeNoiBo'
import { dinhDangTienTe } from '../../utils/tienTe'
import { useOutletContext } from 'react-router-dom'

function NoiBoThongKePage() {
  const { danhSachDonHang, danhSachDatBan } = useOutletContext()
  const [timeRange, setTimeRange] = useState('today')

  const revenueStats = useMemo(
    () => taoDuLieuThongKeDoanhThu({ orders: danhSachDonHang, bookings: danhSachDatBan, timeRange }),
    [danhSachDatBan, danhSachDonHang, timeRange],
  )

  const topDishColumns = [
    { title: 'STT', dataIndex: 'rank', key: 'rank', width: 70 },
    { title: 'Tên món', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: 110 },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', width: 160, render: (value) => dinhDangTienTe(value) },
    { title: '% tổng', dataIndex: 'percent', key: 'percent', width: 100, render: (value) => `${value}%` },
  ]

  const categoryColumns = [
    { title: 'Danh mục', dataIndex: 'category', key: 'category' },
    { title: 'Tỷ trọng', dataIndex: 'percent', key: 'percent', width: 120, render: (value) => `${value}%` },
  ]

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Card title="Bộ lọc thời gian">
        <Segmented options={NOI_BO_THONG_KE_KHOANG_THOI_GIAN.map((option) => ({ label: option.label, value: option.key }))} value={timeRange} onChange={setTimeRange} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tổng doanh thu kỳ" value={revenueStats.overview.revenue} formatter={(value) => dinhDangTienTe(Number(value) || 0)} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Số đơn hoàn thành" value={revenueStats.overview.completedOrders} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Giá trị đơn trung bình" value={revenueStats.overview.averageOrder} formatter={(value) => dinhDangTienTe(Number(value) || 0)} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tổng booking kỳ" value={revenueStats.overview.totalBookings} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tổng booking" value={revenueStats.bookingStats.total} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Đã hoàn thành" value={revenueStats.bookingStats.completed} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Đã hủy" value={revenueStats.bookingStats.cancelled} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tỉ lệ hủy" value={revenueStats.bookingStats.cancellationRate} suffix="%" /></Card></Col>
      </Row>

      <BieuDoDoanhThu title="Doanh thu 7 ngày gần nhất" revenue={{ summary: revenueStats.overview, series: revenueStats.revenueSeries }} />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card title="Món bán chạy">
            <Table rowKey="id" pagination={false} columns={topDishColumns} dataSource={revenueStats.topDishes} scroll={{ x: 640 }} />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card title="Phân bổ theo nhóm món">
            <Table rowKey="category" pagination={false} columns={categoryColumns} dataSource={revenueStats.categoryShares} />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default NoiBoThongKePage
