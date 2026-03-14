import { useNavigate } from 'react-router-dom'
import { CAC_BUOC_DAT_BAN } from '../data/duLieuDatBan'
import { BOOKING_DRAFT_BANNER, BOOKING_HERO_CONTENT } from '../constants/giaoDienDatBan'
import { SITE_CONTACT } from '../constants/lienHeTrang'
import ThanhBenDatBan from '../components/datBan/ThanhBenDatBan'
import BuocMotDatBan from '../components/datBan/BuocMotDatBan'
import BuocHaiDatBan from '../components/datBan/BuocHaiDatBan'
import BuocBaDatBan from '../components/datBan/BuocBaDatBan'
import DatBanThanhCong from '../components/datBan/DatBanThanhCong'
import { useXacThuc } from '../hooks/useXacThuc'
import { useDatBan } from '../hooks/useDatBan'
import { useFormDatBan } from '../hooks/useFormDatBan'
import { SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN } from '../utils/datBan/index'

function DatBanPage() {
  const navigate = useNavigate()
  const { nguoiDungHienTai } = useXacThuc()
  const { taoDatBan, layBanNhapTam, luuBanNhapTam } = useDatBan()
  const {
    activeBookingSection,
    availabilityPanelRef,
    bookingCode,
    dateSectionRef,
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
    isSubmitting,
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
  } = useFormDatBan({ nguoiDungHienTai, createBooking: taoDatBan, getDraft: layBanNhapTam, saveDraft: luuBanNhapTam })

  const secondaryAction = step > 1 ? () => goToStep(step - 1) : null
  const secondaryActionLabel = step === 2 ? 'Quay lại bước chọn bàn' : step === 3 ? 'Quay lại chỉnh sửa' : ''
  const primaryAction = step === 1 ? handleStepOneContinue : step === 2 ? handleStepTwoContinue : handleSubmit

  return (
    <div className="booking-page booking-page-fullbleed">
      <section className="booking-hero booking-hero-premium booking-hero-premium-tight">
        <div className="booking-hero-shell booking-hero-shell-full">
          <div className="booking-hero-copy booking-hero-copy-compact">
            <span className="booking-label">{BOOKING_HERO_CONTENT.label}</span>
            <h1 className="booking-title booking-title-premium">Đặt bàn tinh gọn cho một buổi dùng bữa chỉn chu</h1>
            <p className="booking-subtitle booking-subtitle-premium">Chọn số khách, ngày và khung giờ trong trải nghiệm đặt chỗ nhẹ nhàng, rõ ràng và đúng nhịp của một nhà hàng.</p>
          </div>

          <div className="booking-hero-note-inline booking-hero-note-panel">
            <div>
              <span className="booking-hero-note-label">{BOOKING_HERO_CONTENT.noteLabel}</span>
              <strong>Tối đa {SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN} khách / lượt</strong>
            </div>
            <p>{BOOKING_HERO_CONTENT.noteText}</p>
          </div>
        </div>
      </section>

      <section className="booking-form-section booking-form-section-premium">
        <div className="booking-layout-premium booking-layout-premium-full">
          <ThanhBenDatBan
            bookingSelectionSummary={bookingSelectionSummary}
            onPrimaryAction={primaryAction}
            onSecondaryAction={secondaryAction}
            primaryActionType="button"
            primaryCtaDisabled={step === 3 ? isSubmitting : primaryCtaDisabled}
            primaryCtaLabel={primaryCtaLabel}
            secondaryCtaLabel={secondaryActionLabel}
            serviceHotline={SITE_CONTACT.phoneDisplay}
            serviceHotlineLink={SITE_CONTACT.phoneHref}
            step={step}
            submitError={step === 3 ? submitError : ''}
          />

          <div className="booking-main-premium">
              {submitted ? (
                <DatBanThanhCong
                  bookingCode={bookingCode}
                  bookingStatus={bookingStatus}
                  formData={formData}
                  guestCount={guestCount}
                  successHeading={successHeading}
                  successStatusLabel={successStatusLabel}
                  onGoHome={() => navigate('/')}
                  onGoProfile={() => navigate('/ho-so')}
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
                      <h2>{CAC_BUOC_DAT_BAN.find((item) => item.id === step)?.title}</h2>
                    </div>
                    <div className="booking-panel-progress booking-panel-progress-compact">{nextStepHint}</div>
                  </header>

                  {step === 1 && (
                    <BuocMotDatBan
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
                        dateSectionRef,
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
                      selectedMealDurationText={selectedMealDurationText}
                      selectedSeatOperationalNote={selectedSeatOperationalNote}
                      serviceHotlineLink={SITE_CONTACT.phoneHref}
                      stepOneProgress={stepOneProgress}
                    />
                  )}

                  {step === 2 && (
                    <BuocHaiDatBan
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
                    <BuocBaDatBan
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
                    <button
                      type="button"
                      className="booking-primary-btn booking-mobile-sticky-btn"
                      onClick={primaryAction}
                      disabled={step === 3 ? isSubmitting : primaryCtaDisabled}
                    >
                      {primaryCtaLabel}
                    </button>
                  </div>
                </form>
              )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default DatBanPage
