import MucNgayDatBan from './MucNgayDatBan'
import ChonSoKhachDatBan from './ChonSoKhachDatBan'
import GhiChuVanHanhDatBan from './GhiChuVanHanhDatBan'
import ChonChoNgoiDatBan from './ChonChoNgoiDatBan'
import ChonKhungGioDatBan from './ChonKhungGioDatBan'

function BuocMotDatBan({
  activeBookingSection,
  availability,
  calendar,
  formData,
  guestCount,
  guestWarning,
  handlers,
  inlineErrors,
  invalidPastDate,
  selectedMealDurationText,
  selectedSeatOperationalNote,
  bookingOperationalRules,
  serviceHotlineLink,
  stepOneProgress,
}) {
  return (
    <div className="booking-step booking-step-premium booking-step-progressive">
      <div className={`booking-luong-section ${activeBookingSection === 'guests' ? 'is-active' : ''}`}>
        <ChonSoKhachDatBan
          formData={formData}
          guestCount={guestCount}
          guestWarning={guestWarning}
          inlineErrors={inlineErrors}
          onGuestSelect={handlers.handleGuestSelect}
          serviceHotlineLink={serviceHotlineLink}
        />
      </div>

      <div className={`booking-luong-section ${activeBookingSection === 'date' ? 'is-active' : ''} ${stepOneProgress.hasGuests ? '' : 'is-locked'}`}>
        <MucNgayDatBan
          calendarContainerRef={calendar.calendarContainerRef}
          dateSectionRef={calendar.dateSectionRef}
          calendarDays={calendar.calendarDays}
          calendarFocusedDate={calendar.calendarFocusedDate}
          calendarOpen={calendar.calendarOpen}
          calendarMonth={calendar.calendarMonth}
          canViewPreviousMonth={calendar.canViewPreviousMonth}
          formData={formData}
          handleCalendarDayKeyDown={handlers.handleCalendarDayKeyDown}
          handleCalendarMonthChange={handlers.handleCalendarMonthChange}
          handleDateInputChange={handlers.handleDateInputChange}
          handleDateSelect={handlers.handleDateSelect}
          inlineErrors={inlineErrors}
          isLocked={!stepOneProgress.hasGuests}
          isSelectedDateClosed={calendar.isSelectedDateClosed}
          isSelectedDateOutOfRange={calendar.isSelectedDateOutOfRange}
          maxBookableDate={calendar.maxBookableDate}
          openDateOptions={calendar.openDateOptions}
          selectedDateLabel={calendar.selectedDateLabel}
          selectedDateShort={calendar.selectedDateShort}
          setCalendarFocusedDate={calendar.setCalendarFocusedDate}
          todayString={calendar.todayString}
          toggleCalendar={calendar.toggleCalendar}
        />
      </div>

      <div className={`booking-luong-section ${activeBookingSection === 'time' ? 'is-active' : ''} ${stepOneProgress.hasDate ? '' : 'is-locked'} ${stepOneProgress.hasDate ? '' : 'is-waiting'}`}>
        <ChonKhungGioDatBan
          availabilityPanelRef={availability.availabilityPanelRef}
          firstAvailableSlotRef={availability.firstAvailableSlotRef}
          firstAvailableSlotTime={availability.firstAvailableSlotTime}
          formData={formData}
          guestCount={guestCount}
          handleSelectSuggestedTime={handlers.handleSelectSuggestedTime}
          handleTimeSelect={handlers.handleTimeSelect}
          inlineErrors={inlineErrors}
          invalidPastDate={invalidPastDate}
          isLocked={!stepOneProgress.hasDate}
          recommendedSlotTime={availability.recommendedSlotTime}
          selectedTimeSuggestions={availability.selectedTimeSuggestions}
          slotGroups={availability.slotGroups}
          slotsLoading={availability.slotsLoading}
        />
      </div>

      <div className={`booking-luong-section ${activeBookingSection === 'seating' ? 'is-active' : ''} ${stepOneProgress.hasTime ? '' : 'is-locked'}`}>
        <ChonChoNgoiDatBan
          formData={formData}
          guestCount={guestCount}
          handleSeatingSelect={handlers.handleSeatingSelect}
          selectedSeatOperationalNote={selectedSeatOperationalNote}
        />
      </div>

      <div className={`booking-luong-section ${stepOneProgress.hasTime ? '' : 'is-collapsed'}`}>
        <GhiChuVanHanhDatBan
          bookingOperationalRules={bookingOperationalRules}
          selectedMealDurationText={selectedMealDurationText}
        />
      </div>
    </div>
  )
}

export default BuocMotDatBan
