import { CAC_BUOC_DAT_BAN } from '../../data/duLieuDatBan'
import { BOOKING_SIDEBAR_CONTENT } from '../../constants/giaoDienDatBan'

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
    <aside className="booking-sidebar-premium">
      <div className="booking-stepper-card booking-stepper-card-compact">
        <div className="booking-side-card-head booking-side-card-head-tight">
          <p className="booking-side-kicker">{BOOKING_SIDEBAR_CONTENT.progressTitle}</p>
          <span className="booking-progress-pill">Bước {step}/3</span>
        </div>

        <div className="booking-stepper-list booking-stepper-list-compact">
          {CAC_BUOC_DAT_BAN.map((item) => {
            const isActive = step === item.id
            const isCompleted = step > item.id

            return (
              <div
                key={item.id}
                className={`booking-stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <span className="booking-stepper-index">{isCompleted ? '✓' : item.id}</span>
                <div>
                  <p>{item.eyebrow}</p>
                  <strong>{item.title}</strong>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="booking-side-card booking-summary-rail-card">
        <div className="booking-side-card-head">
          <div>
            <p className="booking-side-kicker">{BOOKING_SIDEBAR_CONTENT.summaryTitle}</p>
            <h3>Lựa chọn hiện tại</h3>
          </div>
        </div>

        <div className="booking-summary-rail-list">
          <div className="booking-summary-rail-item">
            <span>Số khách</span>
            <strong>{bookingSelectionSummary.guests}</strong>
          </div>
          <div className="booking-summary-rail-item">
            <span>Ngày</span>
            <strong>{bookingSelectionSummary.date}</strong>
          </div>
          <div className="booking-summary-rail-item">
            <span>Giờ</span>
            <strong>{bookingSelectionSummary.time}</strong>
          </div>
          <div className="booking-summary-rail-item">
            <span>Khu vực</span>
            <strong>{bookingSelectionSummary.seatingArea}</strong>
          </div>
        </div>

        {submitError && <p className="form-error booking-rail-error" role="alert">{submitError}</p>}

        <div className="booking-rail-actions">
          <button
            type={primaryActionType}
            form={primaryActionForm}
            className="booking-primary-btn booking-rail-primary-btn"
            onClick={onPrimaryAction}
            disabled={primaryCtaDisabled}
          >
            {primaryCtaLabel}
          </button>
          {secondaryCtaLabel ? (
            <button type="button" className="booking-secondary-btn" onClick={onSecondaryAction}>
              {secondaryCtaLabel}
            </button>
          ) : null}
        </div>
      </div>

      <div className="booking-side-card booking-side-card-dark booking-side-service-card">
        <div className="booking-side-service-topline">
          <p className="booking-side-kicker">{BOOKING_SIDEBAR_CONTENT.quickContactTitle}</p>
          <p className="booking-side-service-hotline">
            📞 <a href={serviceHotlineLink}>{serviceHotline}</a>
          </p>
        </div>

        <div className="booking-side-hours booking-side-hours-compact">
          {BOOKING_SIDEBAR_CONTENT.hours.map((item) => (
            <div key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="booking-side-contact booking-side-contact-compact">
          {BOOKING_SIDEBAR_CONTENT.contacts.map((item) => <p key={item}>{item}</p>)}
        </div>
      </div>
    </aside>
  )
}

export default ThanhBenDatBan
