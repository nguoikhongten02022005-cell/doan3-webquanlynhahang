import { Card, Space, Typography } from 'antd'
import { Column } from '@ant-design/plots'
import { dinhDangTienTe } from '../../../utils/tienTe'
import DashboardEmptyState from './DashboardEmptyState'

const DANH_SACH_DON_VI_RUT_GON = [
  { value: 1000000, suffix: 'tr' },
  { value: 1000, suffix: 'k' },
]

const dinhDangTienRutGon = (value) => {
  const amount = Number(value) || 0
  const absolute = Math.abs(amount)
  const prefix = amount < 0 ? '-' : ''

  if (absolute === 0) {
    return '0đ'
  }

  const donVi = DANH_SACH_DON_VI_RUT_GON.find((item) => absolute >= item.value)

  if (!donVi) {
    return `${prefix}${absolute.toLocaleString('vi-VN')}đ`
  }

  const giaTriRutGon = absolute / donVi.value
  const giaTriLamTron = giaTriRutGon >= 10
    ? Math.round(giaTriRutGon)
    : Math.round(giaTriRutGon * 10) / 10

  const chuoiGiaTri = Number.isInteger(giaTriLamTron)
    ? String(giaTriLamTron)
    : giaTriLamTron.toFixed(1).replace(/\.0$/, '')

  return `${prefix}${chuoiGiaTri}${donVi.suffix}`
}

function BieuDoDoanhThu({ revenue, title = 'Doanh thu 7 ngày gần nhất' }) {
  const duLieuCot = Array.isArray(revenue?.series)
    ? revenue.series.map((mucDoanhThu) => ({
        ...mucDoanhThu,
        revenue: Math.max(Number(mucDoanhThu?.revenue) || 0, 0),
      }))
    : []
  const tongDoanhThu = Number(revenue?.summary?.revenue) || 0
  const coDuLieuBieuDo = duLieuCot.length > 0 && duLieuCot.some((mucDoanhThu) => mucDoanhThu.revenue > 0)

  const extra = (
    <Space direction="vertical" size={0} align="end" className="noi-bo-dashboard-card__extra-metric">
      <Typography.Text>Tổng 7 ngày</Typography.Text>
      <Typography.Text strong>{dinhDangTienTe(tongDoanhThu)}</Typography.Text>
    </Space>
  )

  if (!coDuLieuBieuDo) {
    return (
      <Card className="noi-bo-dashboard-card noi-bo-dashboard-chart-card" title={title} extra={extra} styles={{ body: { padding: '16px 16px 12px' } }}>
        <DashboardEmptyState title="Chưa có doanh thu trong 7 ngày gần nhất" description="Doanh thu sẽ hiển thị khi có đơn hoàn tất." />
      </Card>
    )
  }

  const cauHinhBieuDo = {
    data: duLieuCot,
    xField: 'label',
    yField: 'revenue',
    color: '#E8664A',
    columnWidthRatio: 0.5,
    marginTop: 28,
    paddingRight: 8,
    label: {
      position: 'top',
      text: (datum) => (Number(datum.revenue) > 0 ? dinhDangTienRutGon(datum.revenue) : ''),
      style: {
        fill: '#57534E',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
      },
    },
    axis: {
      x: {
        labelFontSize: 12,
        labelFill: '#78716C',
        line: false,
        tick: false,
      },
      y: {
        labelFormatter: (value) => dinhDangTienRutGon(Number(value)),
        labelFontSize: 12,
        labelFill: '#78716C',
        grid: true,
      },
    },
    scale: {
      y: {
        domainMin: 0,
        nice: true,
      },
    },
    tooltip: {
      title: 'label',
      items: [
        (datum) => ({
          name: 'Doanh thu',
          value: dinhDangTienTe(datum.revenue),
        }),
      ],
    },
    style: {
      radiusTopLeft: 12,
      radiusTopRight: 12,
      fill: '#E8664A',
    },
  }

  return (
    <Card className="noi-bo-dashboard-card noi-bo-dashboard-chart-card" title={title} extra={extra} styles={{ body: { padding: '16px 16px 12px' } }}>
      <Column {...cauHinhBieuDo} height={220} />
    </Card>
  )
}

export default BieuDoDoanhThu
