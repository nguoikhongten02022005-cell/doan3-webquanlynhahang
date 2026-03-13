import { useMemo, useState } from 'react'
import { BOOKING_STATUS_LABELS } from '../data/bookingData'
import { AUTH_ROLES } from '../services/authService'
import {
  generateBookingCode,
  getBookingStatusHeadline,
  getBookingSubmissionStatus,
  getMealDuration,
  getPrimaryCtaLabel,
  getSeatOperationalNote,
  getStepOneErrors,
  getStepTwoErrors,
  isLargeGroupHotlineOnly,
  isValidPhoneNumber,
} from '../utils/booking'

export const useBookingSubmission = ({ createBooking, currentUser, formData, guestCount, invalidPastDate, closedDate, slotData, step }) => {
  const [submitted, setSubmitted] = useState(false)
  const [bookingCode, setBookingCode] = useState('')
  const [bookingStatus, setBookingStatus] = useState('YEU_CAU_DAT_BAN')
  const [submitError, setSubmitError] = useState('')
  const [inlineErrors, setInlineErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const step1Complete = Boolean(
    formData.guests && formData.date && formData.time && !invalidPastDate && !closedDate && !isLargeGroupHotlineOnly(guestCount),
  )
  const step2Complete = Boolean(formData.name.trim() && formData.phone.trim() && isValidPhoneNumber(formData.phone))
  const primaryCtaDisabled = isSubmitting || (step === 1 && !step1Complete) || (step === 2 && !step2Complete)

  const defaultPrimaryCtaLabel = getPrimaryCtaLabel({
    step,
    guestCount,
    date: formData.date,
    time: formData.time,
    step1Complete,
    step2Complete,
    closedDate,
    seatingArea: formData.seatingArea,
    notes: formData.notes,
  })
  const primaryCtaLabel = isSubmitting ? 'Đang gửi yêu cầu...' : defaultPrimaryCtaLabel

  const selectedSeatOperationalNote = useMemo(() => getSeatOperationalNote(formData.seatingArea), [formData.seatingArea])
  const successStatusLabel = BOOKING_STATUS_LABELS[bookingStatus] || bookingStatus
  const successHeading = getBookingStatusHeadline(bookingStatus)

  const clearFieldError = (fieldName) => {
    setInlineErrors((prev) => {
      if (!prev[fieldName]) return prev
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
  }

  const validateStepOne = () => getStepOneErrors({ guestCount, date: formData.date, time: formData.time, invalidPastDate, closedDate })
  const validateStepTwo = () => getStepTwoErrors({ name: formData.name, phone: formData.phone })

  const submitBooking = async ({ goToStep, saveDraft }) => {
    if (isSubmitting) {
      return { success: false }
    }

    setSubmitError('')

    if (formData.phone.trim()) {
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
    }

    const stepOneErrors = validateStepOne()
    const stepTwoErrors = validateStepTwo()
    const combinedErrors = { ...stepOneErrors, ...stepTwoErrors }

    if (Object.keys(combinedErrors).length > 0) {
      setInlineErrors((prev) => ({ ...prev, ...combinedErrors }))
      if (stepOneErrors.guests || stepOneErrors.date || stepOneErrors.time) goToStep(1)
      else goToStep(2)
      return { success: false }
    }

    const selectedSlot = slotData.available.find((slot) => slot.time === formData.time)
    if (!selectedSlot) {
      setInlineErrors((prev) => ({
        ...prev,
        time: 'Khung giờ đã chọn hiện không còn chỗ. Vui lòng chọn giờ khác.',
      }))
      goToStep(1)
      return { success: false }
    }

    const code = generateBookingCode()
    const submissionTime = new Date().toISOString()
    const status = getBookingSubmissionStatus({
      seatingArea: formData.seatingArea,
      guestCount,
      time: formData.time,
      notes: formData.notes,
    })

    const linkedUserEmail = currentUser?.role === AUTH_ROLES.CUSTOMER ? currentUser.email ?? null : null

    const booking = {
      guests: formData.guests,
      date: formData.date,
      time: formData.time,
      seatingArea: formData.seatingArea,
      notes: formData.notes,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      status,
      source: 'web',
      bookingCode: code,
      userEmail: linkedUserEmail,
      occasion: formData.occasion,
      confirmationChannel: formData.email ? ['SMS', 'Email'] : ['SMS'],
    }

    try {
      setIsSubmitting(true)

      const createdBooking = await createBooking({
        booking,
        confirmationPayload: {
          bookingCode: code,
          status,
          confirmationChannel: booking.confirmationChannel,
          createdAt: submissionTime,
          mealDurationMinutes: getMealDuration(guestCount, formData.time),
          sms: { to: formData.phone, sentAt: submissionTime, bookingCode: code, status },
          email: formData.email ? { to: formData.email, sentAt: submissionTime, bookingCode: code, status } : null,
        },
      })

      setBookingCode(createdBooking?.bookingCode || code)
      setBookingStatus(createdBooking?.status || status)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return { success: true }
    } catch (error) {
      setSubmitError(error?.message || 'Không thể gửi yêu cầu đặt bàn. Vui lòng thử lại.')
      return { success: false }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
    isSubmitting,
    successHeading,
    successStatusLabel,
    validateStepOne,
    validateStepTwo,
  }
}
