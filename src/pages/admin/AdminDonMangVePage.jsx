import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Row, Segmented, Space, Statistic, Table, Tag, Typography } from 'antd'
import { ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { dinhDangTienTeVietNam } from '../../utils/tienTe'
import { capNhatTrangThaiDonMangVeApi, layDanhSachDonMangVeChoAdminApi } from '../../services/api/apiMangVe'

const BO_LOC = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Pickup', value: 'MANG_VE_PICKUP' },
  { label: 'Giao hàng', value: 'MANG_VE_GIAO_HANG' },
  { label: 'Chờ xác nhận', value: 'Pending' },
  { label: 'Đang xử lý', value: 'PROCESSING' },
  { label: 'Hoàn thành', value: 'Paid' },
  { label: 'Đã hủy', value: 'Cancelled' },
]

const NHAN = {
  Pending: { label: 'Chờ xác nhận', color: 'gold' },
  Confirmed: { label: 'Đã xác nhận', color: 'blue' },
  Preparing: { label: 'Đang chuẩn bị', color: 'orange' },
  Ready: { label: 'Sẵn sàng lấy', color: 'green' },
  Served: { label: 'Đang giao', color: 'cyan' },
  Paid: { label: 'Hoàn thành', color: 'success' },
  Cancelled: { label: 'Đã hủy', color: 'red' },
}

function AdminDonMangVePage() {
  const [danhSachDon, setDanhSachDon] = useState([])
  const [dangTai, setDangTai] = useState(true)
  const [boLoc, setBoLoc] = useState('ALL')
  const [dangXuLy, setDangXuLy] = useState('')

  const taiLai = async () => {
    setDangTai(true)
    try {
      const { duLieu } = await layDanhSachDonMangVeChoAdminApi()
      setDanhSachDon(Array.isArray(duLieu) ? duLieu : [])
    } finally {
      setDangTai(false)
    }
  }

  useEffect(() => { taiLai() }, [])

  const danhSachHienThi = useMemo(() => {
    if (boLoc === 'ALL') return danhSachDon
    if (boLoc === 'MANG_VE_PICKUP' || boLoc === 'MANG_VE_GIAO_HANG') return danhSachDon.filter((don) => don.loaiDon === boLoc)
    if (boLoc === 'PROCESSING') return danhSachDon.filter((don) => ['Pending', 'Confirmed', 'Preparing'].includes(don.trangThai))
    return danhSachDon.filter((don) => don.trangThai === boLoc)
  }, [boLoc, danhSachDon])

  const thongKe = useMemo(() => {
    const homNay = new Date().toLocaleDateString('en-CA')
    const donHomNay = danhSachDon.filter((don) => String(don.ngayTao || '').slice(0, 10) === homNay)
    return {
      tongDonHomNay: donHomNay.length,
      dangXuLy: danhSachDon.filter((don) => ['Pending', 'Confirmed', 'Preparing'].includes(don.trangThai)).length,
      doanhThuHomNay: donHomNay.filter((don) => don.trangThai === 'Paid').reduce((tong, don) => tong + don.tongTien, 0),
    }
  }, [danhSachDon])

  const capNhatTrangThai = async (maDonHang, trangThai) => {
    try {
      setDangXuLy(`${maDonHang}-${trangThai}`)
      await capNhatTrangThaiDonMangVeApi(maDonHang, trangThai)
      await taiLai()
    } finally {
      setDangXuLy('')
    }
  }

  const cot = [
    { title: 'Mã đơn', dataIndex: 'maDonHang', key: 'maDonHang', render: (value) => <Typography.Text strong>{value}</Typography.Text> },
    { title: 'Loại', dataIndex: 'loaiDon', key: 'loaiDon', render: (value) => <Tag color={value === 'MANG_VE_GIAO_HANG' ? 'cyan' : 'orange'}>{value === 'MANG_VE_GIAO_HANG' ? 'Giao hàng' : 'Pickup'}</Tag> },
    { title: 'Khách', dataIndex: 'hoTen', key: 'hoTen', render: (_, row) => row.hoTen || row.maKH },
    { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai', render: (value) => value || '---' },
    { title: 'Địa chỉ', dataIndex: 'diaChiGiao', key: 'diaChiGiao', render: (value) => value || '---' },
    { title: 'Giờ nhận', key: 'gio', render: (_, row) => row.gioGiao || row.gioLayHang || '---' },
    { title: 'Món', dataIndex: 'danhSachMon', key: 'danhSachMon', render: (value) => value.map((muc) => `${muc.tenMon} x${muc.soLuong}`).join(', ') },
    { title: 'Tổng tiền', dataIndex: 'tongTien', key: 'tongTien', render: (value) => dinhDangTienTeVietNam(value) },
    { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', render: (value) => <Tag color={NHAN[value]?.color || 'default'}>{NHAN[value]?.label || value}</Tag> },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, don) => {
        if (don.trangThai === 'Pending') {
          return <Space><Button type="primary" loading={dangXuLy === `${don.maDonHang}-Confirmed`} onClick={() => capNhatTrangThai(don.maDonHang, 'Confirmed')}>Xác nhận</Button><Button danger loading={dangXuLy === `${don.maDonHang}-Cancelled`} onClick={() => capNhatTrangThai(don.maDonHang, 'Cancelled')}>Hủy</Button></Space>
        }
        if (don.trangThai === 'Confirmed') return <Button type="primary" onClick={() => capNhatTrangThai(don.maDonHang, 'Preparing')}>Đang chuẩn bị</Button>
        if (don.trangThai === 'Preparing') return <Button type="primary" onClick={() => capNhatTrangThai(don.maDonHang, don.loaiDon === 'MANG_VE_GIAO_HANG' ? 'Served' : 'Ready')}>{don.loaiDon === 'MANG_VE_GIAO_HANG' ? 'Đang giao' : 'Sẵn sàng lấy'}</Button>
        if (don.trangThai === 'Ready' || don.trangThai === 'Served') return <Button type="primary" onClick={() => capNhatTrangThai(don.maDonHang, 'Paid')}>Hoàn thành</Button>
        return <Typography.Text type="secondary">Không có</Typography.Text>
      },
    },
  ]

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}><Card><Statistic title="Tổng đơn hôm nay" value={thongKe.tongDonHomNay} prefix={<ShoppingOutlined />} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Đang xử lý" value={thongKe.dangXuLy} valueStyle={{ color: '#d97706' }} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Doanh thu hôm nay" value={thongKe.doanhThuHomNay} formatter={(value) => dinhDangTienTeVietNam(Number(value) || 0)} valueStyle={{ color: '#059669' }} prefix={<CheckCircleOutlined />} /></Card></Col>
      </Row>

      <Card title="Đơn mang về">
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Segmented options={BO_LOC} value={boLoc} onChange={setBoLoc} />
          <Table rowKey="maDonHang" loading={dangTai} columns={cot} dataSource={danhSachHienThi} scroll={{ x: 1200 }} pagination={{ pageSize: 8 }} />
        </Space>
      </Card>
    </Space>
  )
}

export default AdminDonMangVePage
