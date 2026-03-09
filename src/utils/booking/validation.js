import { CLOSED_DATE_HINT, INVALID_DATE_HINT, LARGE_GROUP_HOTLINE_MESSAGE } from './constants'
import { getBookingSubmissionStatus, isLargeGroupHotlineOnly } from './submission'

const normalizePhone = (value) => value.replace(/\s+/g, '').replace(/[^\d+]/g, '')

export const isValidPhoneNumber = (value) => /^(0\d{9,10}|\+84\d{9,10})$/.test(normalizePhone(value))

export const getStepOneErrors = ({ guestCount, date, time, invalidPastDate, closedDate }) => {
  const errors = {}

  if (!guestCount) {
    errors.guests = 'Vui lòng chọn số khách'
    return errors
  }

  if (isLargeGroupHotlineOnly(guestCount)) {
    errors.guests = LARGE_GROUP_HOTLINE_MESSAGE
    return errors
  }

  if (!date) errors.date = 'Vui lòng chọn ngày'
  else if (invalidPastDate) errors.date = INVALID_DATE_HINT
  else if (closedDate) errors.date = CLOSED_DATE_HINT

  if (!time) errors.time = 'Vui lòng chọn khung giờ'

  return errors
}

export const getStepTwoErrors = ({ name, phone }) => {
  const errors = {}

  if (!name.trim()) errors.name = 'Vui lòng nhập họ và tên'
  if (!phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại'
  else if (!isValidPhoneNumber(phone)) errors.phone = 'Số điện thoại chưa đúng định dạng'

  return errors
}

export const getPrimaryCtaLabel = ({ step, guestCount, date, time, step1Complete, step2Complete, closedDate, seatingArea, notes }) => {
  if (step === 1) {
    if (!guestCount) return 'Chọn số khách'
    if (isLargeGroupHotlineOnly(guestCount)) return 'Gọi hotline để đặt nhóm đông'
    if (!date) return 'Chọn ngày'
    if (closedDate) return 'Vui lòng chọn ngày khác'
    if (!time) return 'Chọn giờ'
    if (step1Complete) return 'Tiếp tục nhập thông tin liên hệ'
  }

  if (step === 2) {
    if (step2Complete) return 'Xem lại thông tin đặt bàn'
    return 'Hoàn tất thông tin liên hệ'
  }

  return getBookingSubmissionStatus({ seatingArea, guestCount, time, notes }) === 'DA_XAC_NHAN'
    ? 'Xác nhận đặt bàn'
    : 'Gửi yêu cầu đặt bàn'
}
