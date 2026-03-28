import { Card, Col, Row, Space, Typography } from 'antd'

const TONE_STYLES = {
  danger: { background: '#fff8f6', borderColor: '#ffe1d6' },
  warning: { background: '#fffaf2', borderColor: '#ffedc2' },
  success: { background: '#f7fcf5', borderColor: '#ddf3d2' },
  neutral: { background: '#fcfcfc', borderColor: '#f2f2f2' },
}

function UrgentActions({ urgentTasks }) {
  return (
    <Card className="admin-dashboard-card" title="Cần xử lý ngay" styles={{ body: { padding: '10px 14px' } }}>
      <Row gutter={[12, 12]}>
        {(urgentTasks || []).map((item) => (
          <Col key={item.key} xs={24} sm={12} xl={6}>
            <Card size="small" styles={{ body: { minHeight: 104, padding: 10 } }} style={TONE_STYLES[item.tone] || TONE_STYLES.neutral}>
              <Space size={2} style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography.Text type="secondary">{item.title}</Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>{item.value}</Typography.Title>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default UrgentActions
