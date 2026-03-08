import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BOOKING_STEP_ITEMS,
} from '../data/bookingData'
import { BOOKING_DRAFT_BANNER, BOOKING_HERO_CONTENT } from '../constants/bookingUi'
import BookingSidebar from '../components/booking/BookingSidebar'
import BookingStepOne from '../components/booking/BookingStepOne'
import BookingStepTwo from '../components/booking/BookingStepTwo'
import BookingStepThree from '../components/booking/BookingStepThree'
import BookingSuccess from '../components/booking/BookingSuccess'
import { useAuth } from '../hooks/useAuth'
import { useBooking } from '../hooks/useBooking'
import { useBookingForm } from '../hooks/useBookingForm'
import {
  ONLINE_BOOKING_MAX_GUESTS,
} from '../utils/booking'

const SERVICE_HOTLINE = '(028) 3825 6789'
const SERVICE_HOTLINE_LINK = 'tel:02838256789'

function BookingPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { createBooking, getDraft, saveDraft } = useBooking()
  const {
    availabilityPanelRef,
    bookingCode,
    bookingOperationalRules,
    bookingStatus,
    calendarContainerRef,
    calendarDays,
    calendarFocusedDate,
    calendarOpen,
    calendarMonth,
    canViewPreviousMonth,
    closedDate,
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
    nextOpenDate,
    openDateOptions,
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
    submitError,
    submitted,
    successHeading,
    successStatusLabel,
    todayString,
    toggleCalendar,
  } = useBookingForm({ currentUser, createBooking, getDraft, saveDraft })

  return (
    <div className="booking-page">
      <section className="booking-hero booking-hero-premium">
        <div className="container booking-hero-shell">
          <div className="booking-hero-copy">
            <span className="booking-label">{BOOKING_HERO_CONTENT.label}</span>
            <h1 className="booking-title booking-title-premium">
              {BOOKING_HERO_CONTENT.title}
            </h1>
            <p className="booking-subtitle booking-subtitle-premium">
              {BOOKING_HERO_CONTENT.subtitle}
            </p>
          </div>

          <div className="booking-hero-aside">
            <div className="booking-hero-note-card">
              <span className="booking-hero-note-label">{BOOKING_HERO_CONTENT.noteLabel}</span>
              <strong>Tối đa {ONLINE_BOOKING_MAX_GUESTS} khách / lượt</strong>
              <p>{BOOKING_HERO_CONTENT.noteText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-form-section booking-form-section-premium">
        <div className="container">
          <div className="booking-layout-premium">
            <BookingSidebar step={step} serviceHotline={SERVICE_HOTLINE} />

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
                <form className="booking-shell-premium" onSubmit={handleSubmit}>
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

                  <header className="booking-panel-header">
                    <div>
                      <p className="booking-side-kicker">Đặt bàn trực tuyến</p>
                      <h2>{STEP_ITEMS.find((item) => item.id === step)?.title}</h2>
                    </div>
                    <div className="booking-panel-progress">Bước {step}/3</div>
                  </header>

                  {step === 1 && (
                    <BookingStepOne
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
                        nextOpenDate,
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
                        handleStepOneContinue,
                        handleTimeSelect,
                      }}
                      inlineErrors={inlineErrors}
                      invalidPastDate={invalidPastDate}
                      primaryCtaLabel={primaryCtaLabel}
                      selectedMealDurationText={selectedMealDurationText}
                      selectedSeatOperationalNote={selectedSeatOperationalNote}
                      serviceHotlineLink={SERVICE_HOTLINE_LINK}
                    />
                  )}

                  {step === 2 && (
                    <BookingStepTwo
                      formData={formData}
                      guestCount={guestCount}
                      inlineErrors={inlineErrors}
                      primaryCtaLabel={primaryCtaLabel}
                      selectedMealDurationText={selectedMealDurationText}
                      onBack={() => goToStep(1)}
                      onChange={handleChange}
                      onContinue={handleStepTwoContinue}
                      onNoteSuggestion={handleNoteSuggestion}
                    />
                  )}

                  {step === 3 && (
                    <BookingStepThree
                      formData={formData}
                      guestCount={guestCount}
                      primaryCtaLabel={primaryCtaLabel}
                      selectedSeatOperationalNote={selectedSeatOperationalNote}
                      submitError={submitError}
                      onBack={() => goToStep(2)}
                    />
                  )}
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
