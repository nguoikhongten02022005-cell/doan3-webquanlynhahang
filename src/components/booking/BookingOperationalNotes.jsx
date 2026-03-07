function BookingOperationalNotes({ bookingOperationalRules, selectedMealDurationText }) {
  return (
    <>
      {selectedMealDurationText && (
        <div className="booking-seat-note-banner">
          <strong>Dự kiến sử dụng bàn:</strong> {selectedMealDurationText}
        </div>
      )}

      {bookingOperationalRules.length > 0 && (
        <section className="booking-editorial-card">
          <div className="booking-section-head">
            <div>
              <p className="booking-side-kicker">Vận hành</p>
              <h3>Thông tin cần lưu ý</h3>
            </div>
          </div>
          <div className="booking-policy-notes booking-policy-notes-premium">
            {bookingOperationalRules.slice(0, 3).map((item) => (
              <div className="policy-item" key={item.text}>
                <span className="policy-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          {bookingOperationalRules.length > 3 && (
            <div className="booking-policy-notes booking-policy-notes-premium booking-policy-notes-secondary">
              {bookingOperationalRules.slice(3).map((item) => (
                <div className="policy-item" key={item.text}>
                  <span className="policy-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}

export default BookingOperationalNotes
