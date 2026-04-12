import { Alert, Button, Card, Col, Descriptions, Row, Space, Typography } from 'antd'

function BuocBaDatBan({ summary, contactSummary, reviewNotice, submitError, isSubmitting, onBack, onSubmit }) {
  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Thông tin đặt bàn">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Số khách">{summary.guests}</Descriptions.Item>
              <Descriptions.Item label="Ngày">{summary.date}</Descriptions.Item>
              <Descriptions.Item label="Giờ">{summary.time}</Descriptions.Item>
              <Descriptions.Item label="Khu vực">{summary.area}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Thông tin liên hệ">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Họ tên">{contactSummary.name}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{contactSummary.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{contactSummary.email}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{contactSummary.notes}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card title="Lưu ý quan trọng">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {reviewNotice.map((item) => <li key={item}><Typography.Text>{item}</Typography.Text></li>)}
        </ul>
      </Card>

      {submitError ? <Alert type="error" showIcon title={submitError} /> : null}

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onBack}>Quay lại</Button>
        <Button type="primary" onClick={onSubmit} loading={isSubmitting}>{isSubmitting ? 'Đang xử lý đặt bàn...' : 'Xác nhận'}</Button>
      </Space>
    </Space>
  )
}

export default BuocBaDatBan
