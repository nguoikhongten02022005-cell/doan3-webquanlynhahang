import { Col, Flex, Grid, Row, Space, Typography } from 'antd'
import { useOutletContext } from 'react-router-dom'
import DatBanVaDonHang from '../../features/noiBo/dashboard/DatBanVaDonHang'
import BieuDoDoanhThu from '../../features/noiBo/dashboard/BieuDoDoanhThu'
import TheThongKe from '../../features/noiBo/dashboard/TheThongKe'
import ApLucBanAn from '../../features/noiBo/dashboard/ApLucBanAn'
import HanhDongUuTien from '../../features/noiBo/dashboard/HanhDongUuTien'

const { useBreakpoint } = Grid

function NoiBoDashboardPage() {
  const {
    bangDieuKhienData,
    dangTaiDuLieu,
    daTaiDuLieuLanDau,
  } = useOutletContext()
  const manHinh = useBreakpoint()
  const laMobile = manHinh.xs && !manHinh.md
  const khoangCach = laMobile ? 14 : manHinh.xxl ? 20 : 18
  const dangTaiKhoiTaoDashboard = dangTaiDuLieu && !daTaiDuLieuLanDau

  return (
    <Flex vertical gap={khoangCach} style={{ width: '100%' }} className="noi-bo-dashboard-page">
      <Space orientation="vertical" size={4} style={{ width: '100%' }} className="noi-bo-dashboard-page__heading">
        <Typography.Title level={laMobile ? 4 : 3} style={{ margin: 0 }}>
          Bảng điều khiển nhà hàng hôm nay
        </Typography.Title>
        <Typography.Text type="secondary" className="noi-bo-dashboard-subtitle">
          Theo dõi doanh thu, mật độ sử dụng bàn và các đầu việc ưu tiên trong cùng một màn hình.
        </Typography.Text>
      </Space>

      <TheThongKe stats={bangDieuKhienData?.stats} loading={dangTaiKhoiTaoDashboard} />

      <Row className="noi-bo-dashboard-primary-grid" gutter={[khoangCach, khoangCach]} align="stretch">
        <Col xs={24} xl={16}>
          <BieuDoDoanhThu revenue={bangDieuKhienData?.revenue} loading={dangTaiKhoiTaoDashboard} />
        </Col>
        <Col xs={24} xl={8}>
          <ApLucBanAn tablePressure={bangDieuKhienData?.tablePressure} loading={dangTaiKhoiTaoDashboard} />
        </Col>
      </Row>

      <HanhDongUuTien urgentTasks={bangDieuKhienData?.urgentTasks} loading={dangTaiKhoiTaoDashboard} />

      <DatBanVaDonHang
        bookings={bangDieuKhienData?.bookings}
        orders={bangDieuKhienData?.orders}
        loading={dangTaiKhoiTaoDashboard}
      />
    </Flex>
  )
}

export default NoiBoDashboardPage
