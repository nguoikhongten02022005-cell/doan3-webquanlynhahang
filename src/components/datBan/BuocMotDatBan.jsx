import {
  CAC_CA_KHUNG_GIO_DAT_BAN,
  CAC_SO_KHACH_DAT_BAN,
  NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN,
} from '../../data/duLieuDatBan'

function BuocMotDatBan({
  formData,
  dateOptions,
  selectedDateLabel,
  selectedDayLabel,
  minDate,
  maxDate,
  availabilityByArea,
  areaOptions,
  timeSlotOptions,
  selectedAreaUnavailableMessage,
  largePartyNotice,
  onGuestSelect,
  onDateSelect,
  onDateInputChange,
  onTimeSelect,
  onAreaToggle,
}) {
  const hasSelectedDate = Boolean(formData.date)
  const hasSelectedTime = Boolean(formData.time)

  return (
    <article className="dat-ban-customer-card dat-ban-customer-card-soft dat-ban-customer-flow-card">
      <div className="dat-ban-customer-control-head dat-ban-customer-flow-head">
        <div>
          <h2>Chọn số khách, ngày, giờ và khu vực bạn muốn ưu tiên.</h2>
        </div>
      </div>

      <section className="dat-ban-flow-section">
        <div className="dat-ban-flow-section-head">
          <div>
            <h3>Chọn số khách</h3>
          </div>
          <p className="dat-ban-customer-grid-note">Nhóm từ 6 khách nên đặt sớm để có bàn phù hợp.</p>
        </div>

        <div className="dat-ban-guest-grid" role="list" aria-label="Chọn số khách">
          {CAC_SO_KHACH_DAT_BAN.map((guestCount) => {
            const isActive = String(guestCount) === String(formData.guests)
            return (
              <button
                key={guestCount}
                type="button"
                className={`dat-ban-guest-card ${isActive ? 'active' : ''}`}
                onClick={() => onGuestSelect(String(guestCount))}
              >
                <strong>{guestCount}</strong>
                <span>khách</span>
              </button>
            )
          })}

          <button type="button" className="dat-ban-guest-card dat-ban-guest-card-hotline" onClick={() => onGuestSelect('10')}>
            <strong>10+</strong>
            <span>Gọi hotline</span>
          </button>
        </div>

        {largePartyNotice ? (
          <div className="dat-ban-large-party-banner" role="note">
            <strong>Nhóm lớn vui lòng gọi hotline.</strong>
            <a href="tel:02838256789">{largePartyNotice}</a>
          </div>
        ) : null}
      </section>

      <section className="dat-ban-flow-section">
        <div className="dat-ban-flow-section-head">
          <div>
            <h3>Chọn ngày</h3>
          </div>
          <p className="dat-ban-customer-grid-note">Cuối tuần được đánh dấu nhẹ vì thường kín chỗ hơn.</p>
        </div>

        <div className="dat-ban-date-quick-row" role="list" aria-label="Ngày dùng bữa gợi ý">
          {dateOptions.map((option) => {
            const isActive = option.value === formData.date
            return (
              <button
                key={option.value}
                type="button"
                className={`dat-ban-date-chip ${isActive ? 'active' : ''} ${option.isWeekend ? 'weekend' : ''} ${option.isDisabled ? 'disabled' : ''}`}
                onClick={() => onDateSelect(option.value)}
                title={option.isDisabled ? option.disabledReason : option.dayLabel}
                disabled={option.isDisabled}
              >
                <strong>{option.label}</strong>
                <span>{option.dayLabel}{option.isDisabled ? ' 🚫' : ''}</span>
              </button>
            )
          })}
        </div>

        <label className="dat-ban-customer-field dat-ban-customer-field-wide">
          <span>Xem lịch đầy đủ</span>
          <input type="date" min={minDate} max={maxDate} className="truong-nhap" value={formData.date} onChange={onDateInputChange} />
          <small className="dat-ban-customer-help-text">Chỉ nhận đặt bàn trong vòng 30 ngày tới.</small>
        </label>
      </section>

      <section className="dat-ban-flow-section">
        <div className="dat-ban-flow-section-head">
          <div>
            <h3>Chọn khung giờ</h3>
          </div>
          {hasSelectedDate ? (
            <p className="dat-ban-customer-grid-note">{selectedDateLabel} {selectedDayLabel ? `· ${selectedDayLabel}` : ''}</p>
          ) : null}
        </div>

        {!hasSelectedDate ? (
          <div className="dat-ban-customer-empty-state">
            <h3>Chọn ngày trước để xem khung giờ.</h3>
            <p>Ngay khi có ngày dùng bữa, chúng tôi sẽ gợi ý các khung giờ còn phù hợp với lựa chọn của bạn.</p>
          </div>
        ) : (
          <div className="dat-ban-time-periods">
            {CAC_CA_KHUNG_GIO_DAT_BAN.map((period) => (
              <section key={period.id} className="dat-ban-time-period">
                <div className="dat-ban-time-period-head">
                  <div>
                    <p className="eyebrow">{period.icon} {period.label}</p>
                    <h3>{period.timeRange}</h3>
                  </div>
                  <span>🟢 {NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN.AVAILABLE} · 🟡 {NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN.LIMITED} · 🔴 {NHAN_TIN_HIEU_KHA_DUNG_DAT_BAN.FULL}</span>
                </div>

                <div className="dat-ban-time-slot-grid">
                  {period.slots.map((slot) => {
                    const slotOption = timeSlotOptions.find((item) => item.time === slot)
                    if (!slotOption) return null

                    const isActive = slotOption.time === formData.time
                    return (
                      <button
                        key={slotOption.time}
                        type="button"
                        className={`dat-ban-time-slot ${slotOption.availability.toLowerCase()} ${isActive ? 'active' : ''}`}
                        onClick={() => onTimeSelect(slotOption.time)}
                        disabled={slotOption.isDisabled}
                      >
                        <strong>{slotOption.time}</strong>
                        <span>{slotOption.availabilityLabel}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      <section className="dat-ban-flow-section">
        <div className="dat-ban-flow-section-head">
          <div>
            <p className="eyebrow">1.4</p>
            <h3>Chọn khu vực (tuỳ chọn)</h3>
          </div>
          <p className="dat-ban-customer-grid-note">Nhà hàng sẽ cố gắng sắp xếp theo ưu tiên này nhưng không cam kết 100%.</p>
        </div>

        {!hasSelectedTime ? (
          <div className="dat-ban-customer-empty-state">
            <h3>Chọn giờ dùng bữa để xem khu vực phù hợp.</h3>
            <p>Khi đã có ngày và giờ, hệ thống sẽ gợi ý mức độ khả dụng của từng khu vực để bạn chọn nhanh hơn.</p>
          </div>
        ) : (
          <>
            <div className="dat-ban-area-grid">
              {areaOptions.map((area) => {
                const availability = availabilityByArea[area.value]
                const isActive = formData.seatingArea === area.value
                return (
                  <button
                    key={area.value}
                    type="button"
                    className={`dat-ban-area-card ${isActive ? 'active' : ''} ${availability.count === 0 ? 'disabled' : ''}`}
                    onClick={() => onAreaToggle(area.value)}
                    disabled={availability.count === 0}
                  >
                    <div className="dat-ban-area-card-head">
                      <span>{area.icon}</span>
                      <div>
                        <div className="dat-ban-area-card-title-row">
                          <strong>{area.label}</strong>
                          {area.recommendationBadge ? <span className="dat-ban-area-badge">{area.recommendationBadge}</span> : null}
                        </div>
                        <p>{area.description}</p>
                        {area.recommendationNote ? <small className="dat-ban-area-note">{area.recommendationNote}</small> : null}
                      </div>
                    </div>
                    <div className="dat-ban-area-card-foot">
                      <span>{availability.label}</span>
                      <small>Còn: {availability.count} bàn</small>
                    </div>
                  </button>
                )
              })}
            </div>
            {selectedAreaUnavailableMessage ? <p className="dat-ban-customer-error">{selectedAreaUnavailableMessage}</p> : null}
          </>
        )}
      </section>
    </article>
  )
}

export default BuocMotDatBan
