import { LARGE_GROUP_HOTLINE_MESSAGE, ONLINE_BOOKING_MAX_GUESTS, PEAK_HOUR_END, PEAK_HOUR_START } from './constants'
import { parseTimeToMinutes } from './availability'

export const generateBookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'DB-'
  for (let i = 0; i < 6; i += 1) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}

export const isLargeGroupHotlineOnly = (guestCount) => guestCount > ONLINE_BOOKING_MAX_GUESTS

export const getMealDuration = (guestCount, timeValue) => {
  const parsedGuests = Number(guestCount) || 0
  const timeInMinutes = timeValue ? parseTimeToMinutes(timeValue) : 0
  const isPeakHour = timeInMinutes >= PEAK_HOUR_START && timeInMinutes <= PEAK_HOUR_END

  if (parsedGuests <= 2) return isPeakHour ? 75 : 90
  if (parsedGuests <= 6) return isPeakHour ? 105 : 120
  return isPeakHour ? 120 : 135
}

export const getMealDurationText = (guestCount, timeValue) => {
  const duration = getMealDuration(guestCount, timeValue)
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (hours === 0) return `${minutes} phút`
  if (minutes === 0) return `${hours} giờ`
  return `${hours} giờ ${minutes} phút`
}

export const getOperationalRules = (guestCount, seatingArea, timeValue) => {
  const parsedGuests = Number(guestCount) || 0
  const items = [
    { icon: '🕒', text: 'Giữ bàn 15 phút sau giờ hẹn.' },
    { icon: '🪑', text: 'Khu vực ngồi là ưu tiên, không cam kết 100%.' },
    { icon: '📞', text: 'Một số booking có thể cần host gọi lại để xác nhận.' },
  ]

  if (seatingArea === 'PHONG_VIP') {
    items.push({ icon: '◆', text: 'Phòng riêng / VIP có thể áp dụng phụ thu tùy thời điểm.' })
  }

  if (seatingArea === 'BAN_CONG') {
    items.push({ icon: '☼', text: 'Ban công / ngoài trời phụ thuộc thời tiết và tình trạng phục vụ thực tế.' })
  }

  if (parsedGuests >= 8 || (timeValue && parseTimeToMinutes(timeValue) >= PEAK_HOUR_START && parseTimeToMinutes(timeValue) <= PEAK_HOUR_END)) {
    items.push({ icon: '✳️', text: 'Nhóm đông hoặc giờ cao điểm có thể chuyển sang trạng thái cần gọi lại.' })
  }

  return items
}

export const getBookingSubmissionStatus = ({ seatingArea, guestCount, time, notes }) => {
  const parsedGuests = Number(guestCount) || 0
  const timeInMinutes = time ? parseTimeToMinutes(time) : 0
  const isPeakHour = timeInMinutes >= PEAK_HOUR_START && timeInMinutes <= PEAK_HOUR_END
  const hasSpecialRequest = Boolean(notes?.trim())

  if (seatingArea === 'PHONG_VIP' || parsedGuests >= 8 || isPeakHour || hasSpecialRequest) return 'CAN_GOI_LAI'
  return 'DA_XAC_NHAN'
}

export const getBookingStatusHeadline = (status) => {
  if (status === 'DA_XAC_NHAN') return 'Đặt bàn thành công'
  if (status === 'CAN_GOI_LAI') return 'Yêu cầu đã được ghi nhận'
  if (status === 'TU_CHOI_HET_CHO') return 'Nhà hàng hiện chưa thể nhận booking này'
  return 'Yêu cầu đặt bàn đã được ghi nhận'
}

export const getBookingStatusMessage = (status, seatingArea) => {
  if (status === 'DA_XAC_NHAN') {
    return 'Bàn của bạn đã được giữ đến 15 phút sau giờ hẹn.'
  }

  if (status === 'CAN_GOI_LAI') {
    return seatingArea === 'PHONG_VIP'
      ? 'Host sẽ gọi lại để xác nhận phương án phục vụ, vị trí ngồi và phụ thu nếu có.'
      : 'Host sẽ gọi lại để xác nhận phương án phục vụ phù hợp.'
  }

  if (status === 'TU_CHOI_HET_CHO') {
    return 'Hiện chưa thể giữ bàn cho yêu cầu này. Vui lòng chọn khung giờ khác hoặc liên hệ hotline để được hỗ trợ nhanh hơn.'
  }

  return 'Yêu cầu của bạn đã được ghi nhận.'
}

export const getPolicyItems = (guestCount, seatingArea, timeValue) => ([
  { icon: '📞', text: `Nhóm trên ${ONLINE_BOOKING_MAX_GUESTS} khách vui lòng liên hệ hotline để được hỗ trợ trực tiếp.` },
  ...getOperationalRules(guestCount, seatingArea, timeValue),
])

export { LARGE_GROUP_HOTLINE_MESSAGE }
