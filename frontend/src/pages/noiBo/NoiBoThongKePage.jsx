import { useMemo, useState } from 'react'
import { Card, Col, Row, Segmented, Space, Statistic, Table, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import BieuDoDoanhThu from '../../features/noiBo/dashboard/BieuDoDoanhThu'
import { NOI_BO_THONG_KE_KHOANG_THOI_GIAN } from '../../features/noiBo/thongKeNoiBo'
import { dinhDangTienTe } from '../../utils/tienTe'
import { layDoanhThuNgayApi, layMonBanChayApi, layDoanhThuThangApi } from '../../services/api/apiThongKe'

const tinhKhoangThoiGian = (timeRange) => {
  const homNay = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const formatNgay = (date) => 
    `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`
  
  const denNgay = formatNgay(homNay)

  if (timeRange === 'today') {
    return { tuNgay: denNgay, denNgay }
  }
  if (timeRange === 'last7Days') {
    const tuNgay = new Date(homNay)
    tuNgay.setDate(tuNgay.getDate() - 6)
    return { tuNgay: formatNgay(tuNgay), denNgay }
  }
  if (timeRange === 'last30Days') {
    const tuNgay = new Date(homNay)
    tuNgay.setDate(tuNgay.getDate() - 29)
    return { tuNgay: formatNgay(tuNgay), denNgay }
  }
  if (timeRange === 'thisMonth') {
    const tuNgay = new Date(homNay.getFullYear(), homNay.getMonth(), 1)
    return { tuNgay: formatNgay(tuNgay), denNgay }
  }
  return { tuNgay: denNgay, denNgay }
}

const taoChuoiDoanhThu = (danhSach) => (danhSach || []).map((muc) => ({
  label: muc.Ngay ? new Date(muc.Ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '--',
  revenue: Number(muc.DoanhThu || 0),
  completedOrders: Number(muc.SoHoaDon || 0),
}))

function NoiBoThongKePage() {
  const [timeRange, setTimeRange] = useState('last7Days')
  const { tuNgay, denNgay } = tinhKhoangThoiGian(timeRange)

  const { data: duLieuDoanhThu = [], isLoading: dangTaiDoanhThu } = useQuery({
    queryKey: ['thong-ke-doanh-thu-trang', tuNgay, denNgay],
    queryFn: async () => {
      const ketQua = await layDoanhThuNgayApi(tuNgay, denNgay)
      return ketQua.duLieu || []
    },
  })

  const { data: duLieuMonBanChay = [], isLoading: dangTaiMonBanChay } = useQuery({
    queryKey: ['thong-ke-mon-ban-chay'],
    queryFn: async () => {
      const ketQua = await layMonBanChayApi(10)
      return ketQua.duLieu || []
    },
  })

  const revenueSeries = useMemo(() => taoChuoiDoanhThu(duLieuDoanhThu), [duLieuDoanhThu])

  const tongDoanhThu = useMemo(
    () => duLieuDoanhThu.reduce((tong, muc) => tong + Number(muc.DoanhThu || 0), 0),
    [duLieuDoanhThu],
  )

  const soDonHoanThanh = useMemo(
    () => duLieuDoanhThu.reduce((tong, muc) => tong + Number(muc.SoHoaDon || 0), 0),
    [duLieuDoanhThu],
  )

  const giaTriTrungBinh = soDonHoanThanh > 0 ? Math.round(tongDoanhThu / soDonHoanThanh) : 0

  const topDishes = useMemo(
    () => (duLieuMonBanChay || []).slice(0, 10).map((mon, chiSo) => ({
      ...mon,
      rank: chiSo + 1,
      name: mon.TenMon || mon.tenMon || '',
      quantity: Number(mon.SoLuongDaBan || mon.soLuongDaBan || 0),
      revenue: Number(mon.DoanhThu || mon.doanhThu || 0),
      percent: duLieuMonBanChay.length > 0
        ? Math.round((Number(mon.DoanhThu || 0) / duLieuMonBanChay.reduce((t, m) => t + Number(m.DoanhThu || 0), 0)) * 100)
        : 0,
    })),
    [duLieuMonBanChay],
  )

  const topDishColumns = [
    { title: 'STT', dataIndex: 'rank', key: 'rank', width: 70 },
    { title: 'Tên món', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: 110 },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', width: 160, render: (value) => dinhDangTienTe(value) },
  ]

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Card title="Bộ lọc thời gian">
        <Segmented options={NOI_BO_THONG_KE_KHOANG_THOI_GIAN.map((option) => ({ label: option.label, value: option.key }))} value={timeRange} onChange={setTimeRange} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tổng doanh thu kỳ" value={tongDoanhThu} formatter={(value) => dinhDangTienTe(Number(value) || 0)} loading={dangTaiDoanhThu} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Số đơn hoàn thành" value={soDonHoanThanh} loading={dangTaiDoanhThu} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Giá trị đơn trung bình" value={giaTriTrungBinh} formatter={(value) => dinhDangTienTe(Number(value) || 0)} loading={dangTaiDoanhThu} /></Card></Col>
        <Col xs={24} md={12} xl={6}><Card><Statistic title="Tổng booking kỳ" value="--" loading={dangTaiDoanhThu} /></Card></Col>
      </Row>

      <BieuDoDoanhThu title="Doanh thu 7 ngày gần nhất" revenue={{ summary: { revenue: tongDoanhThu }, series: revenueSeries }} loading={dangTaiDoanhThu} />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={24}>
          <Card title="Món bán chạy">
            <Table rowKey="rank" pagination={false} columns={topDishColumns} dataSource={topDishes} loading={dangTaiMonBanChay} scroll={{ x: 640 }} />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default NoiBoThongKePage