import { CAC_BUOC_DAT_BAN } from '../../data/duLieuDatBan'
import { NOI_DUNG_THANH_BEN_DAT_BAN } from '../../constants/giaoDienDatBan'

function ThanhBenDatBan({
  bookingSelectionSummary,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionForm,
  primaryActionType = 'button',
  primaryCtaDisabled,
  primaryCtaLabel,
  secondaryCtaLabel,
  serviceHotline,
  serviceHotlineLink,
  step,
  submitError,
}) {
  return (
    <aside className="dat-ban-sidebar-premium">
      <div className="dat-ban-stepper-card dat-ban-stepper-card-compact">
        <div className="dat-ban-side-card-head dat-ban-side-card-head-tight">
          <p className="dat-ban-side-kicker">{NOI_DUNG_THANH_BEN_DAT_BAN.progressTitle}</p>
          <span className="dat-ban-progress-pill">Bước {step}/3</span>
        </div>

        <div className="dat-ban-stepper-list dat-ban-stepper-list-compact">
          {CAC_BUOC_DAT_BAN.map((item) => {
            const isActive = step === item.id
            const isCompleted = step > item.id

            return (
              <div
                key={item.id}
                className={`dat-ban-stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <span className="dat-ban-stepper-index">{isCompleted ? '✓' : item.id}</span>
                <div>
                  <p>{item.eyebrow}</p>
                  <strong>{item.title}</strong>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="dat-ban-side-card dat-ban-side-quiet-card">
        <p className="dat-ban-side-kicker">Nhịp đặt bàn</p>
        <div className="dat-ban-side-quiet-list">
          <div className="dat-ban-side-quiet-item">
            <strong>Chọn nhanh trong 3 bước</strong>
            <span>Giữ flow gọn, không tạo cảm giác form dài.</span>
          </div>
          <div className="dat-ban-side-quiet-item">
            <strong>Xác nhận theo tình trạng thật</strong>
            <span>Nhà hàng ưu tiên đúng khung giờ và số khách đã chọn.</span>
          </div>
        </div>
      </div>

      <div className="dat-ban-side-card dat-ban-tom-tat-rail-card">
        <div className="dat-ban-side-card-head">
          <div>
            <p className="dat-ban-side-kicker">{NOI_DUNG_THANH_BEN_DAT_BAN.summaryTitle}</p>
            <h3>Lựa chọn hiện tại</h3>
          </div>
        </div>

        <p className="dat-ban-rail-note">
          Mỗi bước sẽ mở ra phần tiếp theo để giữ nhịp đặt bàn ngắn gọn và dễ theo dõi.
        </p>

        <div className="dat-ban-tom-tat-rail-list">
          <div className="dat-ban-tom-tat-rail-item">
            <span>Số khách</span>
            <strong>{bookingSelectionSummary.guests}</strong>
          </div>
          <div className="dat-ban-tom-tat-rail-item">
            <span>Ngày</span>
            <strong>{bookingSelectionSummary.date}</strong>
          </div>
          <div className="dat-ban-tom-tat-rail-item">
            <span>Giờ</span>
            <strong>{bookingSelectionSummary.time}</strong>
          </div>
          <div className="dat-ban-tom-tat-rail-item">
            <span>Khu vực</span>
            <strong>{bookingSelectionSummary.seatingArea}</strong>
          </div>
        </div>

        {submitError && <p className="loi-bieu-mau dat-ban-rail-error" role="alert">{submitError}</p>}

        <div className="dat-ban-rail-actions">
          <button
            type={primaryActionType}
            form={primaryActionForm}
            className="dat-ban-primary-btn dat-ban-rail-primary-btn"
            onClick={onPrimaryAction}
            disabled={primaryCtaDisabled}
          >
            {primaryCtaLabel}
          </button>
          {secondaryCtaLabel ? (
            <button type="button" className="dat-ban-secondary-btn" onClick={onSecondaryAction}>
              {secondaryCtaLabel}
            </button>
          ) : null}
        </div>
      </div>

      <div className="dat-ban-side-card dat-ban-side-card-dark dat-ban-side-service-card">
        <div className="dat-ban-side-service-topline">
          <p className="dat-ban-side-kicker">{NOI_DUNG_THANH_BEN_DAT_BAN.quickContactTitle}</p>
          <p className="dat-ban-side-service-hotline">
            📞 <a href={serviceHotlineLink}>{serviceHotline}</a>
          </p>
        </div>

        <div className="dat-ban-side-hours dat-ban-side-hours-compact">
          {NOI_DUNG_THANH_BEN_DAT_BAN.hours.map((item) => (
            <div key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="dat-ban-side-contact dat-ban-side-contact-compact">
          {NOI_DUNG_THANH_BEN_DAT_BAN.contacts.map((item) => <p key={item}>{item}</p>)}
        </div>
      </div>
    </aside>
  )
}

export default ThanhBenDatBan
