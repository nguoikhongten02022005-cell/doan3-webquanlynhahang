import { Alert, Button, Card, Col, Descriptions, List, Row, Space, Typography } from 'antd'

const { Text } = Typography

const THONG_BAO_COC = 'Số tiền cọc sẽ được hoàn lại nếu bạn hủy trước 24 giờ so với giờ đặt. Nếu hủy sau thời gian này, tiền cọc sẽ không được hoàn.'

function BuocBaDatBan({ summary, contactSummary, reviewNotice, submitError, isSubmitting, yeuCauCoc, onBack, onSubmit }) {
  const isYeuCauCoc = yeuCauCoc?.isYeuCauCoc || false
  const soTienCoc = yeuCauCoc?.soTienCoc || 0
  const liDoCoc = yeuCauCoc?.liDo || []

  const dinhDangTien = (so) => new Intl.NumberFormat('vi-VN').format(so)

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

      {Array.isArray(summary.selectedMenuItems) && summary.selectedMenuItems.length > 0 ? (
        <Card title="Món đã chọn trước">
          <List
            size="small"
            dataSource={summary.selectedMenuItems}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <Text>{item.quantity}x</Text>
                  <Text>{item.name}</Text>
                  <Text type="secondary">{item.price}</Text>
                </Space>
              </List.Item>
            )}
          />
          {summary.subtotalLabel && (
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Text strong>Tạm tính: <Text strong style={{ color: '#e8664a' }}>{summary.subtotalLabel}</Text></Text>
            </div>
          )}
        </Card>
      ) : null}

      <Card title="Lưu ý quan trọng">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {reviewNotice.map((item) => <li key={item}><Typography.Text>{item}</Typography.Text></li>)}
        </ul>
      </Card>

      {isYeuCauCoc ? (
        <Alert
          type="warning"
          showIcon
          message={
            <Space orientation="vertical" size={4}>
              <Text strong>Yêu cầu đặt cọc {dinhDangTien(soTienCoc)}đ</Text>
              <Text type="secondary">Lý do: {liDoCoc.join(' · ')}</Text>
            </Space>
          }
          description={THONG_BAO_COC}
        />
      ) : null}

      {submitError ? <Alert type="error" showIcon title={submitError} /> : null}

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onBack}>Quay lại</Button>
        <Button
          type="primary"
          onClick={onSubmit}
          loading={isSubmitting}
          style={isYeuCauCoc ? { backgroundColor: '#d97706', borderColor: '#d97706' } : {}}
        >
          {isSubmitting ? 'Đang xử lý...' : isYeuCauCoc ? `Xác nhận & Thanh toán cọc ${dinhDangTien(soTienCoc)}đ` : 'Xác nhận đặt bàn'}
        </Button>
      </Space>
    </Space>
  )
}

export default BuocBaDatBan
