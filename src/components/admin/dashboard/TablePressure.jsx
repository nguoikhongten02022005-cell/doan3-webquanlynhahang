import { Card, Progress, Space, Tooltip, Typography } from 'antd'

const layMauTheoTai = (percent) => {
  if (percent > 80) return '#ff4d4f'
  if (percent >= 50) return '#fa8c16'
  return '#52c41a'
}

function TablePressure({ tablePressure }) {
  return (
    <Card className="admin-dashboard-card" title="Áp lực bàn ăn" styles={{ body: { padding: '10px 14px' } }}>
      <Space size={10} style={{ width: '100%', flexDirection: 'column', alignItems: 'stretch' }}>
        {(tablePressure || []).map((area) => (
          <div key={area.id}>
            <div className="admin-dashboard-pressure__head">
              <Typography.Text strong>{area.name}</Typography.Text>
            </div>
            <Tooltip title={`${area.busyTables}/${area.total} bàn bận · ${area.available} trống · ${area.held} giữ chỗ · ${area.dirty} cần dọn`}>
              <Progress percent={area.percent} strokeColor={layMauTheoTai(area.percent)} size={{ height: 10 }} showInfo={false} />
            </Tooltip>
          </div>
        ))}
      </Space>
    </Card>
  )
}

export default TablePressure
