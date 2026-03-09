import { BOOKING_SEATING_AREAS } from '../../data/bookingData'

export const shouldDisableSeatOption = (areaValue, guestCount) => {
  if (!guestCount) return false
  const area = BOOKING_SEATING_AREAS.find((item) => item.value === areaValue)
  if (!area) return true
  return guestCount > area.maxGuests
}

export const getSeatDisabledHint = (areaValue, guestCount) => {
  const area = BOOKING_SEATING_AREAS.find((item) => item.value === areaValue)
  if (!area || !guestCount || guestCount <= area.maxGuests) return ''
  return `Phù hợp tối đa ${area.maxGuests} khách`
}

export const getSeatSummaryText = (seatValue) => {
  const area = BOOKING_SEATING_AREAS.find((item) => item.value === seatValue)
  if (!area) return 'Không ưu tiên'
  return area.label
}

export const getSeatOperationalNote = (seatValue) => {
  if (seatValue === 'PHONG_VIP') return 'Cần lễ tân xác nhận lại, có thể áp dụng phụ thu và không giữ tự động như bàn thường.'
  if (seatValue === 'BAN_CONG') return 'Ưu tiên khi thời tiết phù hợp, nhà hàng có thể đổi vị trí nếu mưa hoặc quá tải.'
  if (seatValue === 'KHONG_UU_TIEN') return 'Nhà hàng sẽ sắp xếp bàn phù hợp nhất theo tình trạng phục vụ thực tế.'
  if (seatValue === 'QUAY_BAR') return 'Ưu tiên cho 1–2 khách, có thể đổi sang khu vực khác nếu quầy bar đã kín.'
  return 'Nhà hàng sẽ cố gắng hỗ trợ nhưng không cam kết cố định 100% vị trí.'
}
