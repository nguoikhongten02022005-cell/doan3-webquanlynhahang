import { WEEKDAY_LABELS } from '../../data/bookingData'
import { BOOKING_CALENDAR_WEEKDAYS } from '../../constants/bookingUi'
import { CLOSED_WEEKDAY_TEXT, formatCalendarMonth, getClosedDateLabel } from '../../utils/booking'

function BookingDateSection({
  calendarContainerRef,
  calendarDays,
  calendarFocusedDate,
  calendarOpen,
  calendarMonth,
  canViewPreviousMonth,
  formData,
  handleCalendarDayKeyDown,
  handleCalendarMonthChange,
  handleDateInputChange,
  handleDateSelect,
  inlineErrors,
  isSelectedDateClosed,
  isSelectedDateOutOfRange,
  maxBookableDate,
  nextOpenDate,
  openDateOptions,
  selectedDateLabel,
  selectedDateShort,
  setCalendarFocusedDate,
  todayString,
  toggleCalendar,
}) {
  return (
    <section className="booking-editorial-card">
      <div className="booking-section-head">
        <div>
          <p className="booking-side-kicker">Ngày dùng bữa</p>
          <h3>Kiểm tra bàn trống</h3>
        </div>
      </div>

      <div className="booking-form-grid-split" ref={calendarContainerRef}>
        <div className="form-field">
          <label className="form-label" htmlFor="booking-date">Ngày dùng bữa</label>
          <div className={`booking-date-picker-shell ${inlineErrors.date ? 'has-error' : ''}`}>
            <input id="booking-date" name="date" type="date" className={`form-input booking-date-input ${inlineErrors.date ? 'form-input-error' : ''}`} value={formData.date} min={todayString} max={maxBookableDate} onChange={handleDateInputChange} aria-hidden="true" tabIndex={-1} />
            <button type="button" className="booking-date-picker-trigger" onClick={toggleCalendar}>
              <div className="booking-date-picker-meta">
                <span className="booking-date-picker-label">{selectedDateShort || 'Chọn ngày dùng bữa'}</span>
                <span className="booking-date-picker-hint">{selectedDateLabel || `Mở lịch để xem thêm ngày ngoài ${openDateOptions.length} ngày gần nhất`}</span>
              </div>
              <span className="booking-date-picker-icon" aria-hidden="true">📅</span>
            </button>
          </div>
          {inlineErrors.date && <span className="form-error-inline">{inlineErrors.date}</span>}
          <span className="booking-field-note">Không nhận đặt bàn vào {CLOSED_WEEKDAY_TEXT}. Ngày nghỉ được khóa trực tiếp trong lịch.</span>
          {(isSelectedDateClosed || isSelectedDateOutOfRange) && <span className="form-error-inline">Ngày đã chọn hiện không khả dụng. Vui lòng chọn ngày khác.</span>}
        </div>
      </div>

      <div className="booking-compact-section-head">
        <span>Ngày gần nhất khả dụng</span>
        <button type="button" className="booking-link-button" onClick={toggleCalendar}>{calendarOpen ? 'Ẩn lịch' : 'Xem lịch đầy đủ'}</button>
      </div>

      <div className="booking-open-days-strip" aria-label="Ngày nhận bàn khả dụng gần nhất">
        {openDateOptions.map((dateValue) => (
          <button key={dateValue} type="button" className={`booking-open-day-chip ${formData.date === dateValue ? 'selected' : ''}`} onClick={() => handleDateSelect(dateValue)}>
            <strong>{dateValue.slice(8, 10)}/{dateValue.slice(5, 7)}</strong>
            <span>{WEEKDAY_LABELS[new Date(Number(dateValue.slice(0, 4)), Number(dateValue.slice(5, 7)) - 1, Number(dateValue.slice(8, 10))).getDay()]}</span>
          </button>
        ))}
      </div>

      {calendarOpen && (
        <div className="booking-calendar-panel" aria-label="Lịch chọn ngày dùng bữa">
          <div className="booking-calendar-header">
            <strong>{formatCalendarMonth(calendarMonth)}</strong>
            <div className="booking-calendar-nav">
              <button type="button" onClick={() => handleCalendarMonthChange(-1)} disabled={!canViewPreviousMonth}>‹</button>
              <button type="button" onClick={() => handleCalendarMonthChange(1)}>›</button>
            </div>
          </div>
          <div className="booking-calendar-weekdays">
            {BOOKING_CALENDAR_WEEKDAYS.map((weekday) => <span key={weekday}>{weekday}</span>)}
          </div>
          <div className="booking-calendar-grid">
            {calendarDays.map((day) => day.isEmpty ? (
              <span key={day.key} className="booking-calendar-day-empty" aria-hidden="true" />
            ) : (
              <button
                key={day.key}
                type="button"
                data-calendar-date={day.value}
                tabIndex={calendarFocusedDate === day.value ? 0 : -1}
                className={`booking-calendar-day ${formData.date === day.value ? 'selected' : ''} ${day.isDisabled ? 'disabled' : ''}`}
                onClick={() => handleDateSelect(day.value)}
                onFocus={() => setCalendarFocusedDate(day.value)}
                onKeyDown={(event) => handleCalendarDayKeyDown(event, day.value)}
                disabled={day.isDisabled}
                aria-label={`${day.weekdayLabel}, ${day.day}`}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>
      )}

      {!formData.date && <div className="booking-seat-note-banner"><strong>Gợi ý ngày gần nhất:</strong> {getClosedDateLabel(nextOpenDate)}</div>}
    </section>
  )
}

export default BookingDateSection
