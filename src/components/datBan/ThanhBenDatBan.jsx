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
    <aside className="dat-ban-customer-summary-card dat-ban-customer-summary-card-compact">
      <ol className="dat-ban-stepper" aria-label="Tiến trình đặt bàn">
        {steps.map((step, index) => {
          const status = index + 1 < currentStep ? 'done' : index + 1 === currentStep ? 'active' : 'upcoming'
          return (
            <li key={step.id} className={`dat-ban-stepper-item ${status}`}>
              <span className="dat-ban-stepper-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{step.label}</strong>
                <p>{step.description}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="dat-ban-customer-summary-list">
        <div>
          <span>Số khách</span>
          <strong>{summary.guests}</strong>
        </div>
        <div>
          <span>Ngày</span>
          <strong>{summary.date}</strong>
        </div>
        <div>
          <span>Giờ</span>
          <strong>{summary.time}</strong>
        </div>
        <div>
          <span>Khu vực</span>
          <strong>{summary.area}</strong>
        </div>
      </div>

      <button type="button" className="btn nut-chinh dat-ban-customer-submit" onClick={onContinue} disabled={!canProceed || currentStep === 3}>
        {layNhanNutTheoBuoc(currentStep, nextStage)}
      </button>
      {continueBlockedMessage ? <p className="dat-ban-customer-error">{continueBlockedMessage}</p> : null}
    </aside>
  )
}

export default ThanhBenDatBan
