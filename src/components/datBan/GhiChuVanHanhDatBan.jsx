function GhiChuVanHanhDatBan({ bookingOperationalRules, selectedMealDurationText }) {
  return (
    <>
      {selectedMealDurationText && (
        <div className="dat-ban-seat-note-banner">
          <strong>Dự kiến sử dụng bàn:</strong> {selectedMealDurationText}
        </div>
      )}

      {bookingOperationalRules.length > 0 && (
        <section className="dat-ban-editorial-card">
          <div className="dat-ban-section-head">
            <div>
              <p className="dat-ban-side-kicker">Vận hành</p>
              <h3>Thông tin cần lưu ý</h3>
            </div>
          </div>
          <div className="dat-ban-policy-notes dat-ban-policy-notes-premium">
            {bookingOperationalRules.slice(0, 3).map((item) => (
              <div className="policy-item" key={item.text}>
                <span className="policy-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          {bookingOperationalRules.length > 3 && (
            <div className="dat-ban-policy-notes dat-ban-policy-notes-premium dat-ban-policy-notes-secondary">
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

export default GhiChuVanHanhDatBan
