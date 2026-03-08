import { useEffect, useRef, useState } from 'react'
import { WEEKDAY_LABELS } from '../../data/bookingData'
import { BOOKING_CALENDAR_WEEKDAYS } from '../../constants/bookingUi'
import { CLOSED_WEEKDAY_TEXT, formatCalendarMonth } from '../../utils/booking'

function BookingDateSection({
  calendarContainerRef,
  dateSectionRef,
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
  isLocked,
  isSelectedDateClosed,
  isSelectedDateOutOfRange,
  maxBookableDate,
  openDateOptions,
  selectedDateLabel,
  selectedDateShort,
  setCalendarFocusedDate,
  todayString,
  toggleCalendar,
}) {
  const datePickerShellRef = useRef(null)
  const calendarPanelRef = useRef(null)
  const [calendarPlacement, setCalendarPlacement] = useState('bottom')

  useEffect(() => {
    if (!calendarOpen) return undefined

    const updateCalendarPlacement = () => {
      if (window.innerWidth <= 640) {
        setCalendarPlacement('sheet')
        return
      }

      const triggerRect = datePickerShellRef.current?.getBoundingClientRect()
      const panelRect = calendarPanelRef.current?.getBoundingClientRect()

      if (!triggerRect || !panelRect) {
        setCalendarPlacement('bottom')
        return
      }

      const gap = 16
      const spaceBelow = window.innerHeight - triggerRect.bottom
      const spaceAbove = triggerRect.top
      const shouldOpenAbove = spaceBelow < panelRect.height + gap && spaceAbove > spaceBelow

      setCalendarPlacement(shouldOpenAbove ? 'top' : 'bottom')
    }

    updateCalendarPlacement()
    window.addEventListener('resize', updateCalendarPlacement)
    window.addEventListener('scroll', updateCalendarPlacement, true)

    return () => {
      window.removeEventListener('resize', updateCalendarPlacement)
      window.removeEventListener('scroll', updateCalendarPlacement, true)
    }
  }, [calendarOpen])

  return (
    <section className={`booking-editorial-card ${isLocked ? 'booking-section-locked' : ''}`} ref={calendarContainerRef}>
      <div className="booking-date-section-anchor" ref={dateSectionRef} />
      <div className="booking-section-head">
        <div>
          <p className="booking-side-kicker">Ngày dùng bữa</p>
          <h3>Chọn ngày dùng bữa</h3>
        </div>
        {isLocked ? <span className="booking-inline-note booking-inline-note-warning">Chọn số khách trước</span> : null}
      </div>

      <div className="booking-form-grid-split">
        <div className="form-field">
          <label className="form-label" htmlFor="booking-date">Ngày dùng bữa</label>
          <div ref={datePickerShellRef} className={`booking-date-picker-shell ${inlineErrors.date ? 'has-error' : ''} ${calendarOpen ? 'is-open' : ''}`}>
            <input id="booking-date" name="date" type="date" className={`form-input booking-date-input ${inlineErrors.date ? 'form-input-error' : ''}`} value={formData.date} min={todayString} max={maxBookableDate} onChange={handleDateInputChange} aria-hidden="true" tabIndex={-1} />
            <button
              type="button"
              className={`booking-date-picker-trigger ${formData.date ? 'selected' : ''}`}
              onClick={() => toggleCalendar(!calendarOpen)}
              disabled={isLocked}
              aria-expanded={calendarOpen}
              aria-haspopup="dialog"
              aria-controls="booking-date-calendar"
            >
              <div className="booking-date-picker-meta">
                <span className="booking-date-picker-label">{selectedDateShort || 'Chọn ngày dùng bữa'}</span>
                <span className="booking-date-picker-hint">{selectedDateLabel || `Mở lịch để xem thêm ngày ngoài ${openDateOptions.length} ngày gần nhất`}</span>
              </div>
              <span className="booking-date-picker-icon" aria-hidden="true">📅</span>
            </button>

            {calendarOpen && !isLocked && (
              <>
                {calendarPlacement === 'sheet' ? (
                  <button
                    type="button"
                    className="booking-calendar-backdrop"
                    aria-label="Đóng lịch chọn ngày"
                    onClick={() => toggleCalendar(false)}
                  />
                ) : null}
                <div className={`booking-calendar-popover is-${calendarPlacement}`}>
                  <div
                    ref={calendarPanelRef}
                    id="booking-date-calendar"
                    className="booking-calendar-panel"
                    role="dialog"
                    aria-modal={calendarPlacement === 'sheet'}
                    aria-label="Lịch chọn ngày dùng bữa"
                  >
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
                </div>
              </>
            )}
          </div>
          {inlineErrors.date && <span className="form-error-inline">{inlineErrors.date}</span>}
          <span className="booking-field-note">Không nhận đặt bàn vào {CLOSED_WEEKDAY_TEXT}. Ngày nghỉ được khóa trực tiếp trong lịch.</span>
          {(isSelectedDateClosed || isSelectedDateOutOfRange) && <span className="form-error-inline">Ngày đã chọn hiện không khả dụng. Vui lòng chọn ngày khác.</span>}
        </div>
      </div>

      <div className="booking-compact-section-head">
        <span>Ngày khả dụng gần nhất</span>
        <button type="button" className={`booking-link-button booking-link-button-secondary ${calendarOpen ? 'is-open' : ''}`} onClick={() => toggleCalendar(!calendarOpen)} disabled={isLocked}>{calendarOpen ? 'Ẩn lịch đầy đủ' : 'Xem lịch đầy đủ'}</button>
      </div>

      <div className="booking-open-days-strip" aria-label="Ngày nhận bàn khả dụng gần nhất">
        {openDateOptions.map((dateValue) => (
          <button key={dateValue} type="button" className={`booking-open-day-chip ${formData.date === dateValue ? 'selected' : ''}`} onClick={() => handleDateSelect(dateValue)} disabled={isLocked}>
            <strong>{dateValue.slice(8, 10)}/{dateValue.slice(5, 7)}</strong>
            <span>{WEEKDAY_LABELS[new Date(Number(dateValue.slice(0, 4)), Number(dateValue.slice(5, 7)) - 1, Number(dateValue.slice(8, 10))).getDay()]}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default BookingDateSection
