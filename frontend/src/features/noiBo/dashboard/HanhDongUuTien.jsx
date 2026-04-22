import { Card, Col, Row, Space, Typography } from 'antd'
import DashboardEmptyState from './DashboardEmptyState'

const KIEU_MAU_MUC_UU_TIEN = {
  danger: { background: '#fff4f1', borderColor: '#ffcfc2' },
  warning: { background: '#fff8ee', borderColor: '#ffdba0' },
  success: { background: '#f5fbf2', borderColor: '#cfe8c6' },
  neutral: { background: '#fcfaf8', borderColor: '#ebe4dd' },
}

function HanhDongUuTien({ urgentTasks }) {
  const danhSachMucUuTien = Array.isArray(urgentTasks) ? urgentTasks : []

  return (
    <Card className="noi-bo-dashboard-card" title="Cần xử lý ngay" styles={{ body: { padding: '14px' } }}>
      {danhSachMucUuTien.length > 0 ? (
        <Row className="noi-bo-dashboard-priority-grid" gutter={[12, 12]}>
          {danhSachMucUuTien.map((mucUuTien) => (
            <Col key={mucUuTien.key} xs={24} sm={12} xl={6}>
              <Card className={`noi-bo-dashboard-priority-card noi-bo-dashboard-priority-card--${mucUuTien.tone || 'neutral'}`} size="small" styles={{ body: { minHeight: 116, padding: 14 } }} style={KIEU_MAU_MUC_UU_TIEN[mucUuTien.tone] || KIEU_MAU_MUC_UU_TIEN.neutral}>
                <Space size={6} style={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography.Text className="noi-bo-dashboard-priority-card__title">{mucUuTien.title}</Typography.Text>
                  <Typography.Title level={2} className="noi-bo-dashboard-priority-card__value">{mucUuTien.value}</Typography.Title>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <DashboardEmptyState compact title="Chưa có việc ưu tiên cần xử lý" description="Các đầu việc cần chú ý sẽ xuất hiện tại đây." />
      )}
    </Card>
  )
}

export default HanhDongUuTien
