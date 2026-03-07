import BookingDateSection from './BookingDateSection'
import BookingGuestSelector from './BookingGuestSelector'
import BookingOperationalNotes from './BookingOperationalNotes'
import BookingSeatingSelector from './BookingSeatingSelector'
import BookingSlotPicker from './BookingSlotPicker'

function BookingStepOne({
  availability,
  calendar,
  formData,
  guestCount,
  guestWarning,
  handlers,
  inlineErrors,
  invalidPastDate,
  primaryCtaLabel,
  selectedMealDurationText,
  selectedSeatOperationalNote,
  bookingOperationalRules,
  serviceHotlineLink,
}) {
  return (
    <div className="booking-step booking-step-premium">
      <BookingGuestSelector
        formData={formData}
        guestCount={guestCount}
        guestWarning={guestWarning}
        inlineErrors={inlineErrors}
        onGuestSelect={handlers.handleGuestSelect}
        serviceHotlineLink={serviceHotlineLink}
      />

      <BookingDateSection
        calendarContainerRef={calendar.calendarContainerRef}
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
        isSelectedDateClosed={calendar.isSelectedDateClosed}
        isSelectedDateOutOfRange={calendar.isSelectedDateOutOfRange}
        maxBookableDate={calendar.maxBookableDate}
        nextOpenDate={calendar.nextOpenDate}
        openDateOptions={calendar.openDateOptions}
        selectedDateLabel={calendar.selectedDateLabel}
        selectedDateShort={calendar.selectedDateShort}
        setCalendarFocusedDate={calendar.setCalendarFocusedDate}
        todayString={calendar.todayString}
        toggleCalendar={calendar.toggleCalendar}
      />

      <BookingSlotPicker
        availabilityPanelRef={availability.availabilityPanelRef}
        firstAvailableSlotRef={availability.firstAvailableSlotRef}
        firstAvailableSlotTime={availability.firstAvailableSlotTime}
        formData={formData}
        guestCount={guestCount}
        handleSelectSuggestedTime={handlers.handleSelectSuggestedTime}
        handleTimeSelect={handlers.handleTimeSelect}
        inlineErrors={inlineErrors}
        invalidPastDate={invalidPastDate}
        recommendedSlotTime={availability.recommendedSlotTime}
        selectedTimeSuggestions={availability.selectedTimeSuggestions}
        slotGroups={availability.slotGroups}
        slotsLoading={availability.slotsLoading}
      />

      <BookingSeatingSelector
        formData={formData}
        guestCount={guestCount}
        handleSeatingSelect={handlers.handleSeatingSelect}
        selectedSeatOperationalNote={selectedSeatOperationalNote}
      />

      <BookingOperationalNotes
        bookingOperationalRules={bookingOperationalRules}
        selectedMealDurationText={selectedMealDurationText}
      />

      <div className="booking-action-row">
        <button type="button" className="booking-primary-btn" onClick={handlers.handleStepOneContinue}>{primaryCtaLabel}</button>
      </div>
    </div>
  )
}

export default BookingStepOne
