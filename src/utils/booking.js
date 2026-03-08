import { BOOKING_SEATING_AREAS, BOOKING_TIME_SLOTS, WEEKDAY_LABELS } from '../data/bookingData'

export const ONLINE_BOOKING_MAX_GUESTS = 10
export const LARGE_GROUP_GUEST_COUNT = ONLINE_BOOKING_MAX_GUESTS + 1
export const LARGE_GROUP_HOTLINE_MESSAGE = `Nhóm trên ${ONLINE_BOOKING_MAX_GUESTS} khách vui lòng gọi hotline để đặt bàn.`
export const INVALID_DATE_HINT = 'Vui lòng chọn ngày từ hôm nay trở đi.'
export const CLOSED_DATE_HINT = 'Không nhận đặt bàn vào Thứ 3. Vui lòng chọn ngày khác.'
export const AVAILABILITY_LOADING_TEXT = 'Đang kiểm tra bàn trống...'
export const OPEN_DATE_PICKER_DAYS = 10
export const RESTAURANT_CLOSED_WEEKDAYS = [2]
export const RESTAURANT_CLOSED_DATES = []
export const CLOSED_WEEKDAY_TEXT = RESTAURANT_CLOSED_WEEKDAYS.map((day) => WEEKDAY_LABELS[day]).join(', ')

const PEAK_HOUR_START = 18 * 60
const PEAK_HOUR_END = 20 * 60

export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const parseTimeToMinutes = (value) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export const generateBookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'DB-'
  for (let i = 0; i < 6; i += 1) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}

export const isLargeGroupHotlineOnly = (guestCount) => guestCount > ONLINE_BOOKING_MAX_GUESTS

export const isClosedDate = (dateValue) => {
  if (!dateValue) return false
  if (RESTAURANT_CLOSED_DATES.includes(dateValue)) return true

  const [year, month, day] = dateValue.split('-').map(Number)
  if (!year || !month || !day) return false

  const date = new Date(year, month - 1, day)
  return RESTAURANT_CLOSED_WEEKDAYS.includes(date.getDay())
}

export const getClosedDateLabel = (dateValue) => {
  if (!dateValue) return ''

  const [year, month, day] = dateValue.split('-').map(Number)
  if (!year || !month || !day) return dateValue

  const date = new Date(year, month - 1, day)
  return `${WEEKDAY_LABELS[date.getDay()]}, ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}

const addDays = (date, days) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

export const getNextOpenDate = (startDate = new Date()) => {
  const candidate = new Date(startDate)

  for (let offset = 0; offset <= 30; offset += 1) {
    const nextDate = addDays(candidate, offset)
    const nextDateString = getLocalDateString(nextDate)
    if (!isClosedDate(nextDateString)) return nextDateString
  }

  return getLocalDateString(candidate)
}

export const buildOpenDateOptions = (startDate = new Date(), count = OPEN_DATE_PICKER_DAYS) => {
  const options = []
  let offset = 0

  while (options.length < count && offset <= 45) {
    const nextDate = addDays(startDate, offset)
    const nextDateString = getLocalDateString(nextDate)

    if (!isClosedDate(nextDateString)) {
      options.push(nextDateString)
    }

    offset += 1
  }

  return options
}

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

export const simulateSlotAvailability = (dateValue, guestCount) => {
  if (!dateValue) return { available: [], unavailable: [] }

  if (isLargeGroupHotlineOnly(guestCount)) {
    return {
      available: [],
      unavailable: BOOKING_TIME_SLOTS.map((time) => ({ time, reason: 'group_limit' })),
    }
  }

  if (isClosedDate(dateValue)) {
    return {
      available: [],
      unavailable: BOOKING_TIME_SLOTS.map((time) => ({ time, reason: 'closed' })),
    }
  }

  const today = getLocalDateString()
  const now = new Date()
  const minimumMinutes = now.getHours() * 60 + now.getMinutes() + 30

  const available = []
  const unavailable = []

  BOOKING_TIME_SLOTS.forEach((slot) => {
    if (dateValue === today && parseTimeToMinutes(slot) < minimumMinutes) {
      unavailable.push({ time: slot, reason: 'past' })
      return
    }

    const seed = dateValue.split('-').reduce((a, b) => a + Number(b), 0) + parseTimeToMinutes(slot)
    const isFull = guestCount >= 6 && seed % 7 === 0
    const isAlmostFull = seed % 11 === 0

    if (isFull) {
      unavailable.push({ time: slot, reason: 'full' })
      return
    }

    available.push({ time: slot, almostFull: isAlmostFull })
  })

  return { available, unavailable }
}

const filterLunchSlots = (slots) => slots.filter((slot) => parseTimeToMinutes(slot.time) < 17 * 60)
const filterDinnerSlots = (slots) => slots.filter((slot) => parseTimeToMinutes(slot.time) >= 17 * 60)

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

export const getPolicyItems = (guestCount, seatingArea, timeValue) => ([
  { icon: '📞', text: `Nhóm trên ${ONLINE_BOOKING_MAX_GUESTS} khách vui lòng liên hệ hotline để được hỗ trợ trực tiếp.` },
  ...getOperationalRules(guestCount, seatingArea, timeValue),
])

const normalizePhone = (value) => value.replace(/\s+/g, '').replace(/[^\d+]/g, '')
export const isValidPhoneNumber = (value) => /^(0\d{9,10}|\+84\d{9,10})$/.test(normalizePhone(value))

export const buildSlotGroups = (slotData) => {
  const availableMap = new Map(slotData.available.map((slot) => [slot.time, slot]))
  const unavailableMap = new Map(slotData.unavailable.map((slot) => [slot.time, slot]))

  const allSlots = BOOKING_TIME_SLOTS.map((time) => {
    const available = availableMap.get(time)
    const unavailable = unavailableMap.get(time)

    if (available) {
      return {
        time,
        status: available.almostFull ? 'limited' : 'available',
        note: available.almostFull ? 'Sắp hết chỗ' : 'Còn bàn',
      }
    }

    if (unavailable?.reason === 'past') return { time, status: 'full', note: 'Đã qua giờ phục vụ' }
    if (unavailable?.reason === 'group_limit') return { time, status: 'full', note: 'Liên hệ hotline' }
    if (unavailable?.reason === 'closed') return { time, status: 'full', note: 'Tạm nghỉ' }

    return { time, status: 'full', note: 'Hết chỗ' }
  })

  return [
    { key: 'lunch', label: 'Buổi trưa', slots: filterLunchSlots(allSlots) },
    { key: 'dinner', label: 'Buổi tối', slots: filterDinnerSlots(allSlots) },
  ]
}

export const findNearestAvailableSlots = (timeValue, slotData) => {
  if (!timeValue) return []

  const availableTimes = slotData.available.map((slot) => slot.time)
  if (availableTimes.length === 0) return []

  const selectedMinutes = parseTimeToMinutes(timeValue)

  return availableTimes
    .map((time) => ({ time, diff: Math.abs(parseTimeToMinutes(time) - selectedMinutes) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3)
    .map((item) => item.time)
}

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
    if (!guestCount || !date) return 'Chọn số khách và ngày để xem giờ trống'
    if (isLargeGroupHotlineOnly(guestCount)) return 'Gọi hotline để đặt nhóm đông'
    if (closedDate) return 'Vui lòng chọn ngày khác'
    if (!time) return 'Chọn khung giờ'
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

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return `${WEEKDAY_LABELS[date.getDay()]}, ${day}/${month}/${year}`
}

export const isSelectableDate = (dateValue, minDate, maxDate) => {
  if (!dateValue) return false
  return dateValue >= minDate && dateValue <= maxDate && !isClosedDate(dateValue)
}

export const buildCalendarDays = (monthDate, minDate, maxDate) => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    days.push({ key: `empty-start-${index}`, isEmpty: true })
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const dateValue = getLocalDateString(new Date(year, month, day))
    const isDisabled = !isSelectableDate(dateValue, minDate, maxDate)

    days.push({
      key: dateValue,
      value: dateValue,
      day,
      weekdayLabel: WEEKDAY_LABELS[new Date(year, month, day).getDay()],
      isDisabled,
      isEmpty: false,
    })
  }

  return days
}

export const getNearestSelectableDate = (startDateValue, step, minDate, maxDate) => {
  if (!startDateValue) return ''

  const [year, month, day] = startDateValue.split('-').map(Number)
  const cursor = new Date(year, month - 1, day)

  for (let attempt = 0; attempt < 45; attempt += 1) {
    cursor.setDate(cursor.getDate() + step)
    const nextValue = getLocalDateString(cursor)
    if (!isSelectableDate(nextValue, minDate, maxDate)) continue
    return nextValue
  }

  return startDateValue
}

export const getInitialCalendarFocusDate = (selectedDate, fallbackDate, minDate, maxDate) => {
  if (isSelectableDate(selectedDate, minDate, maxDate)) return selectedDate
  if (isSelectableDate(fallbackDate, minDate, maxDate)) return fallbackDate
  return minDate
}

export const getCalendarNavigationStep = (key) => {
  if (key === 'ArrowLeft') return -1
  if (key === 'ArrowRight') return 1
  if (key === 'ArrowUp') return -7
  if (key === 'ArrowDown') return 7
  return 0
}

export const focusCalendarDateButton = (dateValue) => {
  if (!dateValue) return
  window.requestAnimationFrame(() => {
    document.querySelector(`[data-calendar-date="${dateValue}"]`)?.focus()
  })
}

export const formatCalendarMonth = (date) => `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
