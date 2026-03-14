import { useMemo, useState } from 'react'
import { NHAN_TRANG_THAI_DAT_BAN } from '../data/duLieuDatBan'
import { VAI_TRO_XAC_THUC } from '../services/dichVuXacThuc'
import {
  taoMaDatBan,
  layTieuDeTrangThaiDatBan,
  layTrangThaiGuiDatBan,
  layThoiLuongBuaAn,
  layNhanHanhDongChinh,
  layGhiChuVanHanhChoNgoi,
  layLoiBuocMot,
  layLoiBuocHai,
  laNhomDongChiDatQuaHotline,
  laSoDienThoaiHopLe,
} from '../utils/datBan/index'

export const useGuiDatBan = ({ createBooking, nguoiDungHienTai, formData, guestCount, invalidPastDate, closedDate, slotData, step }) => {
  const [submitted, setSubmitted] = useState(false)
  const [bookingCode, setBookingCode] = useState('')
  const [bookingStatus, setBookingStatus] = useState('YEU_CAU_DAT_BAN')
  const [submitError, setSubmitError] = useState('')
  const [inlineErrors, setInlineErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const step1Complete = Boolean(
    formData.guests && formData.date && formData.time && !invalidPastDate && !closedDate && !laNhomDongChiDatQuaHotline(guestCount),
  )
  const step2Complete = Boolean(formData.name.trim() && formData.phone.trim() && laSoDienThoaiHopLe(formData.phone))
  const primaryCtaDisabled = isSubmitting || (step === 1 && !step1Complete) || (step === 2 && !step2Complete)

  const defaultPrimaryCtaLabel = layNhanHanhDongChinh({
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

  const selectedSeatOperationalNote = useMemo(() => layGhiChuVanHanhChoNgoi(formData.seatingArea), [formData.seatingArea])
  const successStatusLabel = NHAN_TRANG_THAI_DAT_BAN[bookingStatus] || bookingStatus
  const successHeading = layTieuDeTrangThaiDatBan(bookingStatus)

  const clearFieldError = (fieldName) => {
    setInlineErrors((prev) => {
      if (!prev[fieldName]) return prev
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
  }

  const validateStepOne = () => layLoiBuocMot({ guestCount, date: formData.date, time: formData.time, invalidPastDate, closedDate })
  const validateStepTwo = () => layLoiBuocHai({ name: formData.name, phone: formData.phone })

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

    const code = taoMaDatBan()
    const submissionTime = new Date().toISOString()
    const trangThai = layTrangThaiGuiDatBan({
      seatingArea: formData.seatingArea,
      guestCount,
      time: formData.time,
      notes: formData.notes,
    })

    const linkedUserEmail = nguoiDungHienTai?.role === VAI_TRO_XAC_THUC.KHACH_HANG ? nguoiDungHienTai.email ?? null : null

    const duLieuDatBan = {
      guests: formData.guests,
      date: formData.date,
      time: formData.time,
      seatingArea: formData.seatingArea,
      notes: formData.notes,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      status: trangThai,
      source: 'web',
      bookingCode: code,
      userEmail: linkedUserEmail,
      occasion: formData.occasion,
      confirmationChannel: formData.email ? ['SMS', 'Email'] : ['SMS'],
    }

    try {
      setIsSubmitting(true)

      const datBanDaTao = await createBooking({
        booking: duLieuDatBan,
        confirmationPayload: {
          bookingCode: code,
          status: trangThai,
          confirmationChannel: duLieuDatBan.confirmationChannel,
          createdAt: submissionTime,
          mealDurationMinutes: layThoiLuongBuaAn(guestCount, formData.time),
          sms: { to: formData.phone, sentAt: submissionTime, bookingCode: code, status: trangThai },
          email: formData.email ? { to: formData.email, sentAt: submissionTime, bookingCode: code, status: trangThai } : null,
        },
      })

      setBookingCode(datBanDaTao?.bookingCode || code)
      setBookingStatus(datBanDaTao?.status || trangThai)
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
