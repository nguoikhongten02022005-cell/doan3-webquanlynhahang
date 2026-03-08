import { useNavigate } from 'react-router-dom'
import { BOOKING_STEP_ITEMS } from '../data/bookingData'
import { BOOKING_DRAFT_BANNER, BOOKING_HERO_CONTENT } from '../constants/bookingUi'
import { SITE_CONTACT } from '../constants/siteContact'
import BookingSidebar from '../components/booking/BookingSidebar'
import BookingStepOne from '../components/booking/BookingStepOne'
import BookingStepTwo from '../components/booking/BookingStepTwo'
import BookingStepThree from '../components/booking/BookingStepThree'
import BookingSuccess from '../components/booking/BookingSuccess'
import { useAuth } from '../hooks/useAuth'
import { useBooking } from '../hooks/useBooking'
import { useBookingForm } from '../hooks/useBookingForm'
import { ONLINE_BOOKING_MAX_GUESTS } from '../utils/booking'

function BookingPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { createBooking, getDraft, saveDraft } = useBooking()
  const {
    activeBookingSection,
    availabilityPanelRef,
    bookingCode,
    bookingOperationalRules,
    bookingSelectionSummary,
    bookingStatus,
    calendarContainerRef,
    calendarDays,
    calendarFocusedDate,
    calendarOpen,
    calendarMonth,
    canViewPreviousMonth,
    draftRestored,
    firstAvailableSlotRef,
    firstAvailableSlotTime,
    formData,
    guestCount,
    guestWarning,
    goToStep,
    handleCalendarDayKeyDown,
    handleCalendarMonthChange,
    handleChange,
    handleDateInputChange,
    handleDateSelect,
    handleGuestSelect,
    handleNoteSuggestion,
    handleSeatingSelect,
    handleSelectSuggestedTime,
    handleStepOneContinue,
    handleStepTwoContinue,
    handleSubmit,
    handleTimeSelect,
    inlineErrors,
    invalidPastDate,
    isSelectedDateClosed,
    isSelectedDateOutOfRange,
    maxBookableDate,
    nextStepHint,
    openDateOptions,
    primaryCtaDisabled,
    primaryCtaLabel,
    recommendedSlotTime,
    selectedDateLabel,
    selectedDateShort,
    selectedMealDurationText,
    selectedSeatOperationalNote,
    selectedTimeSuggestions,
    setCalendarFocusedDate,
    setDraftRestored,
    slotGroups,
    slotsLoading,
    step,
    stepOneProgress,
    submitError,
    submitted,
    successHeading,
    successStatusLabel,
    todayString,
    toggleCalendar,
  } = useBookingForm({ currentUser, createBooking, getDraft, saveDraft })

  const secondaryAction = step > 1 ? () => goToStep(step - 1) : null
  const secondaryActionLabel = step === 2 ? 'Quay lại bước chọn bàn' : step === 3 ? 'Quay lại chỉnh sửa' : ''
  const primaryAction = step === 1 ? handleStepOneContinue : step === 2 ? handleStepTwoContinue : undefined

  return (
    <div className="booking-page">
      <section className="booking-hero booking-hero-premium">
        <div className="container booking-hero-shell booking-hero-shell-compact">
          <div className="booking-hero-copy booking-hero-copy-compact">
            <span className="booking-label">{BOOKING_HERO_CONTENT.label}</span>
            <h1 className="booking-title booking-title-premium">{BOOKING_HERO_CONTENT.title}</h1>
            <p className="booking-subtitle booking-subtitle-premium">{BOOKING_HERO_CONTENT.subtitle}</p>
          </div>

          <div className="booking-hero-note-inline">
            <span className="booking-hero-note-label">{BOOKING_HERO_CONTENT.noteLabel}</span>
            <strong>Tối đa {ONLINE_BOOKING_MAX_GUESTS} khách / lượt</strong>
            <p>{BOOKING_HERO_CONTENT.noteText}</p>
          </div>
        </div>
      </section>

      <section className="booking-form-section booking-form-section-premium">
        <div className="container">
          <div className="booking-layout-premium">
            <BookingSidebar
              bookingSelectionSummary={bookingSelectionSummary}
              nextStepHint={nextStepHint}
              onPrimaryAction={primaryAction}
              onSecondaryAction={secondaryAction}
              primaryActionForm={step === 3 ? 'booking-form' : undefined}
              primaryActionType={step === 3 ? 'submit' : 'button'}
              primaryCtaDisabled={step === 3 ? false : primaryCtaDisabled}
              primaryCtaLabel={primaryCtaLabel}
              secondaryCtaLabel={secondaryActionLabel}
              serviceHotline={SITE_CONTACT.phoneDisplay}
              serviceHotlineLink={SITE_CONTACT.phoneHref}
              step={step}
              submitError={step === 3 ? submitError : ''}
            />

            <div className="booking-main-premium">
              {submitted ? (
                <BookingSuccess
                  bookingCode={bookingCode}
                  bookingStatus={bookingStatus}
                  formData={formData}
                  guestCount={guestCount}
                  successHeading={successHeading}
                  successStatusLabel={successStatusLabel}
                  onGoHome={() => navigate('/')}
                  onGoProfile={() => navigate('/profile')}
                />
              ) : (
                <form id="booking-form" className="booking-shell-premium" onSubmit={handleSubmit}>
                  {draftRestored && (
                    <div className="booking-draft-banner">
                      <div>
                        <strong>{BOOKING_DRAFT_BANNER.title}</strong>
                        <p>{BOOKING_DRAFT_BANNER.description}</p>
                      </div>
                      <button type="button" className="summary-edit-btn" onClick={() => setDraftRestored(false)}>
                        {BOOKING_DRAFT_BANNER.actionLabel}
                      </button>
                    </div>
                  )}

                  <header className="booking-panel-header booking-panel-header-compact">
                    <div>
                      <p className="booking-side-kicker">Đặt bàn trực tuyến</p>
                      <h2>{BOOKING_STEP_ITEMS.find((item) => item.id === step)?.title}</h2>
                    </div>
                    <div className="booking-panel-progress booking-panel-progress-compact">{nextStepHint}</div>
                  </header>

                  {step === 1 && (
                    <BookingStepOne
                      activeBookingSection={activeBookingSection}
                      bookingOperationalRules={bookingOperationalRules}
                      availability={{
                        availabilityPanelRef,
                        firstAvailableSlotRef,
                        firstAvailableSlotTime,
                        recommendedSlotTime,
                        selectedTimeSuggestions,
                        slotGroups,
                        slotsLoading,
                      }}
                      calendar={{
                        calendarContainerRef,
                        calendarDays,
                        calendarFocusedDate,
                        calendarOpen,
                        calendarMonth,
                        canViewPreviousMonth,
                        isSelectedDateClosed,
                        isSelectedDateOutOfRange,
                        maxBookableDate,
                        openDateOptions,
                        selectedDateLabel,
                        selectedDateShort,
                        setCalendarFocusedDate,
                        todayString,
                        toggleCalendar,
                      }}
                      formData={formData}
                      guestCount={guestCount}
                      guestWarning={guestWarning}
                      handlers={{
                        handleCalendarDayKeyDown,
                        handleCalendarMonthChange,
                        handleDateInputChange,
                        handleDateSelect,
                        handleGuestSelect,
                        handleSeatingSelect,
                        handleSelectSuggestedTime,
                        handleTimeSelect,
                      }}
                      inlineErrors={inlineErrors}
                      invalidPastDate={invalidPastDate}
                      nextStepHint={nextStepHint}
                      selectedMealDurationText={selectedMealDurationText}
                      selectedSeatOperationalNote={selectedSeatOperationalNote}
                      serviceHotlineLink={SITE_CONTACT.phoneHref}
                      stepOneProgress={stepOneProgress}
                    />
                  )}

                  {step === 2 && (
                    <BookingStepTwo
                      formData={formData}
                      guestCount={guestCount}
                      inlineErrors={inlineErrors}
                      selectedMealDurationText={selectedMealDurationText}
                      onBack={() => goToStep(1)}
                      onChange={handleChange}
                      onNoteSuggestion={handleNoteSuggestion}
                    />
                  )}

                  {step === 3 && (
                    <BookingStepThree
                      formData={formData}
                      guestCount={guestCount}
                      selectedSeatOperationalNote={selectedSeatOperationalNote}
                    />
                  )}

                  <div className="booking-mobile-sticky-bar">
                    <div className="booking-mobile-sticky-meta">
                      <strong>{bookingSelectionSummary.guests}</strong>
                      <span>{bookingSelectionSummary.time}</span>
                    </div>
                    {step === 3 ? (
                      <button type="submit" className="booking-primary-btn booking-mobile-sticky-btn">
                        {primaryCtaLabel}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="booking-primary-btn booking-mobile-sticky-btn"
                        onClick={primaryAction}
                        disabled={primaryCtaDisabled}
                      >
                        {primaryCtaLabel}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookingPage
