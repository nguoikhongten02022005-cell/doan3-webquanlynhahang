import { Alert, Button, Card, Descriptions, Steps } from 'antd'

const NHAN_NUT_THEO_GIAI_DOAN = {
  guests: 'Chọn số khách',
  date: 'Chọn ngày dùng bữa',
  time: 'Chọn khung giờ',
  stepTwo: 'Tiếp tục tới xác nhận',
  stepThree: 'Đang xem xác nhận',
  ready: 'Tiếp tục',
}

const layNhanNutTheoBuoc = (currentStep, nextStage) => {
  if (currentStep === 2) {
    return NHAN_NUT_THEO_GIAI_DOAN.stepTwo
  }

  if (currentStep === 3) {
    return NHAN_NUT_THEO_GIAI_DOAN.stepThree
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
}) {
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

      <Button type="primary" block onClick={onContinue} disabled={!canProceed || currentStep === 3}>
        {layNhanNutTheoBuoc(currentStep, nextStage)}
      </Button>
      {continueBlockedMessage ? <Alert style={{ marginTop: 12 }} type="warning" showIcon title={continueBlockedMessage} /> : null}
    </Card>
  )
}

export default ThanhBenDatBan
