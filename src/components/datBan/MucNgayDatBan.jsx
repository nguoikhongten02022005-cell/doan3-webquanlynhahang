import { useEffect, useRef, useState } from 'react'
import { NHAN_THU_TRONG_TUAN } from '../../data/duLieuDatBan'
import { CAC_THU_TRONG_LICH_DAT_BAN } from '../../constants/giaoDienDatBan'
import { VAN_BAN_THU_DONG_CUA, dinhDangThangLich } from '../../utils/datBan/index'

function MucNgayDatBan({
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
    <section className={`dat-ban-editorial-card ${isLocked ? 'dat-ban-section-locked' : ''}`} ref={calendarContainerRef}>
      <div className="dat-ban-date-section-anchor" ref={dateSectionRef} />
      <div className="dat-ban-section-head">
        <div>
          <p className="dat-ban-side-kicker">Ngày dùng bữa</p>
          <h3>Chọn ngày dùng bữa</h3>
        </div>
        {isLocked ? <span className="dat-ban-inline-note dat-ban-inline-note-warning">Chọn số khách trước</span> : null}
      </div>

      <div className="dat-ban-form-grid-split">
        <div className="form-field">
          <label className="nhan-truong" htmlFor="dat-ban-date">Ngày dùng bữa</label>
          <div ref={datePickerShellRef} className={`dat-ban-date-picker-shell ${inlineErrors.date ? 'has-error' : ''} ${calendarOpen ? 'is-open' : ''}`}>
            <input id="dat-ban-date" name="date" type="date" className={`truong-nhap dat-ban-date-input ${inlineErrors.date ? 'truong-nhap-error' : ''}`} value={formData.date} min={todayString} max={maxBookableDate} onChange={handleDateInputChange} aria-hidden="true" tabIndex={-1} />
            <button
              type="button"
              className={`dat-ban-date-picker-trigger ${formData.date ? 'selected' : ''}`}
              onClick={() => toggleCalendar(!calendarOpen)}
              disabled={isLocked}
              aria-expanded={calendarOpen}
              aria-haspopup="dialog"
              aria-controls="dat-ban-date-calendar"
            >
              <div className="dat-ban-date-picker-meta">
                <span className="dat-ban-date-picker-label">{selectedDateShort || 'Chọn ngày dùng bữa'}</span>
                <span className="dat-ban-date-picker-hint">{selectedDateLabel || `Mở lịch để xem thêm ngày ngoài ${openDateOptions.length} ngày gần nhất`}</span>
              </div>
              <span className="dat-ban-date-picker-icon" aria-hidden="true">📅</span>
            </button>

            {calendarOpen && !isLocked && (
              <>
                {calendarPlacement === 'sheet' ? (
                  <button
                    type="button"
                    className="dat-ban-calendar-backdrop"
                    aria-label="Đóng lịch chọn ngày"
                    onClick={() => toggleCalendar(false)}
                  />
                ) : null}
                <div className={`dat-ban-calendar-popover is-${calendarPlacement}`}>
                  <div
                    ref={calendarPanelRef}
                    id="dat-ban-date-calendar"
                    className="dat-ban-calendar-panel"
                    role="dialog"
                    aria-modal={calendarPlacement === 'sheet'}
                    aria-label="Lịch chọn ngày dùng bữa"
                  >
                    <div className="dat-ban-calendar-header">
                      <strong>{dinhDangThangLich(calendarMonth)}</strong>
                      <div className="dat-ban-calendar-nav">
                        <button type="button" onClick={() => handleCalendarMonthChange(-1)} disabled={!canViewPreviousMonth}>‹</button>
                        <button type="button" onClick={() => handleCalendarMonthChange(1)}>›</button>
                      </div>
                    </div>
                    <div className="dat-ban-calendar-weekdays">
                      {CAC_THU_TRONG_LICH_DAT_BAN.map((weekday) => <span key={weekday}>{weekday}</span>)}
                    </div>
                    <div className="dat-ban-calendar-grid">
                      {calendarDays.map((day) => day.isEmpty ? (
                        <span key={day.key} className="dat-ban-calendar-day-empty" aria-hidden="true" />
                      ) : (
                        <button
                          key={day.key}
                          type="button"
                          data-calendar-date={day.value}
                          tabIndex={calendarFocusedDate === day.value ? 0 : -1}
                          className={`dat-ban-calendar-day ${formData.date === day.value ? 'selected' : ''} ${day.isDisabled ? 'disabled' : ''}`}
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
          {inlineErrors.date && <span className="loi-bieu-mau-inline">{inlineErrors.date}</span>}
          <span className="dat-ban-field-note">Không nhận đặt bàn vào {VAN_BAN_THU_DONG_CUA}. Ngày nghỉ được khóa trực tiếp trong lịch.</span>
          {(isSelectedDateClosed || isSelectedDateOutOfRange) && <span className="loi-bieu-mau-inline">Ngày đã chọn hiện không khả dụng. Vui lòng chọn ngày khác.</span>}
        </div>
      </div>

      <div className="dat-ban-compact-section-head">
        <span>Ngày khả dụng gần nhất</span>
        <button type="button" className={`dat-ban-link-button dat-ban-link-button-secondary ${calendarOpen ? 'is-open' : ''}`} onClick={() => toggleCalendar(!calendarOpen)} disabled={isLocked}>{calendarOpen ? 'Ẩn lịch đầy đủ' : 'Xem lịch đầy đủ'}</button>
      </div>

      <div className="dat-ban-open-days-strip" aria-label="Ngày nhận bàn khả dụng gần nhất">
        {openDateOptions.map((dateValue) => (
          <button key={dateValue} type="button" className={`dat-ban-open-day-chip ${formData.date === dateValue ? 'selected' : ''}`} onClick={() => handleDateSelect(dateValue)} disabled={isLocked}>
            <strong>{dateValue.slice(8, 10)}/{dateValue.slice(5, 7)}</strong>
            <span>{NHAN_THU_TRONG_TUAN[new Date(Number(dateValue.slice(0, 4)), Number(dateValue.slice(5, 7)) - 1, Number(dateValue.slice(8, 10))).getDay()]}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default MucNgayDatBan
