import { useEffect } from 'react'
import { CAC_KHU_VUC_DAT_BAN } from '../data/duLieuDatBan'
import {
  GOI_Y_NGAY_DONG_CUA,
  SO_KHACH_NHOM_DONG,
  THONG_DIEP_HOTLINE_NHOM_DONG,
  dinhDangNgayHienThi,
  laNgayDongCua,
  laNhomDongChiDatQuaHotline,
} from '../utils/datBan/index'
import { useKhaDungDatBan } from './useKhaDungDatBan'
import { useLichDatBan } from './useLichDatBan'
import { useTrangThaiFormDatBan } from './useTrangThaiFormDatBan'
import { useGuiDatBan } from './useGuiDatBan'

export const useFormDatBan = ({ nguoiDungHienTai, createBooking, getDraft, saveDraft }) => {
  const {
    activeBookingSection,
    bookingSelectionSummary,
    closedDate,
    dateSectionRef,
    draftRestored,
    formData,
    restoredDraft,
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
  } = useTrangThaiFormDatBan({ nguoiDungHienTai, getDraft })

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
  } = useKhaDungDatBan({ closedDate, formData, guestCount, invalidPastDate, laNhomDongChiDatQuaHotline })

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
  } = useLichDatBan({
    selectedDate: formData.date,
    onDateSelect: (value) => applyDateSelection(value, closeCalendar),
  })

  const {
    bookingCode,
    bookingStatus,
    clearFieldError,
    inlineErrors,
    isSubmitting,
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
  } = useGuiDatBan({ createBooking, nguoiDungHienTai, formData, guestCount, invalidPastDate, closedDate, slotData, step })

  function applyDateSelection(value, closeCalendarHandler) {
    setSubmitError('')
    clearFieldError('date')
    clearFieldError('time')

    if (!value) {
      setFormData((prev) => ({ ...prev, date: '', time: '', seatingArea: 'KHONG_UU_TIEN' }))
      return
    }

    if (value < todayString || value > maxBookableDate || laNgayDongCua(value)) {
      setInlineErrors((prev) => ({
        ...prev,
        date: value > maxBookableDate ? `Hiện chỉ mở nhận bàn đến ${dinhDangNgayHienThi(maxBookableDate)}.` : GOI_Y_NGAY_DONG_CUA,
      }))
      return
    }

    requestScrollToAvailability()
    requestFocusFirstSlot()
    setFormData((prev) => ({ ...prev, date: value, time: '', seatingArea: 'KHONG_UU_TIEN' }))
    closeCalendarHandler?.()
  }

  useEffect(() => {
    if (!restoredDraft) {
      return
    }

    setDraftRestored(true)

    if (restoredDraft.guests && restoredDraft.date && restoredDraft.time) {
      setStep(2)
    }
  }, [restoredDraft, setDraftRestored, setStep])

  useEffect(() => {
    if (!formData.time || slotsLoading) {
      return
    }

    const stillAvailable = slotData.available.some((slot) => slot.time === formData.time)
    if (stillAvailable) {
      return
    }

    const suggestions = selectedTimeSuggestions
    setFormData((prev) => ({ ...prev, time: '' }))
    setInlineErrors((prev) => ({
      ...prev,
      time: suggestions.length > 0
        ? `Khung giờ ${formData.time} hiện không còn chỗ. Gợi ý: ${suggestions.join(', ')}.`
        : `Khung giờ ${formData.time} hiện không còn chỗ. Vui lòng chọn giờ khác.`,
    }))

    if (step > 1) {
      setStep(1)
    }
  }, [formData.time, selectedTimeSuggestions, setFormData, setInlineErrors, setStep, slotData, slotsLoading, step])

  useEffect(() => {
    if (submitted || isSubmitting || !formData.phone.trim()) {
      return
    }

    const timeoutId = window.setTimeout(() => {
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
      })
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [formData, isSubmitting, saveDraft, submitted])

  const handleChange = (event) => {
    const { name, value } = event.target
    setSubmitError('')
    clearFieldError(name)

    setFormData((prev) => {
      const next = { ...prev, [name]: value }

      if (name === 'date' || name === 'guests') next.time = ''
      if (name === 'date') next.seatingArea = 'KHONG_UU_TIEN'

      if (name === 'guests' && prev.seatingArea) {
        const selectedArea = CAC_KHU_VUC_DAT_BAN.find((item) => item.value === prev.seatingArea)
        if (selectedArea && Number(value) > selectedArea.maxGuests) {
          next.seatingArea = 'KHONG_UU_TIEN'
        }
      }

      return next
    })
  }

  const handleGuestSelect = (value) => {
    const normalizedValue = value === '10+' ? SO_KHACH_NHOM_DONG : value
    setSubmitError('')
    setInlineErrors((prev) => ({ ...prev, guests: '', time: '' }))

    setFormData((prev) => {
      const selectedArea = CAC_KHU_VUC_DAT_BAN.find((item) => item.value === prev.seatingArea)
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
    applyDateSelection(value, closeCalendar)
  }

  const handleDateInputChange = (event) => {
    applyDateSelection(event.target.value, closeCalendar)
  }

  const handleNoteSuggestion = (suggestion) => {
    setFormData((prev) => {
      const currentNotes = prev.notes.trim()
      const exists = currentNotes.toLowerCase().includes(suggestion.toLowerCase())
      if (exists) {
        return prev
      }

      return {
        ...prev,
        notes: currentNotes ? `${currentNotes}; ${suggestion}` : suggestion,
      }
    })
  }

  const handleTimeSelect = (slot) => {
    if (slot.status === 'full') {
      return
    }

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
    const area = CAC_KHU_VUC_DAT_BAN.find((item) => item.value === areaValue)
    if (!area || guestCount > area.maxGuests) {
      return
    }

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
      if (errors.guests && laNhomDongChiDatQuaHotline(guestCount)) {
        setSubmitError(THONG_DIEP_HOTLINE_NHOM_DONG)
      }
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
    isSubmitting,
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
