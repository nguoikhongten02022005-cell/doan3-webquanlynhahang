import { useMemo } from 'react'
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

function BieuDoDoanhThu({ revenue, dateRange, title = 'Doanh thu 7 ngày gần nhất', loading = false }) {
  const khoangThoiGian = dateRange || revenue?.dateRange

  const fullSeries = useMemo(() => {
    if (!khoangThoiGian?.tuNgay || !khoangThoiGian?.denNgay) return []

    const start = new Date(khoangThoiGian.tuNgay)
    const end = new Date(khoangThoiGian.denNgay)
    const series = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      series.push({ label: label, date: dateStr, revenue: 0, completedOrders: 0 });
    }

    return series;
  }, [khoangThoiGian]);

  const duLieuCot = useMemo(() => {
    if (!Array.isArray(revenue?.series)) return fullSeries;

    const map = new Map(fullSeries.map(item => [item.label, { ...item }]));

    revenue.series.forEach(apiItem => {
      if (map.has(apiItem.label)) {
        const existing = map.get(apiItem.label);
        map.set(apiItem.label, {
          ...existing,
          revenue: Math.max(Number(apiItem.revenue) || 0, 0),
          completedOrders: Number(apiItem.completedOrders) || 0,
        });
      }
    });

    return Array.from(map.values());
  }, [revenue?.series, fullSeries]);
  const tongDoanhThu = Number(revenue?.summary?.revenue) || 0
  const soCotCoDoanhThu = duLieuCot.filter((mucDoanhThu) => mucDoanhThu.revenue > 0).length
  const mucDoanhThuCaoNhat = duLieuCot.reduce(
    (ketQua, mucDoanhThu) => (mucDoanhThu.revenue > ketQua.revenue ? mucDoanhThu : ketQua),
    { label: '--', revenue: 0 },
  )
  const doanhThuTrungBinh = soCotCoDoanhThu > 0 ? Math.round(tongDoanhThu / soCotCoDoanhThu) : 0
  const doanhThuCaoNhat = mucDoanhThuCaoNhat.revenue
  const coDuLieuBieuDo = duLieuCot.length > 0
  const lamTronMocTrucY = (giaTri) => {
    if (giaTri <= 0) return 1
    const buoc = giaTri < 1000000 ? 100000 : 500000
    return Math.ceil(giaTri / buoc) * buoc
  }

  const gioiHanTrucY = doanhThuCaoNhat > 0
    ? lamTronMocTrucY(doanhThuCaoNhat * 1.15)
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
    columnWidthRatio: soCotCoDoanhThu <= 1 ? 0.36 : 0.6,
    marginTop: 20,
    paddingRight: 12,
    label: {
      position: 'top',
      text: (datum) => (Number(datum.revenue) > 0 ? dinhDangTienRutGon(datum.revenue) : ''),
      dy: -10,
      style: {
        fill: '#44403C',
        fontSize: 12,
        fontWeight: 700,
        textAlign: 'center',
        lineWidth: 2,
        stroke: '#FFFFFF',
      },
    },
    state: {
      active: { style: { fill: '#D84F33' } },
    },
    interaction: {
      tooltip: {
        style: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E7E5E4',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          borderRadius: 12,
        },
      },
    },
    theme: {
      axis: {
        labelFill: '#57534E',
        labelFontSize: 12,
        lineLineWidth: 1,
        lineStroke: '#D6D3D1',
        gridLineDash: [4, 4],
        gridStroke: '#E7E5E4',
      },
    },
    axis: {
      x: {
        labelFontSize: 12,
        labelFill: '#57534E',
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
        labelFontSize: 13,
        labelFill: '#57534E',
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
        (datum) => (datum.completedOrders !== undefined ? {
          name: 'Số đơn',
          value: Number(datum.completedOrders) || 0,
        } : null),
      ].filter(Boolean),
    },
    style: {
      radiusTopLeft: 12,
      radiusTopRight: 12,
      fill: '#E8664A',
    },
  }

  return (
    <Card className="noi-bo-dashboard-card noi-bo-dashboard-chart-card" title={title} extra={extra} styles={{ body: { padding: '16px 16px 14px' } }}>
      <Column {...cauHinhBieuDo} height={290} />
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
          <strong>{dinhDangTienTe(doanhThuTrungBinh)}</strong>
          <small>{soCotCoDoanhThu === 1 ? 'Chỉ có 1 ngày phát sinh doanh thu' : 'Giữ nhịp quan sát ổn định'}</small>
        </div>
      </div>
    </Card>
  )
}

export default BieuDoDoanhThu
