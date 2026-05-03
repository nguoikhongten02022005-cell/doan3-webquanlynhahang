import { Alert, Button, Card, Descriptions, Flex, List, Space, Steps, Typography } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

const NHAN_NUT_THEO_GIAI_DOAN = {
  guests: 'Chọn số khách',
  date: 'Chọn ngày dùng bữa',
  time: 'Chọn khung giờ',
  stepTwo: 'Tiếp tục tới thông tin liên hệ',
  stepThree: 'Tiếp tục tới xác nhận',
  stepFour: 'Xác nhận',
  ready: 'Tiếp tục',
}

const layNhanNutTheoBuoc = (currentStep, nextStage) => {
  if (currentStep === 2) {
    return NHAN_NUT_THEO_GIAI_DOAN.stepTwo
  }

  if (currentStep === 3) {
    return NHAN_NUT_THEO_GIAI_DOAN.stepThree
  }

  if (currentStep === 4) {
    return NHAN_NUT_THEO_GIAI_DOAN.stepFour
  }

  return NHAN_NUT_THEO_GIAI_DOAN[nextStage] || NHAN_NUT_THEO_GIAI_DOAN.ready
}

function ThanhBenDatBan({
  steps,
  currentStep,
  summary,
  nextStage,
  canProceed,
  continueBlockedMessage,
  onContinue,
  onBack,
  onBackToStep1,
  onSkip,
  onRemoveItem,
  onClearCart,
}) {
  const hasMenuItems = Array.isArray(summary.selectedMenuItems) && summary.selectedMenuItems.length > 0
  const subtotalLabel = summary.subtotalLabel

  return (
    <Card>
      <Steps
        orientation="vertical"
        size="small"
        current={Math.max(0, currentStep - 1)}
        items={steps.map((step) => ({ title: step.label, content: step.description }))}
      />

      <Descriptions column={1} bordered size="small" style={{ marginTop: 16, marginBottom: 16 }}>
        <Descriptions.Item label="Số khách">{summary.guests}</Descriptions.Item>
        <Descriptions.Item label="Ngày">{summary.date}</Descriptions.Item>
        <Descriptions.Item label="Giờ">{summary.time}</Descriptions.Item>
        <Descriptions.Item label="Khu vực">{summary.area}</Descriptions.Item>
      </Descriptions>

      {hasMenuItems ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: 13 }}>Món đã chọn:</Text>
          <List
            size="small"
            dataSource={summary.selectedMenuItems}
            renderItem={(item) => (
              <List.Item style={{ padding: '4px 0' }} actions={onRemoveItem && currentStep === 2 ? [
                <CloseCircleOutlined
                  key="remove"
                  onClick={() => onRemoveItem(item.id)}
                  style={{
                    color: '#ccc',
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e8664a'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
                />
              ] : undefined}>
                <Space>
                  <Text>{item.quantity}x</Text>
                  <Text>{item.name}</Text>
                  <Text type="secondary">{item.price}</Text>
                </Space>
              </List.Item>
            )}
            style={{ marginTop: 8 }}
          />
          {subtotalLabel && (
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <Text strong style={{ color: '#e8664a' }}>Tạm tính: {subtotalLabel}</Text>
            </div>
          )}
        </div>
      ) : null}

      {currentStep === 2 ? (
        <Flex vertical gap={8}>
          <Button
            size="large"
            onClick={onBackToStep1}
            style={{ borderColor: '#999', color: '#666' }}
          >
            ← Quay lại chọn bàn
          </Button>
          {hasMenuItems ? (
            <Flex gap={8}>
              <Button
                size="large"
                onClick={() => {
                  if (onClearCart) onClearCart()
                  onSkip()
                }}
                style={{ flex: 1, borderColor: '#999', color: '#666' }}
              >
                Bỏ qua chọn món
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={onSkip}
                style={{ flex: 1, backgroundColor: '#e8664a', borderColor: '#e8664a', fontWeight: 'bold' }}
              >
                Tiếp tục
              </Button>
            </Flex>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={onSkip}
              style={{ backgroundColor: '#e8664a', borderColor: '#e8664a', fontWeight: 'bold' }}
            >
              Bỏ qua & Tiếp tục
            </Button>
          )}
        </Flex>
      ) : (
        <>
          {currentStep === 3 && (
            <Button
              block
              onClick={onBack}
              style={{ marginBottom: 8, borderColor: '#999', color: '#666' }}
            >
              ← Quay lại chọn món
            </Button>
          )}
          <Button type="primary" block onClick={onContinue} disabled={!canProceed || currentStep === 4}>
            {layNhanNutTheoBuoc(currentStep, nextStage)}
          </Button>
        </>
      )}
      {continueBlockedMessage ? <Alert style={{ marginTop: 12 }} type="warning" showIcon title={continueBlockedMessage} /> : null}
    </Card>
  )
}

export default ThanhBenDatBan
