import { Card, Typography } from 'antd'
import { Column } from '@ant-design/plots'
import { dinhDangTienTe } from '../../../utils/tienTe'
import DashboardEmptyState from './DashboardEmptyState'

const DANH_SACH_DON_VI_RUT_GON = [
  { value: 1000000000, suffix: 'tỷ' },
  { value: 1000000, suffix: 'tr' },
  { value: 1000, suffix: 'k' },
]

const dinhDangSo = (value, maximumFractionDigits = 1) => new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits,
}).format(value)

const taoChuoiTienRutGon = (absolute, unitIndex) => {
  const donVi = DANH_SACH_DON_VI_RUT_GON[unitIndex]

  if (!donVi) {
    return `${dinhDangSo(absolute, 0)}đ`
  }

  const giaTriRutGon = absolute / donVi.value
  const giaTriLamTron = giaTriRutGon >= 10
    ? Math.round(giaTriRutGon)
    : Math.round(giaTriRutGon * 10) / 10

  if (giaTriLamTron >= 1000 && unitIndex > 0) {
    return taoChuoiTienRutGon(absolute, unitIndex - 1)
  }

  const chuoiGiaTri = Number.isInteger(giaTriLamTron)
    ? dinhDangSo(giaTriLamTron, 0)
    : dinhDangSo(giaTriLamTron, 1)

  return `${chuoiGiaTri}${donVi.suffix}`
}

const dinhDangTienRutGon = (value) => {
  const amount = Number(value) || 0
  const absolute = Math.abs(amount)
  const prefix = amount < 0 ? '-' : ''

  if (absolute === 0) {
    return '0đ'
  }

  const unitIndex = DANH_SACH_DON_VI_RUT_GON.findIndex((item) => absolute >= item.value)

  if (unitIndex === -1) {
    return `${prefix}${dinhDangSo(absolute, 0)}đ`
  }

  return `${prefix}${taoChuoiTienRutGon(absolute, unitIndex)}`
}

function BieuDoDoanhThu({ revenue, title = 'Doanh thu 7 ngày gần nhất', loading = false }) {
  const duLieuCot = Array.isArray(revenue?.series)
    ? revenue.series.map((mucDoanhThu) => ({
        ...mucDoanhThu,
        revenue: Math.max(Number(mucDoanhThu?.revenue) || 0, 0),
      }))
    : []
  const tongDoanhThu = Number(revenue?.summary?.revenue) || 0
  const soCotCoDoanhThu = duLieuCot.filter((mucDoanhThu) => mucDoanhThu.revenue > 0).length
  const mucDoanhThuCaoNhat = duLieuCot.reduce(
    (ketQua, mucDoanhThu) => (mucDoanhThu.revenue > ketQua.revenue ? mucDoanhThu : ketQua),
    { label: '--', revenue: 0 },
  )
  const doanhThuTrungBinh = soCotCoDoanhThu > 0 ? Math.round(tongDoanhThu / soCotCoDoanhThu) : 0
  const doanhThuCaoNhat = mucDoanhThuCaoNhat.revenue
  const coDuLieuBieuDo = duLieuCot.length > 0 && doanhThuCaoNhat > 0
  const nenHienLabelCot = soCotCoDoanhThu > 0 && soCotCoDoanhThu <= 4
  const gioiHanTrucY = doanhThuCaoNhat > 0
    ? Math.max(doanhThuCaoNhat * (nenHienLabelCot ? 1.28 : 1.15), doanhThuCaoNhat + 1)
    : 1

  const extra = (
    <div className="noi-bo-dashboard-card__extra-metric">
      <Typography.Text>Tổng 7 ngày</Typography.Text>
      <Typography.Text strong>{dinhDangTienTe(tongDoanhThu)}</Typography.Text>
    </div>
  )

  if (loading) {
    return (
      <Card
        className="noi-bo-dashboard-card noi-bo-dashboard-chart-card"
        title={title}
        extra={extra}
        loading
        styles={{ body: { padding: '16px 16px 14px' } }}
      />
    )
  }

  if (!coDuLieuBieuDo) {
    return (
      <Card className="noi-bo-dashboard-card noi-bo-dashboard-chart-card" title={title} extra={extra} styles={{ body: { padding: '16px 16px 14px' } }}>
        <DashboardEmptyState title="Chưa có doanh thu trong 7 ngày gần nhất" description="Doanh thu sẽ hiển thị khi có đơn hoàn tất." />
      </Card>
    )
  }

  const cauHinhBieuDo = {
    data: duLieuCot,
    xField: 'label',
    yField: 'revenue',
    color: ({ revenue: doanhThuNgay }) => (Number(doanhThuNgay) > 0 ? '#E8664A' : '#E9D8CF'),
    columnWidthRatio: soCotCoDoanhThu <= 1 ? 0.28 : 0.5,
    marginTop: nenHienLabelCot ? 30 : 20,
    paddingRight: 10,
    label: nenHienLabelCot
      ? {
          position: 'top',
          text: (datum) => (Number(datum.revenue) > 0 ? dinhDangTienRutGon(datum.revenue) : ''),
          dy: -4,
          style: {
            fill: '#57534E',
            fontSize: 11,
            fontWeight: 700,
            textAlign: 'center',
          },
        }
      : false,
    axis: {
      x: {
        labelFontSize: 12,
        labelFill: '#78716C',
        line: false,
        tick: false,
        transform: [
          {
            type: 'rotate',
            optionalAngles: [0, 45, 90],
            recoverWhenFailed: true,
          },
        ],
      },
      y: {
        labelFormatter: (value) => dinhDangTienRutGon(Number(value)),
        labelFontSize: 12,
        labelFill: '#78716C',
        tickCount: 4,
        grid: true,
      },
    },
    scale: {
      y: {
        domainMin: 0,
        domainMax: gioiHanTrucY,
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
    <Card className="noi-bo-dashboard-card noi-bo-dashboard-chart-card" title={title} extra={extra} styles={{ body: { padding: '16px 16px 14px' } }}>
      <Column {...cauHinhBieuDo} height={220} />
      <div className="noi-bo-dashboard-chart-card__footer">
        <div className="noi-bo-dashboard-chart-card__metric">
          <span>Ngày cao nhất</span>
          <strong>{mucDoanhThuCaoNhat.label}</strong>
          <small>{dinhDangTienTe(doanhThuCaoNhat)}</small>
        </div>
        <div className="noi-bo-dashboard-chart-card__metric">
          <span>Ngày có doanh thu</span>
          <strong>{soCotCoDoanhThu.toLocaleString('vi-VN')}</strong>
          <small>trên {duLieuCot.length.toLocaleString('vi-VN')} ngày</small>
        </div>
        <div className="noi-bo-dashboard-chart-card__metric">
          <span>Trung bình/ngày có đơn</span>
          <strong>{dinhDangTienRutGon(doanhThuTrungBinh)}</strong>
          <small>{soCotCoDoanhThu === 1 ? 'Chỉ có 1 ngày phát sinh doanh thu' : 'Giữ nhịp quan sát ổn định'}</small>
        </div>
      </div>
    </Card>
  )
}

export default BieuDoDoanhThu
