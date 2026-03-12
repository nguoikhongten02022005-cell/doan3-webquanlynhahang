import { useEffect } from 'react'
import { BOOKING_SEATING_AREAS } from '../data/bookingData'
import {
  CLOSED_DATE_HINT,
  LARGE_GROUP_GUEST_COUNT,
  LARGE_GROUP_HOTLINE_MESSAGE,
  formatDateDisplay,
  isClosedDate,
  isLargeGroupHotlineOnly,
} from '../utils/booking'
import { useBookingAvailability } from './useBookingAvailability'
import { useBookingCalendar } from './useBookingCalendar'
import { useBookingFormState } from './useBookingFormState'
import { useBookingSubmission } from './useBookingSubmission'

export const useBookingForm = ({ currentUser, createBooking, getDraft, saveDraft }) => {
  const {
    activeBookingSection,
    bookingSelectionSummary,
    closedDate,
    dateSectionRef,
    draftRestored,
    formData,
    guestCount,
    guestWarning,
    invalidPastDate,
    nextStepHint,
    setDraftRestored,
    setFormData,
    setStep,
    step,
    stepOneProgress,
    todayString,
  } = useBookingFormState({ currentUser, getDraft })

  const {
    availabilityPanelRef,
    bookingOperationalRules,
    firstAvailableSlotRef,
    firstAvailableSlotTime,
    recommendedSlotTime,
    requestFocusFirstSlot,
    requestScrollToAvailability,
    selectedMealDurationText,
    selectedTimeSuggestions,
    slotData,
    slotGroups,
    slotsLoading,
  } = useBookingAvailability({ closedDate, formData, guestCount, invalidPastDate, isLargeGroupHotlineOnly })

  const {
    bookingCode,
    bookingStatus,
    clearFieldError,
    inlineErrors,
    primaryCtaDisabled,
    primaryCtaLabel,
    selectedSeatOperationalNote,
    setInlineErrors,
    setSubmitError,
    step1Complete,
    step2Complete,
    submitBooking,
    submitError,
    submitted,
    successHeading,
    successStatusLabel,
    validateStepOne,
    validateStepTwo,
  } = useBookingSubmission({ createBooking, currentUser, formData, guestCount, invalidPastDate, closedDate, slotData, step })

  const {
    calendarContainerRef,
    calendarDays,
    calendarFocusedDate,
    calendarMonth,
    calendarOpen,
    canViewPreviousMonth,
    closeCalendar,
    handleCalendarDayKeyDown,
    handleCalendarMonthChange,
    isSelectedDateClosed,
    isSelectedDateOutOfRange,
    maxBookableDate,
    nextOpenDate,
    openDateOptions,
    selectedDateLabel,
    selectedDateShort,
    setCalendarFocusedDate,
    toggleCalendar,
  } = useBookingCalendar({
    selectedDate: formData.date,
    onDateSelect: (value) => {
      setSubmitError('')
      clearFieldError('date')
      clearFieldError('time')

      if (!value) {
        setFormData((prev) => ({ ...prev, date: '', time: '', seatingArea: 'KHONG_UU_TIEN' }))
        return
      }

      if (value < todayString || value > maxBookableDate || isClosedDate(value)) {
        setInlineErrors((prev) => ({
          ...prev,
          date: value > maxBookableDate ? `Hiện chỉ mở nhận bàn đến ${formatDateDisplay(maxBookableDate)}.` : CLOSED_DATE_HINT,
        }))
        return
      }

      requestScrollToAvailability()
      requestFocusFirstSlot()
      setFormData((prev) => ({ ...prev, date: value, time: '', seatingArea: 'KHONG_UU_TIEN' }))
      closeCalendar()
    },
  })

  useEffect(() => {
    const draftData = getDraft()
    if (!draftData) return

    setDraftRestored(true)

    if (draftData?.guests && draftData?.date && draftData?.time) {
      setStep(2)
    }
  }, [getDraft, setDraftRestored, setStep])

  useEffect(() => {
    if (!formData.time || slotsLoading) return

    const stillAvailable = slotData.available.some((slot) => slot.time === formData.time)
    if (stillAvailable) return

    const suggestions = selectedTimeSuggestions
    setFormData((prev) => ({ ...prev, time: '' }))
    setInlineErrors((prev) => ({
      ...prev,
      time: suggestions.length > 0
        ? `Khung giờ ${formData.time} hiện không còn chỗ. Gợi ý: ${suggestions.join(', ')}.`
        : `Khung giờ ${formData.time} hiện không còn chỗ. Vui lòng chọn giờ khác.`,
    }))
    if (step > 1) setStep(1)
  }, [formData.time, selectedTimeSuggestions, setFormData, setInlineErrors, setStep, slotData, slotsLoading, step])

  useEffect(() => {
    if (submitted) return
    if (!formData.phone.trim()) return

    saveDraft({
      guests: formData.guests,
      date: formData.date,
      time: formData.time,
      seatingArea: formData.seatingArea,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
      occasion: formData.occasion,
      updatedAt: new Date().toISOString(),
    })
  }, [formData, saveDraft, submitted])

  const handleChange = (event) => {
    const { name, value } = event.target
    setSubmitError('')
    clearFieldError(name)

    setFormData((prev) => {
      const next = { ...prev, [name]: value }

      if (name === 'date' || name === 'guests') next.time = ''
      if (name === 'date') next.seatingArea = 'KHONG_UU_TIEN'

      if (name === 'guests' && prev.seatingArea) {
        const selectedArea = BOOKING_SEATING_AREAS.find((item) => item.value === prev.seatingArea)
        if (selectedArea && Number(value) > selectedArea.maxGuests) {
          next.seatingArea = 'KHONG_UU_TIEN'
        }
      }

      return next
    })
  }

  const handleGuestSelect = (value) => {
    const normalizedValue = value === '10+' ? LARGE_GROUP_GUEST_COUNT : value
    setSubmitError('')
    setInlineErrors((prev) => ({ ...prev, guests: '', time: '' }))

    setFormData((prev) => {
      const selectedArea = BOOKING_SEATING_AREAS.find((item) => item.value === prev.seatingArea)
      return {
        ...prev,
        guests: String(normalizedValue),
        time: '',
        seatingArea: selectedArea && normalizedValue > selectedArea.maxGuests ? 'KHONG_UU_TIEN' : prev.seatingArea,
      }
    })

    window.requestAnimationFrame(() => {
      dateSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleDateSelect = (value) => {
    setSubmitError('')
    clearFieldError('date')
    clearFieldError('time')

    if (!value) {
      setFormData((prev) => ({ ...prev, date: '', time: '', seatingArea: 'KHONG_UU_TIEN' }))
      return
    }

    if (value < todayString || value > maxBookableDate || isClosedDate(value)) {
      setInlineErrors((prev) => ({
        ...prev,
        date: value > maxBookableDate ? `Hiện chỉ mở nhận bàn đến ${formatDateDisplay(maxBookableDate)}.` : CLOSED_DATE_HINT,
      }))
      return
    }

    requestScrollToAvailability()
    requestFocusFirstSlot()
    setFormData((prev) => ({ ...prev, date: value, time: '', seatingArea: 'KHONG_UU_TIEN' }))
    closeCalendar()
  }

  const handleDateInputChange = (event) => {
    handleDateSelect(event.target.value)
  }

  const handleNoteSuggestion = (suggestion) => {
    setFormData((prev) => {
      const currentNotes = prev.notes.trim()
      const exists = currentNotes.toLowerCase().includes(suggestion.toLowerCase())
      if (exists) return prev

      return {
        ...prev,
        notes: currentNotes ? `${currentNotes}; ${suggestion}` : suggestion,
      }
    })
  }

  const handleTimeSelect = (slot) => {
    if (slot.status === 'full') return
    setSubmitError('')
    clearFieldError('time')
    setFormData((prev) => ({
      ...prev,
      time: prev.time === slot.time ? '' : slot.time,
      seatingArea: prev.time === slot.time ? 'KHONG_UU_TIEN' : prev.seatingArea,
    }))
  }

  const handleSelectSuggestedTime = (timeValue) => {
    setSubmitError('')
    clearFieldError('time')
    setFormData((prev) => ({ ...prev, time: timeValue, seatingArea: 'KHONG_UU_TIEN' }))
  }

  const handleSeatingSelect = (areaValue) => {
    const area = BOOKING_SEATING_AREAS.find((item) => item.value === areaValue)
    if (!area || guestCount > area.maxGuests) return
    setFormData((prev) => ({ ...prev, seatingArea: areaValue }))
  }

  const goToStep = (nextStep) => {
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepOneContinue = () => {
    const errors = validateStepOne()

    if (Object.keys(errors).length > 0) {
      setInlineErrors((prev) => ({ ...prev, ...errors }))
      if (errors.guests && isLargeGroupHotlineOnly(guestCount)) setSubmitError(LARGE_GROUP_HOTLINE_MESSAGE)
      return
    }

    goToStep(2)
  }

  const handleStepTwoContinue = () => {
    const errors = validateStepTwo()
    if (Object.keys(errors).length > 0) {
      setInlineErrors((prev) => ({ ...prev, ...errors }))
      return
    }

    goToStep(3)
  }

  const handleSubmit = async (event) => {
    event?.preventDefault?.()
    await submitBooking({ goToStep, saveDraft })
  }

  return {
    availabilityPanelRef,
    calendarContainerRef,
    dateSectionRef,
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
    activeBookingSection,
    bookingSelectionSummary,
    primaryCtaDisabled,
    primaryCtaLabel,
    recommendedSlotTime,
    selectedDateLabel,
    selectedDateShort,
    selectedSeatOperationalNote,
    selectedTimeSuggestions,
    selectedMealDurationText,
    setCalendarFocusedDate,
    setDraftRestored,
    slotData,
    slotGroups,
    slotsLoading,
    step,
    step1Complete,
    step2Complete,
    stepOneProgress,
    submitError,
    submitted,
    successHeading,
    successStatusLabel,
    bookingCode,
    bookingOperationalRules,
    bookingStatus,
    todayString,
    toggleCalendar,
    goToStep,
    nextStepHint,
  }
}
