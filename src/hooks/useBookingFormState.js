import { useMemo, useRef, useState } from 'react'
import { AUTH_ROLES } from '../services/authService'
import {
  LARGE_GROUP_HOTLINE_MESSAGE,
  ONLINE_BOOKING_MAX_GUESTS,
  formatDateDisplay,
  getLocalDateString,
  getSeatSummaryText,
  isClosedDate,
  isLargeGroupHotlineOnly,
  isValidPhoneNumber,
} from '../utils/booking'

export const useBookingFormState = ({ currentUser, getDraft }) => {
  const [step, setStep] = useState(1)
  const [draftRestored, setDraftRestored] = useState(false)
  const dateSectionRef = useRef(null)
  const customerIdentity = currentUser?.role === AUTH_ROLES.CUSTOMER ? currentUser : null
  const [formData, setFormData] = useState(() => {
    const draftData = getDraft()

    return {
      guests: String(draftData?.guests ?? ''),
      date: String(draftData?.date ?? ''),
      time: String(draftData?.time ?? ''),
      seatingArea: String(draftData?.seatingArea ?? 'KHONG_UU_TIEN'),
      occasion: String(draftData?.occasion ?? ''),
      notes: String(draftData?.notes ?? ''),
      name: String(draftData?.name ?? customerIdentity?.fullName ?? customerIdentity?.name ?? ''),
      phone: String(draftData?.phone ?? customerIdentity?.phone ?? ''),
      email: String(draftData?.email ?? customerIdentity?.email ?? ''),
    }
  })
  const restoredDraft = useMemo(() => getDraft(), [getDraft])

  const guestCount = Number(formData.guests) || 0
  const todayString = useMemo(() => getLocalDateString(), [])
  const invalidPastDate = Boolean(formData.date && formData.date < todayString)
  const closedDate = Boolean(formData.date && isClosedDate(formData.date))

  const bookingSelectionSummary = useMemo(() => ({
    guests: guestCount ? `${guestCount} khách` : 'Chưa chọn số khách',
    date: formData.date ? formatDateDisplay(formData.date) : 'Chưa chọn ngày',
    time: formData.time || 'Chưa chọn giờ',
    seatingArea: formData.time ? getSeatSummaryText(formData.seatingArea) : 'Chưa chọn khu vực',
  }), [formData.date, formData.seatingArea, formData.time, guestCount])

  const stepOneProgress = useMemo(() => ({
    hasGuests: Boolean(guestCount),
    hasDate: Boolean(formData.date && !invalidPastDate && !closedDate),
    hasTime: Boolean(formData.time),
    hasSeating: Boolean(formData.time && formData.seatingArea),
  }), [closedDate, formData.date, formData.seatingArea, formData.time, guestCount, invalidPastDate])

  const guestWarning = useMemo(() => {
    if (guestCount === ONLINE_BOOKING_MAX_GUESTS) return 'Nhóm 10 khách có thể cần host gọi lại để xác nhận cách xếp bàn.'
    if (guestCount >= 6) return 'Nhóm từ 6 khách nên đặt sớm để ưu tiên bàn phù hợp hơn.'
    return ''
  }, [guestCount])

  const nextStepHint = useMemo(() => {
    if (step === 1) {
      if (!stepOneProgress.hasGuests) return 'Chọn số khách để bắt đầu.'
      if (isLargeGroupHotlineOnly(guestCount)) return LARGE_GROUP_HOTLINE_MESSAGE
      if (!stepOneProgress.hasDate) return 'Chọn ngày dùng bữa để mở danh sách khung giờ phục vụ.'
      if (!stepOneProgress.hasTime) return 'Chọn khung giờ phù hợp trước khi tiếp tục.'
      return 'Bạn có thể tiếp tục sang bước nhập thông tin liên hệ.'
    }

    if (step === 2) {
      if (!formData.name.trim() || !formData.phone.trim() || !isValidPhoneNumber(formData.phone)) {
        return 'Điền đủ họ tên và số điện thoại để tiếp tục xác nhận booking.'
      }
      return 'Kiểm tra lại thông tin và chuyển sang bước xác nhận cuối.'
    }

    return 'Kiểm tra lại toàn bộ thông tin rồi gửi yêu cầu đặt bàn.'
  }, [formData.name, formData.phone, guestCount, step, stepOneProgress])

  const activeBookingSection = useMemo(() => {
    if (!stepOneProgress.hasGuests) return 'guests'
    if (!stepOneProgress.hasDate) return 'date'
    if (!stepOneProgress.hasTime) return 'time'
    if (!stepOneProgress.hasSeating) return 'seating'
    return 'contact'
  }, [stepOneProgress])

  return {
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
  }
}
