import { Card } from 'antd'
import { Column } from '@ant-design/plots'
import { dinhDangTienTe } from '../../../utils/tienTe'

function RevenueChart({ revenue }) {
  const data = revenue?.series || []

  const config = {
    data,
    xField: 'label',
    yField: 'revenue',
    color: '#E8664A',
    columnWidthRatio: 0.56,
    label: {
      position: 'top',
      text: (datum) => `${Math.round((Number(datum.revenue) || 0) / 1000000 * 10) / 10}tr`,
      style: {
        fill: '#78716C',
        fontSize: 12,
      },
    },
    axis: {
      y: {
        labelFormatter: (value) => `${Number(value) / 1000000}tr`,
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
  }

  return (
    <Card className="admin-dashboard-card" title="Doanh thu 7 ngày gần nhất" extra={dinhDangTienTe(revenue?.summary?.revenue || 0)} styles={{ body: { padding: '10px 14px' } }}>
      <Column {...config} height={232} />
    </Card>
  )
}

export default RevenueChart
