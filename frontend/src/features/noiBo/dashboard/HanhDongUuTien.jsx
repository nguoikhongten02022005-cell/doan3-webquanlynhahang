import { Card, Col, Row, Space, Typography } from 'antd'

const KIEU_MAU_MUC_UU_TIEN = {
  danger: { background: '#fff8f6', borderColor: '#ffe1d6' },
  warning: { background: '#fffaf2', borderColor: '#ffedc2' },
  success: { background: '#f7fcf5', borderColor: '#ddf3d2' },
  neutral: { background: '#fcfcfc', borderColor: '#f2f2f2' },
}

function HanhDongUuTien({ urgentTasks }) {
  return (
    <Card className="noi-bo-dashboard-card" title="Cần xử lý ngay" styles={{ body: { padding: '10px 14px' } }}>
      <Row gutter={[12, 12]}>
        {(urgentTasks || []).map((mucUuTien) => (
          <Col key={mucUuTien.key} xs={24} sm={12} xl={6}>
            <Card size="small" styles={{ body: { minHeight: 104, padding: 10 } }} style={KIEU_MAU_MUC_UU_TIEN[mucUuTien.tone] || KIEU_MAU_MUC_UU_TIEN.neutral}>
              <Space size={2} style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography.Text type="secondary">{mucUuTien.title}</Typography.Text>
                <Typography.Title level={3} style={{ margin: 0 }}>{mucUuTien.value}</Typography.Title>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default HanhDongUuTien
