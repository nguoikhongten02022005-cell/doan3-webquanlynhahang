import { useNavigate } from 'react-router-dom'
import { CAC_BUOC_DAT_BAN } from '../data/duLieuDatBan'
import { BANG_THONG_BAO_BAN_NHAP_TAM_DAT_BAN } from '../constants/giaoDienDatBan'
import { SITE_CONTACT } from '../constants/lienHeTrang'
import ThanhBenDatBan from '../components/datBan/ThanhBenDatBan'
import BuocMotDatBan from '../components/datBan/BuocMotDatBan'
import BuocHaiDatBan from '../components/datBan/BuocHaiDatBan'
import BuocBaDatBan from '../components/datBan/BuocBaDatBan'
import DatBanThanhCong from '../components/datBan/DatBanThanhCong'
import { useXacThuc } from '../hooks/useXacThuc'
import { useDatBan } from '../hooks/useDatBan'
import { useFormDatBan } from '../hooks/useFormDatBan'

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
    soLuongKhach,
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
    <div className="dat-ban-page dat-ban-page-fullbleed">
      <section className="dat-ban-form-section dat-ban-form-section-premium">
        <div className="dat-ban-layout-premium dat-ban-layout-premium-full">
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

          <div className="dat-ban-main-premium">
              {submitted ? (
                <DatBanThanhCong
                  bookingCode={bookingCode}
                  bookingStatus={bookingStatus}
                  formData={formData}
                  soLuongKhach={soLuongKhach}
                  successHeading={successHeading}
                  successStatusLabel={successStatusLabel}
                  onGoHome={() => navigate('/')}
                  onGoProfile={() => navigate('/ho-so')}
                />
              ) : (
                <form id="dat-ban-form" className="dat-ban-shell-premium" onSubmit={handleSubmit}>
                  {draftRestored && (
                    <div className="dat-ban-draft-banner">
                      <div>
                        <strong>{BANG_THONG_BAO_BAN_NHAP_TAM_DAT_BAN.title}</strong>
                        <p>{BANG_THONG_BAO_BAN_NHAP_TAM_DAT_BAN.description}</p>
                      </div>
                      <button type="button" className="tom-tat-edit-btn" onClick={() => setDraftRestored(false)}>
                        {BANG_THONG_BAO_BAN_NHAP_TAM_DAT_BAN.actionLabel}
                      </button>
                    </div>
                  )}

                  <header className="dat-ban-panel-header dat-ban-panel-header-compact">
                    <div>
                      <p className="dat-ban-side-kicker">Đặt bàn trực tuyến</p>
                      <h2>{CAC_BUOC_DAT_BAN.find((item) => item.id === step)?.title}</h2>
                    </div>
                    <div className="dat-ban-panel-progress dat-ban-panel-progress-compact">{nextStepHint}</div>
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
                      soLuongKhach={soLuongKhach}
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
                      soLuongKhach={soLuongKhach}
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
                      soLuongKhach={soLuongKhach}
                      selectedSeatOperationalNote={selectedSeatOperationalNote}
                    />
                  )}

                  <div className="dat-ban-mobile-sticky-bar">
                    <div className="dat-ban-mobile-sticky-meta">
                      <strong>{bookingSelectionSummary.guests}</strong>
                      <span>{bookingSelectionSummary.time}</span>
                    </div>
                    <button
                      type="button"
                      className="dat-ban-primary-btn dat-ban-mobile-sticky-btn"
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
