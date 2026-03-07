import { BOOKING_STEP_ITEMS } from '../../data/bookingData'
import { BOOKING_SIDEBAR_CONTENT } from '../../constants/bookingUi'

function BookingSidebar({ step, serviceHotline }) {
  return (
    <aside className="booking-sidebar-premium">
      <div className="booking-stepper-card">
        <p className="booking-side-kicker">{BOOKING_SIDEBAR_CONTENT.progressTitle}</p>
        <div className="booking-stepper-list">
          {BOOKING_STEP_ITEMS.map((item) => {
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

      <div className="booking-side-card booking-side-card-dark">
        <p className="booking-side-kicker">{BOOKING_SIDEBAR_CONTENT.hoursTitle}</p>
        <div className="booking-side-hours">
          {BOOKING_SIDEBAR_CONTENT.hours.map((item) => (
            <div key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="booking-side-card">
        <p className="booking-side-kicker">{BOOKING_SIDEBAR_CONTENT.quickContactTitle}</p>
        <div className="booking-side-contact">
          <p>📞 {serviceHotline}</p>
          {BOOKING_SIDEBAR_CONTENT.contacts.map((item) => <p key={item}>{item}</p>)}
        </div>
      </div>
    </aside>
  )
}

export default BookingSidebar
