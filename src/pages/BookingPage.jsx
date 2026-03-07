import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SERVICE_HOTLINE = '(028) 3825 6789'
const SERVICE_HOTLINE_LINK = 'tel:02838256789'
const ONLINE_BOOKING_MAX_GUESTS = 10
const LARGE_GROUP_GUEST_COUNT = ONLINE_BOOKING_MAX_GUESTS + 1
const LARGE_GROUP_HOTLINE_MESSAGE = `Nhóm trên ${ONLINE_BOOKING_MAX_GUESTS} khách vui lòng gọi ${SERVICE_HOTLINE} để đặt bàn.`
const INVALID_DATE_HINT = 'Vui lòng chọn ngày từ hôm nay trở đi.'
const CLOSED_DATE_HINT = 'Không nhận đặt bàn vào Thứ 3. Vui lòng chọn ngày khác.'
const AVAILABILITY_LOADING_TEXT = 'Đang kiểm tra bàn trống...'
const AVAILABILITY_DELAY = 550
const WEEKDAY_LABELS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
const RESTAURANT_CLOSED_WEEKDAYS = [2]
const RESTAURANT_CLOSED_DATES = []
const CLOSED_WEEKDAY_TEXT = RESTAURANT_CLOSED_WEEKDAYS.map((day) => WEEKDAY_LABELS[day]).join(', ')
const BOOKING_STATUS_LABELS = {
  YEU_CAU_DAT_BAN: '🟡 Yêu cầu đặt bàn',
  GIU_CHO_TAM: '🟠 Đã giữ chỗ tạm',
  DA_XAC_NHAN: '🟢 Đặt bàn thành công',
  CAN_GOI_LAI: '📞 Cần host gọi lại',
  TU_CHOI_HET_CHO: '🔴 Từ chối / hết chỗ',
}
const OPEN_DATE_PICKER_DAYS = 10
const PEAK_HOUR_START = 18 * 60
const PEAK_HOUR_END = 20 * 60

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
]

const SEATING_AREAS = [
  {
    value: 'KHONG_UU_TIEN',
    label: 'Không ưu tiên',
    desc: 'Nhà hàng sẽ xếp bàn phù hợp nhất theo tình trạng trống thực tế.',
    icon: '✦',
    maxGuests: Number.POSITIVE_INFINITY,
  },
  {
    value: 'SANH_CHINH',
    label: 'Sảnh chính',
    desc: 'Phù hợp nhóm bạn và gia đình. Không cam kết 100% đúng vị trí.',
    icon: '🍽️',
    maxGuests: 10,
  },
  {
    value: 'PHONG_VIP',
    label: 'Phòng riêng / VIP',
    desc: 'Cần host xác nhận lại. Có thể áp dụng phụ thu tùy thời điểm.',
    icon: '◆',
    maxGuests: 10,
  },
  {
    value: 'BAN_CONG',
    label: 'Ban công / ngoài trời',
    desc: 'Phụ thuộc thời tiết và tình trạng phục vụ thực tế.',
    icon: '☼',
    maxGuests: 6,
  },
  {
    value: 'QUAY_BAR',
    label: 'Quầy bar',
    desc: 'Phù hợp 1–2 khách. Có thể đổi khu vực nếu quầy bar đã kín.',
    icon: '◈',
    maxGuests: 2,
  },
]

const OCCASIONS = ['Sinh nhật', 'Kỷ niệm', 'Tiếp khách / công việc', 'Cần không gian yên tĩnh']

const STEP_ITEMS = [
  { id: 1, eyebrow: 'Bước 1', title: 'Chọn thông tin đặt bàn' },
  { id: 2, eyebrow: 'Bước 2', title: 'Nhập thông tin liên hệ' },
  { id: 3, eyebrow: 'Bước 3', title: 'Xác nhận đặt bàn' },
]

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseTimeToMinutes = (value) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

const generateBookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'DB-'
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code
}

const isLargeGroupHotlineOnly = (guestCount) => guestCount > ONLINE_BOOKING_MAX_GUESTS

const isClosedDate = (dateValue) => {
  if (!dateValue) return false

  if (RESTAURANT_CLOSED_DATES.includes(dateValue)) return true

  const [year, month, day] = dateValue.split('-').map(Number)
  if (!year || !month || !day) return false

  const date = new Date(year, month - 1, day)
  return RESTAURANT_CLOSED_WEEKDAYS.includes(date.getDay())
}

const getClosedDateLabel = (dateValue) => {
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

const getNextOpenDate = (startDate = new Date()) => {
  const candidate = new Date(startDate)

  for (let offset = 0; offset <= 30; offset += 1) {
    const nextDate = addDays(candidate, offset)
    const nextDateString = getLocalDateString(nextDate)
    if (!isClosedDate(nextDateString)) return nextDateString
  }

  return getLocalDateString(candidate)
}

const buildOpenDateOptions = (startDate = new Date(), count = OPEN_DATE_PICKER_DAYS) => {
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

const getMealDuration = (guestCount, timeValue) => {
  const parsedGuests = Number(guestCount) || 0
  const timeInMinutes = timeValue ? parseTimeToMinutes(timeValue) : 0
  const isPeakHour = timeInMinutes >= PEAK_HOUR_START && timeInMinutes <= PEAK_HOUR_END

  if (parsedGuests <= 2) {
    return isPeakHour ? 75 : 90
  }

  if (parsedGuests <= 6) {
    return isPeakHour ? 105 : 120
  }

  return isPeakHour ? 120 : 135
}

const getMealDurationText = (guestCount, timeValue) => {
  const duration = getMealDuration(guestCount, timeValue)
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (hours === 0) return `${minutes} phút`
  if (minutes === 0) return `${hours} giờ`
  return `${hours} giờ ${minutes} phút`
}

const getOperationalRules = (guestCount, seatingArea, timeValue) => {
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

const getBookingSubmissionStatus = ({ seatingArea, guestCount, time, notes }) => {
  const parsedGuests = Number(guestCount) || 0
  const timeInMinutes = time ? parseTimeToMinutes(time) : 0
  const isPeakHour = timeInMinutes >= PEAK_HOUR_START && timeInMinutes <= PEAK_HOUR_END
  const hasSpecialRequest = Boolean(notes?.trim())

  if (seatingArea === 'PHONG_VIP' || parsedGuests >= 8 || isPeakHour || hasSpecialRequest) return 'CAN_GOI_LAI'
  return 'DA_XAC_NHAN'
}

const getBookingStatusHeadline = (status) => {
  if (status === 'DA_XAC_NHAN') return 'Đặt bàn thành công'
  if (status === 'CAN_GOI_LAI') return 'Yêu cầu đã được ghi nhận'
  if (status === 'TU_CHOI_HET_CHO') return 'Nhà hàng hiện chưa thể nhận booking này'
  return 'Yêu cầu đặt bàn đã được ghi nhận'
}

const getBookingStatusMessage = (status, seatingArea) => {
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

const simulateSlotAvailability = (dateValue, guestCount) => {
  if (!dateValue) return { available: [], unavailable: [] }

  if (isLargeGroupHotlineOnly(guestCount)) {
    return {
      available: [],
      unavailable: TIME_SLOTS.map((time) => ({ time, reason: 'group_limit' })),
    }
  }

  if (isClosedDate(dateValue)) {
    return {
      available: [],
      unavailable: TIME_SLOTS.map((time) => ({ time, reason: 'closed' })),
    }
  }

  const today = getLocalDateString()
  const now = new Date()
  const minimumMinutes = now.getHours() * 60 + now.getMinutes() + 30

  const available = []
  const unavailable = []

  TIME_SLOTS.forEach((slot) => {
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

const guestOptions = [...Array.from({ length: ONLINE_BOOKING_MAX_GUESTS }, (_, index) => index + 1), '10+']
const NOTE_SUGGESTIONS = ['Sinh nhật', 'Có trẻ em', 'Cần ghế em bé', 'Dị ứng thực phẩm', 'Có thể đến muộn']

const filterLunchSlots = (slots) => slots.filter((slot) => parseTimeToMinutes(slot.time) < 17 * 60)
const filterDinnerSlots = (slots) => slots.filter((slot) => parseTimeToMinutes(slot.time) >= 17 * 60)

const shouldDisableSeatOption = (areaValue, guestCount) => {
  if (!guestCount) return false
  const area = SEATING_AREAS.find((item) => item.value === areaValue)
  if (!area) return true
  return guestCount > area.maxGuests
}

const getSeatDisabledHint = (areaValue, guestCount) => {
  const area = SEATING_AREAS.find((item) => item.value === areaValue)
  if (!area || !guestCount || guestCount <= area.maxGuests) return ''
  return `Phù hợp tối đa ${area.maxGuests} khách`
}

const getSeatSummaryText = (seatValue) => {
  const area = SEATING_AREAS.find((item) => item.value === seatValue)
  if (!area) return 'Không ưu tiên'
  return area.label
}

const getSeatOperationalNote = (seatValue) => {
  if (seatValue === 'PHONG_VIP') return 'Cần lễ tân xác nhận lại, có thể áp dụng phụ thu và không giữ tự động như bàn thường.'
  if (seatValue === 'BAN_CONG') return 'Ưu tiên khi thời tiết phù hợp, nhà hàng có thể đổi vị trí nếu mưa hoặc quá tải.'
  if (seatValue === 'KHONG_UU_TIEN') return 'Nhà hàng sẽ sắp xếp bàn phù hợp nhất theo tình trạng phục vụ thực tế.'
  if (seatValue === 'QUAY_BAR') return 'Ưu tiên cho 1–2 khách, có thể đổi sang khu vực khác nếu quầy bar đã kín.'
  return 'Nhà hàng sẽ cố gắng hỗ trợ nhưng không cam kết cố định 100% vị trí.'
}

const getPolicyItems = (guestCount, seatingArea, timeValue) => {
  const items = [
    { icon: '📞', text: `Nhóm trên ${ONLINE_BOOKING_MAX_GUESTS} khách vui lòng liên hệ hotline để được hỗ trợ trực tiếp.` },
    ...getOperationalRules(guestCount, seatingArea, timeValue),
  ]

  return items
}

const normalizePhone = (value) => value.replace(/\s+/g, '').replace(/[^\d+]/g, '')
const isValidPhoneNumber = (value) => /^(0\d{9,10}|\+84\d{9,10})$/.test(normalizePhone(value))

const buildSlotGroups = (slotData) => {
  const availableMap = new Map(slotData.available.map((slot) => [slot.time, slot]))
  const unavailableMap = new Map(slotData.unavailable.map((slot) => [slot.time, slot]))

  const allSlots = TIME_SLOTS.map((time) => {
    const available = availableMap.get(time)
    const unavailable = unavailableMap.get(time)

    if (available) {
      return {
        time,
        status: available.almostFull ? 'limited' : 'available',
        note: available.almostFull ? 'Sắp hết chỗ' : 'Còn bàn',
      }
    }

    if (unavailable?.reason === 'past') {
      return { time, status: 'full', note: 'Đã qua giờ phục vụ' }
    }

    if (unavailable?.reason === 'group_limit') {
      return { time, status: 'full', note: 'Liên hệ hotline' }
    }

    if (unavailable?.reason === 'closed') {
      return { time, status: 'full', note: 'Tạm nghỉ' }
    }

    return { time, status: 'full', note: 'Hết chỗ' }
  })

  return [
    { key: 'lunch', label: 'Buổi trưa', slots: filterLunchSlots(allSlots) },
    { key: 'dinner', label: 'Buổi tối', slots: filterDinnerSlots(allSlots) },
  ]
}

const findNearestAvailableSlots = (timeValue, slotData) => {
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

const getStepOneErrors = ({ guestCount, date, time, invalidPastDate, closedDate }) => {
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

const getStepTwoErrors = ({ name, phone }) => {
  const errors = {}

  if (!name.trim()) errors.name = 'Vui lòng nhập họ và tên'
  if (!phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại'
  else if (!isValidPhoneNumber(phone)) errors.phone = 'Số điện thoại chưa đúng định dạng'

  return errors
}

const getPrimaryCtaLabel = ({ step, guestCount, date, time, step1Complete, step2Complete, closedDate, seatingArea, notes }) => {
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

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  return `${weekdays[date.getDay()]}, ${day}/${month}/${year}`
}

function BookingPage() {
  const navigate = useNavigate()
  const [currentUser] = useState(() => {
    const userDataString = localStorage.getItem('restaurant_current_user')
    if (!userDataString) return null

    try {
      return JSON.parse(userDataString)
    } catch {
      return null
    }
  })

  const [step, setStep] = useState(1)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotData, setSlotData] = useState({ available: [], unavailable: [] })
  const [submitted, setSubmitted] = useState(false)
  const [bookingCode, setBookingCode] = useState('')
  const [bookingStatus, setBookingStatus] = useState('YEU_CAU_DAT_BAN')
  const [submitError, setSubmitError] = useState('')
  const [inlineErrors, setInlineErrors] = useState({})
  const [draftRestored, setDraftRestored] = useState(false)

  const openDateOptions = useMemo(() => buildOpenDateOptions(new Date()), [])
  const nextOpenDate = openDateOptions[0] || getNextOpenDate(new Date())

  const [formData, setFormData] = useState(() => {
    const draftString = localStorage.getItem('restaurant_booking_draft')
    let draftData = null

    if (draftString) {
      try {
        draftData = JSON.parse(draftString)
      } catch {
        draftData = null
      }
    }

    return {
      guests: String(draftData?.guests ?? ''),
      date: String(draftData?.date ?? ''),
      time: String(draftData?.time ?? ''),
      seatingArea: String(draftData?.seatingArea ?? 'KHONG_UU_TIEN'),
      occasion: String(draftData?.occasion ?? ''),
      notes: String(draftData?.notes ?? ''),
      name: String(draftData?.name ?? currentUser?.fullName ?? currentUser?.name ?? ''),
      phone: String(draftData?.phone ?? currentUser?.phone ?? ''),
      email: String(draftData?.email ?? currentUser?.email ?? ''),
    }
  })

  const todayString = getLocalDateString()
  const guestCount = Number(formData.guests) || 0
  const invalidPastDate = Boolean(formData.date && formData.date < todayString)
  const closedDate = Boolean(formData.date && isClosedDate(formData.date))
  const step1Complete = Boolean(
    formData.guests && formData.date && formData.time && !invalidPastDate && !closedDate && !isLargeGroupHotlineOnly(guestCount)
  )
  const step2Complete = Boolean(formData.name.trim() && formData.phone.trim() && isValidPhoneNumber(formData.phone))

  useEffect(() => {
    const draftString = localStorage.getItem('restaurant_booking_draft')
    if (!draftString) return

    setDraftRestored(true)

    try {
      const draftData = JSON.parse(draftString)
      if (draftData?.guests && draftData?.date && draftData?.time) {
        setStep(2)
      }
    } catch {
      // noop
    }
  }, [])

  useEffect(() => {
    if (!formData.guests || !formData.date || invalidPastDate || closedDate || isLargeGroupHotlineOnly(guestCount)) {
      setSlotsLoading(false)
      setSlotData(simulateSlotAvailability(formData.date, guestCount))
      return
    }

    setSlotsLoading(true)
    const timeoutId = window.setTimeout(() => {
      setSlotData(simulateSlotAvailability(formData.date, guestCount))
      setSlotsLoading(false)
    }, AVAILABILITY_DELAY)

    return () => window.clearTimeout(timeoutId)
  }, [closedDate, formData.date, formData.guests, guestCount, invalidPastDate])

  useEffect(() => {
    if (!formData.time || slotsLoading) return

    const stillAvailable = slotData.available.some((slot) => slot.time === formData.time)
    if (stillAvailable) return

    const suggestions = findNearestAvailableSlots(formData.time, slotData)
    setFormData((prev) => ({ ...prev, time: '' }))
    setInlineErrors((prev) => ({
      ...prev,
      time: suggestions.length > 0
        ? `Khung giờ ${formData.time} hiện không còn chỗ. Gợi ý: ${suggestions.join(', ')}.`
        : `Khung giờ ${formData.time} hiện không còn chỗ. Vui lòng chọn giờ khác.`,
    }))
    if (step > 1) setStep(1)
  }, [formData.time, slotData, slotsLoading, step])

  useEffect(() => {
    if (submitted) return

    if (!formData.phone.trim()) return

    const draftPayload = {
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
    }

    localStorage.setItem('restaurant_booking_draft', JSON.stringify(draftPayload))
  }, [formData, submitted])

  const slotGroups = useMemo(() => buildSlotGroups(slotData), [slotData])
  const selectedTimeSuggestions = useMemo(() => findNearestAvailableSlots(formData.time, slotData), [formData.time, slotData])
  const selectedMealDurationText = useMemo(
    () => (formData.time ? getMealDurationText(guestCount, formData.time) : ''),
    [formData.time, guestCount],
  )
  const bookingOperationalRules = useMemo(
    () => getOperationalRules(guestCount, formData.seatingArea, formData.time),
    [guestCount, formData.seatingArea, formData.time],
  )
  const primaryCtaLabel = getPrimaryCtaLabel({
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

  const guestWarning = useMemo(() => {
    if (guestCount === ONLINE_BOOKING_MAX_GUESTS) {
      return 'Nhóm 10 khách có thể cần host gọi lại để xác nhận cách xếp bàn.'
    }
    if (guestCount >= 6) {
      return 'Nhóm từ 6 khách nên đặt sớm để ưu tiên bàn phù hợp hơn.'
    }
    return ''
  }, [guestCount])

  const selectedSeatOperationalNote = useMemo(
    () => getSeatOperationalNote(formData.seatingArea),
    [formData.seatingArea],
  )

  const handleFieldErrorClear = (fieldName) => {
    setInlineErrors((prev) => {
      if (!prev[fieldName]) return prev
      const next = { ...prev }
      delete next[fieldName]
      return next
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSubmitError('')
    handleFieldErrorClear(name)

    setFormData((prev) => {
      const next = { ...prev, [name]: value }

      if (name === 'date' || name === 'guests') {
        next.time = ''
      }

      if (name === 'date') {
        next.seatingArea = 'KHONG_UU_TIEN'
      }

      if (name === 'guests' && prev.seatingArea) {
        const selectedArea = SEATING_AREAS.find((item) => item.value === prev.seatingArea)
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
    setInlineErrors((prev) => ({
      ...prev,
      guests: '',
      time: '',
    }))
    setFormData((prev) => {
      const selectedArea = SEATING_AREAS.find((item) => item.value === prev.seatingArea)
      return {
        ...prev,
        guests: String(normalizedValue),
        time: '',
        seatingArea: selectedArea && normalizedValue > selectedArea.maxGuests ? 'KHONG_UU_TIEN' : prev.seatingArea,
      }
    })
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
    handleFieldErrorClear('time')
    setFormData((prev) => ({
      ...prev,
      time: prev.time === slot.time ? '' : slot.time,
      seatingArea: prev.time === slot.time ? 'KHONG_UU_TIEN' : prev.seatingArea,
    }))
  }

  const handleSelectSuggestedTime = (timeValue) => {
    setSubmitError('')
    handleFieldErrorClear('time')
    setFormData((prev) => ({ ...prev, time: timeValue, seatingArea: 'KHONG_UU_TIEN' }))
  }

  const handleSeatingSelect = (areaValue) => {
    const area = SEATING_AREAS.find((item) => item.value === areaValue)
    if (!area || guestCount > area.maxGuests) return

    setFormData((prev) => ({
      ...prev,
      seatingArea: areaValue,
    }))
  }

  const goToStep = (nextStep) => {
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepOneContinue = () => {
    const errors = getStepOneErrors({
      guestCount,
      date: formData.date,
      time: formData.time,
      invalidPastDate,
      closedDate,
    })

    if (Object.keys(errors).length > 0) {
      setInlineErrors((prev) => ({ ...prev, ...errors }))
      if (errors.guests && isLargeGroupHotlineOnly(guestCount)) setSubmitError(LARGE_GROUP_HOTLINE_MESSAGE)
      return
    }

    goToStep(2)
  }

  const handleStepTwoContinue = () => {
    const errors = getStepTwoErrors({ name: formData.name, phone: formData.phone })
    if (Object.keys(errors).length > 0) {
      setInlineErrors((prev) => ({ ...prev, ...errors }))
      return
    }

    goToStep(3)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitError('')

    if (formData.phone.trim()) {
      const draftPayload = {
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
      }
      localStorage.setItem('restaurant_booking_draft', JSON.stringify(draftPayload))
    }

    const stepOneErrors = getStepOneErrors({
      guestCount,
      date: formData.date,
      time: formData.time,
      invalidPastDate,
      closedDate,
    })
    const stepTwoErrors = getStepTwoErrors({ name: formData.name, phone: formData.phone })
    const combinedErrors = { ...stepOneErrors, ...stepTwoErrors }

    if (Object.keys(combinedErrors).length > 0) {
      setInlineErrors((prev) => ({ ...prev, ...combinedErrors }))
      if (stepOneErrors.guests || stepOneErrors.date || stepOneErrors.time) goToStep(1)
      else goToStep(2)
      return
    }

    const selectedSlot = slotData.available.find((slot) => slot.time === formData.time)
    if (!selectedSlot) {
      const suggestions = findNearestAvailableSlots(formData.time, slotData)
      setInlineErrors((prev) => ({
        ...prev,
        time: suggestions.length > 0
          ? `Khung giờ ${formData.time} hiện không còn chỗ. Gợi ý: ${suggestions.join(', ')}.`
          : `Khung giờ ${formData.time} hiện không còn chỗ. Vui lòng chọn giờ khác.`,
      }))
      goToStep(1)
      return
    }

    if (formData.seatingArea) {
      const selectedArea = SEATING_AREAS.find((item) => item.value === formData.seatingArea)
      if (selectedArea && guestCount > selectedArea.maxGuests) {
        setSubmitError(`Khu vực mong muốn chỉ phù hợp tối đa ${selectedArea.maxGuests} khách.`)
        goToStep(1)
        return
      }
    }

    const code = generateBookingCode()
    const submissionTime = new Date().toISOString()
    const status = getBookingSubmissionStatus({
      seatingArea: formData.seatingArea,
      guestCount,
      time: formData.time,
      notes: formData.notes,
    })

    const newBooking = {
      id: Date.now(),
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
      createdAt: submissionTime,
      bookingCode: code,
      userEmail: currentUser?.email ?? null,
      occasion: formData.occasion,
      confirmationChannel: formData.email ? ['SMS', 'Email'] : ['SMS'],
    }

    let bookings = []
    const storedBookings = localStorage.getItem('restaurant_bookings')

    if (storedBookings) {
      try {
        const parsedBookings = JSON.parse(storedBookings)
        if (Array.isArray(parsedBookings)) bookings = parsedBookings
      } catch {
        bookings = []
      }
    }

    bookings.push(newBooking)
    localStorage.setItem('restaurant_bookings', JSON.stringify(bookings))

    const confirmationPayload = {
      bookingCode: code,
      status,
      confirmationChannel: newBooking.confirmationChannel,
      bookingId: newBooking.id,
      createdAt: submissionTime,
      mealDurationMinutes: getMealDuration(guestCount, formData.time),
      sms: {
        to: formData.phone,
        sentAt: submissionTime,
        bookingCode: code,
        status,
      },
      email: formData.email
        ? {
            to: formData.email,
            sentAt: submissionTime,
            bookingCode: code,
            status,
          }
        : null,
    }

    localStorage.setItem('restaurant_last_booking_confirmation', JSON.stringify(confirmationPayload))
    localStorage.removeItem('restaurant_booking_draft')

    const receptionQueueString = localStorage.getItem('restaurant_reception_queue')
    const receptionQueue = receptionQueueString ? JSON.parse(receptionQueueString) : []
    const safeReceptionQueue = Array.isArray(receptionQueue) ? receptionQueue : []
    safeReceptionQueue.push({
      bookingCode: code,
      guestName: formData.name,
      guests: formData.guests,
      date: formData.date,
      time: formData.time,
      seatingArea: formData.seatingArea,
      status,
      source: 'web',
      queuedAt: submissionTime,
      mealDurationMinutes: getMealDuration(guestCount, formData.time),
    })
    localStorage.setItem('restaurant_reception_queue', JSON.stringify(safeReceptionQueue))

    setBookingCode(code)
    setBookingStatus(status)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const successStatusLabel = BOOKING_STATUS_LABELS[bookingStatus] || bookingStatus
  const successHeading = getBookingStatusHeadline(bookingStatus)

  return (
    <div className="booking-page">
      <section className="booking-hero booking-hero-premium">
        <div className="container booking-hero-shell">
          <div className="booking-hero-copy">
            <span className="booking-label">Đặt bàn trực tuyến</span>
            <h1 className="booking-title booking-title-premium">
              Đặt bàn trực tuyến
            </h1>
            <p className="booking-subtitle booking-subtitle-premium">
              Chọn số khách, ngày và giờ để kiểm tra bàn trống theo thời gian thực.
            </p>
          </div>

          <div className="booking-hero-aside">
            <div className="booking-hero-note-card">
              <span className="booking-hero-note-label">Phục vụ đặt online</span>
              <strong>Tối đa {ONLINE_BOOKING_MAX_GUESTS} khách / lượt</strong>
              <p>Nhóm 10 khách vẫn có thể đặt online. Nhóm trên 10 khách vui lòng gọi hotline để được hỗ trợ.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-form-section booking-form-section-premium">
        <div className="container">
          <div className="booking-layout-premium">
            <aside className="booking-sidebar-premium">
              <div className="booking-stepper-card">
                <p className="booking-side-kicker">Tiến trình đặt bàn</p>
                <div className="booking-stepper-list">
                  {STEP_ITEMS.map((item) => {
                    const isActive = step === item.id
                    const isCompleted = step > item.id

                    return (
                      <div
                        key={item.id}
                        className={`booking-stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      >
                        <span className="booking-stepper-index">{isCompleted ? '✓' : item.id}</span>
                        <div>
                          <p>{item.eyebrow}</p>
                          <strong>{item.title}</strong>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="booking-side-card booking-side-card-dark">
                <p className="booking-side-kicker">Khung giờ phục vụ</p>
                <div className="booking-side-hours">
                  <div>
                    <strong>Thứ 2 - Thứ 6</strong>
                    <span>11:00 - 14:00 · 17:00 - 22:00</span>
                  </div>
                  <div>
                    <strong>Thứ 7 - Chủ nhật</strong>
                    <span>11:00 - 22:00</span>
                  </div>
                </div>
              </div>

              <div className="booking-side-card">
                <p className="booking-side-kicker">Liên hệ nhanh</p>
                <div className="booking-side-contact">
                  <p>📞 {SERVICE_HOTLINE}</p>
                  <p>✉️ booking@restaurant.vn</p>
                  <p>📍 123 Nguyễn Huệ, Q.1, TP.HCM</p>
                </div>
              </div>
            </aside>

            <div className="booking-main-premium">
              {submitted ? (
                <div className="booking-success booking-success-premium">
                  <div className="success-icon">✓</div>
                  <p className="booking-side-kicker">Kết quả booking</p>
                  <h3>{successHeading}</h3>
                  <div className="success-booking-code">
                    <span className="code-label">Mã đặt bàn</span>
                    <span className="code-value">{bookingCode}</span>
                  </div>
                  <div className="success-status">
                    <span className="status-badge status-pending">{successStatusLabel}</span>
                  </div>

                  <div className="booking-success-grid">
                    <div className="booking-success-item">
                      <span>Ngày dùng bữa</span>
                      <strong>{formatDateDisplay(formData.date)}</strong>
                    </div>
                    <div className="booking-success-item">
                      <span>Khung giờ</span>
                      <strong>{formData.time}</strong>
                    </div>
                    <div className="booking-success-item">
                      <span>Số khách</span>
                      <strong>{formData.guests} khách</strong>
                    </div>
                    <div className="booking-success-item">
                      <span>Khu vực</span>
                      <strong>{getSeatSummaryText(formData.seatingArea)}</strong>
                    </div>
                    <div className="booking-success-item">
                      <span>Khách liên hệ</span>
                      <strong>{formData.name}</strong>
                    </div>
                    <div className="booking-success-item">
                      <span>Số điện thoại</span>
                      <strong>{formData.phone}</strong>
                    </div>
                  </div>

                  <p className="success-note success-note-premium">
                    {getBookingStatusMessage(bookingStatus, formData.seatingArea)}
                  </p>

                  <div className="booking-policy-notes booking-policy-notes-premium">
                    {getPolicyItems(guestCount, formData.seatingArea, formData.time).map((item) => (
                      <div className="policy-item" key={item.text}>
                        <span className="policy-icon">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="booking-success-actions">
                    <button type="button" className="booking-secondary-btn" onClick={() => navigate('/profile')}>
                      Xem trong hồ sơ
                    </button>
                    <button type="button" className="booking-primary-btn" onClick={() => navigate('/')}>
                      Về trang chủ
                    </button>
                  </div>
                </div>
              ) : (
                <form className="booking-shell-premium" onSubmit={handleSubmit}>
                  {draftRestored && (
                    <div className="booking-draft-banner">
                      <div>
                        <strong>Đã khôi phục yêu cầu đặt bàn chưa hoàn tất</strong>
                        <p>Bạn có thể tiếp tục hoàn tất thông tin hoặc chỉnh sửa trước khi xác nhận.</p>
                      </div>
                      <button type="button" className="summary-edit-btn" onClick={() => setDraftRestored(false)}>
                        Đã hiểu
                      </button>
                    </div>
                  )}

                  <header className="booking-panel-header">
                    <div>
                      <p className="booking-side-kicker">Đặt bàn trực tuyến</p>
                      <h2>{STEP_ITEMS.find((item) => item.id === step)?.title}</h2>
                    </div>
                    <div className="booking-panel-progress">Bước {step}/3</div>
                  </header>

                  {step === 1 && (
                    <div className="booking-step booking-step-premium">
                      <section className="booking-editorial-card booking-editorial-card-highlight">
                        <div className="booking-section-head">
                          <div>
                            <p className="booking-side-kicker">Số lượng khách</p>
                            <h3>Chọn số khách</h3>
                          </div>
                          <span className="booking-inline-note">Đặt online tối đa {ONLINE_BOOKING_MAX_GUESTS} khách</span>
                        </div>

                        <div className="booking-guest-grid">
                          {guestOptions.map((num) => (
                            <button
                              key={num}
                              type="button"
                              className={`booking-guest-card ${formData.guests === String(num === '10+' ? LARGE_GROUP_GUEST_COUNT : num) ? 'selected' : ''} ${num !== '10+' && num >= 8 ? 'is-large' : ''} ${num === '10+' ? 'is-hotline' : ''}`}
                              onClick={() => handleGuestSelect(num)}
                            >
                              <strong>{num}</strong>
                              <span>{num === '10+' ? 'liên hệ hotline' : 'khách'}</span>
                            </button>
                          ))}
                        </div>

                        {inlineErrors.guests && <p className="form-error-inline booking-inline-alert">{inlineErrors.guests}</p>}
                        {guestWarning && !inlineErrors.guests && <p className="booking-field-note">{guestWarning}</p>}

                        {isLargeGroupHotlineOnly(guestCount) && (
                          <div className="booking-hotline-hint booking-hotline-panel">
                            <strong>Online booking đang tạm dừng cho nhóm trên {ONLINE_BOOKING_MAX_GUESTS} khách</strong>
                            <p>{LARGE_GROUP_HOTLINE_MESSAGE}</p>
                            <a href={SERVICE_HOTLINE_LINK} className="btn btn-primary">Gọi hotline đặt bàn</a>
                          </div>
                        )}
                      </section>

                      <section className="booking-editorial-card">
                        <div className="booking-section-head">
                          <div>
                            <p className="booking-side-kicker">Ngày & giờ</p>
                            <h3>Kiểm tra bàn trống</h3>
                          </div>
                        </div>

                        <div className="booking-form-grid-split">
                          <div className="form-field">
                            <label className="form-label" htmlFor="booking-date">Ngày dùng bữa</label>
                            <select
                              id="booking-date"
                              name="date"
                              className={`form-input ${inlineErrors.date ? 'form-input-error' : ''}`}
                              value={formData.date}
                              onChange={handleChange}
                            >
                              <option value="">Chọn ngày dùng bữa</option>
                              {openDateOptions.map((dateValue) => (
                                <option key={dateValue} value={dateValue}>
                                  {getClosedDateLabel(dateValue)}
                                </option>
                              ))}
                            </select>
                            {inlineErrors.date && <span className="form-error-inline">{inlineErrors.date}</span>}
                            <span className="booking-field-note">Không nhận đặt bàn vào {CLOSED_WEEKDAY_TEXT}. Lịch chỉ hiển thị ngày đang mở nhận bàn.</span>
                          </div>
                        </div>

                        {!formData.date && (
                          <div className="booking-seat-note-banner">
                            <strong>Gợi ý ngày gần nhất:</strong> {getClosedDateLabel(nextOpenDate)}
                          </div>
                        )}

                        <div className="booking-availability-panel">
                          <div className="booking-availability-head">
                            <div>
                              <p className="booking-side-kicker">Availability</p>
                              <h4>Khung giờ phục vụ khả dụng</h4>
                            </div>
                            <div className="booking-slot-legend">
                              <span><i className="dot available" />Còn bàn</span>
                              <span><i className="dot limited" />Sắp hết</span>
                              <span><i className="dot full" />Hết chỗ</span>
                            </div>
                          </div>

                          {!formData.guests || !formData.date ? (
                            <div className="timeslot-placeholder booking-placeholder-large">
                              <span className="placeholder-icon">🕐</span>
                              <span>Vui lòng chọn số khách và ngày để xem khung giờ trống.</span>
                            </div>
                          ) : invalidPastDate ? (
                            <div className="timeslot-empty booking-placeholder-large">
                              <span className="placeholder-icon">⚠️</span>
                              <span>{INVALID_DATE_HINT}</span>
                            </div>
                          ) : isLargeGroupHotlineOnly(guestCount) ? (
                            <div className="timeslot-empty booking-placeholder-large">
                              <span className="placeholder-icon">📞</span>
                              <span>{LARGE_GROUP_HOTLINE_MESSAGE}</span>
                            </div>
                          ) : slotsLoading ? (
                            <div className="timeslot-loading booking-placeholder-large">
                              <div className="slot-loading-spinner" />
                              <span>{AVAILABILITY_LOADING_TEXT}</span>
                            </div>
                          ) : (
                            <>
                              {slotGroups.map((group) => (
                                <div key={group.key} className="timeslot-group booking-timeslot-group-premium">
                                  <span className="timeslot-group-label">{group.label}</span>
                                  <div className="timeslot-grid booking-timeslot-grid-premium">
                                    {group.slots.map((slot) => (
                                      <button
                                        key={slot.time}
                                        type="button"
                                        className={`timeslot-btn booking-slot-card ${formData.time === slot.time ? 'selected' : ''} ${slot.status}`}
                                        onClick={() => handleTimeSelect(slot)}
                                        disabled={slot.status === 'full'}
                                      >
                                        <span className="timeslot-time">{slot.time}</span>
                                        <span className="timeslot-badge booking-slot-badge">{slot.note}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              {inlineErrors.time && <p className="form-error-inline booking-inline-alert">{inlineErrors.time}</p>}

                              {selectedTimeSuggestions.length > 0 && inlineErrors.time && (
                                <div className="booking-slot-suggestions">
                                  <span>Gợi ý khung giờ thay thế gần nhất:</span>
                                  <div>
                                    {selectedTimeSuggestions.map((timeValue) => (
                                      <button key={timeValue} type="button" onClick={() => handleSelectSuggestedTime(timeValue)}>
                                        {timeValue}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </section>

                      <section className={`booking-editorial-card booking-seating-section ${formData.time ? '' : 'is-disabled'}`}>
                        <div className="booking-section-head">
                          <div>
                            <p className="booking-side-kicker">Ưu tiên chỗ ngồi</p>
                            <h3>Ưu tiên chỗ ngồi</h3>
                          </div>
                          <span className="booking-inline-note">Tùy chọn</span>
                        </div>

                        <p className="booking-field-note booking-seat-disclaimer">
                          Nhà hàng sẽ cố gắng sắp xếp theo yêu cầu, tùy tình trạng bàn thực tế tại thời điểm xác nhận.
                        </p>

                        {!formData.time ? (
                          <div className="booking-seat-note-banner">
                            <strong>Chọn giờ trước:</strong> Chọn giờ trước để xem ưu tiên chỗ ngồi khả dụng.
                          </div>
                        ) : (
                          <>
                            <div className="booking-seat-note-banner">
                              <strong>Lưu ý vận hành:</strong> {selectedSeatOperationalNote}
                            </div>

                              <div className="booking-seating-grid-premium">
                              {SEATING_AREAS.map((area) => {
                                const disabled = shouldDisableSeatOption(area.value, guestCount)
                                const isSelected = formData.seatingArea === area.value
                                const disabledHint = getSeatDisabledHint(area.value, guestCount)

                                return (
                                  <label
                                    key={area.value}
                                    className={`seating-area-option booking-seat-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                                  >
                                    <input
                                      type="radio"
                                      name="seatingArea"
                                      value={area.value}
                                      checked={isSelected}
                                      onChange={() => handleSeatingSelect(area.value)}
                                      disabled={disabled}
                                    />
                                    <div className="booking-seat-card-top">
                                      <span className="seating-area-icon">{area.icon}</span>
                                      <span className="booking-seat-status">{isSelected ? 'Đang ưu tiên' : 'Có thể chọn'}</span>
                                    </div>
                                    <span className="seating-area-name">{area.label}</span>
                                    <span className="seating-area-desc">{area.desc}</span>
                                    <span className="booking-seat-note">{getSeatOperationalNote(area.value)}</span>
                                    {disabled && <span className="seating-area-limit">{disabledHint}</span>}
                                  </label>
                                )
                              })}
                            </div>
                          </>
                        )}
                      </section>


                      {formData.time && selectedMealDurationText && (
                        <div className="booking-seat-note-banner">
                          <strong>Dự kiến sử dụng bàn:</strong> {selectedMealDurationText}
                        </div>
                      )}

                      {formData.time && bookingOperationalRules.length > 0 && (
                        <section className="booking-editorial-card">
                          <div className="booking-section-head">
                            <div>
                              <p className="booking-side-kicker">Vận hành</p>
                              <h3>Thông tin cần lưu ý</h3>
                            </div>
                          </div>
                          <div className="booking-policy-notes booking-policy-notes-premium">
                            {bookingOperationalRules.slice(0, 3).map((item) => (
                              <div className="policy-item" key={item.text}>
                                <span className="policy-icon">{item.icon}</span>
                                <span>{item.text}</span>
                              </div>
                            ))}
                          </div>
                          {bookingOperationalRules.length > 3 && (
                            <div className="booking-policy-notes booking-policy-notes-premium booking-policy-notes-secondary">
                              {bookingOperationalRules.slice(3).map((item) => (
                                <div className="policy-item" key={item.text}>
                                  <span className="policy-icon">{item.icon}</span>
                                  <span>{item.text}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      )}

                      <div className="booking-action-row">
                        <button type="button" className="booking-primary-btn" onClick={handleStepOneContinue}>
                          {primaryCtaLabel}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="booking-step booking-step-premium">
                      <section className="booking-editorial-card booking-summary-ribbon">
                        <div className="booking-summary-inline">
                          <span>{guestCount} khách</span>
                          <span>{formatDateDisplay(formData.date)}</span>
                          <span>{formData.time}</span>
                          <span>{getSeatSummaryText(formData.seatingArea)}</span>
                          {selectedMealDurationText && <span>{selectedMealDurationText}</span>}
                        </div>
                        <button type="button" className="summary-edit-btn" onClick={() => goToStep(1)}>
                          Chỉnh sửa bước 1
                        </button>
                      </section>

                      <section className="booking-editorial-card">
                        <div className="booking-section-head">
                          <div>
                            <p className="booking-side-kicker">Thông tin liên hệ</p>
                            <h3>Ai sẽ đến dùng bữa?</h3>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-field">
                            <label className="form-label" htmlFor="booking-name">Họ và tên</label>
                            <input
                              id="booking-name"
                              type="text"
                              name="name"
                              className={`form-input ${inlineErrors.name ? 'form-input-error' : ''}`}
                              placeholder="Nguyễn Văn A"
                              value={formData.name}
                              onChange={handleChange}
                              autoFocus
                            />
                            {inlineErrors.name && <span className="form-error-inline">{inlineErrors.name}</span>}
                          </div>

                          <div className="form-field">
                            <label className="form-label" htmlFor="booking-phone">Số điện thoại</label>
                            <input
                              id="booking-phone"
                              type="tel"
                              name="phone"
                              className={`form-input ${inlineErrors.phone ? 'form-input-error' : ''}`}
                              placeholder="0901 234 567"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                            {inlineErrors.phone ? (
                              <span className="form-error-inline">{inlineErrors.phone}</span>
                            ) : (
                              <span className="booking-field-note">Nhà hàng sẽ dùng số này để xác nhận booking nếu cần.</span>
                            )}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-field">
                            <label className="form-label" htmlFor="booking-email">Email (tùy chọn)</label>
                            <input
                              id="booking-email"
                              type="email"
                              name="email"
                              className="form-input"
                              placeholder="email@example.com"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            <span className="booking-field-note">Tùy chọn, dùng để nhận thông tin nếu cần.</span>
                          </div>

                          <div className="form-field">
                            <label className="form-label" htmlFor="booking-occasion">Dịp dùng bữa (tùy chọn)</label>
                            <select
                              id="booking-occasion"
                              name="occasion"
                              className="form-input"
                              value={formData.occasion}
                              onChange={handleChange}
                            >
                              <option value="">Không có</option>
                              {OCCASIONS.map((occ) => (
                                <option key={occ} value={occ}>{occ}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="form-field">
                          <label className="form-label" htmlFor="booking-notes">Ghi chú (tùy chọn)</label>
                          <div className="booking-note-chips">
                            {NOTE_SUGGESTIONS.map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                className="booking-note-chip"
                                onClick={() => handleNoteSuggestion(suggestion)}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                          <textarea
                            id="booking-notes"
                            name="notes"
                            className="form-textarea"
                            placeholder="VD: Dị ứng thực phẩm, cần ghế em bé, muốn chỗ yên tĩnh, đến trễ khoảng 10 phút..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                          />
                        </div>
                      </section>

                      <div className="booking-action-row booking-action-row-split">
                        <button type="button" className="booking-secondary-btn" onClick={() => goToStep(1)}>
                          Quay lại bước trước
                        </button>
                        <button type="button" className="booking-primary-btn" onClick={handleStepTwoContinue}>
                          {primaryCtaLabel}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="booking-step booking-step-premium">
                      <section className="booking-review-grid">
                        <article className="booking-editorial-card booking-review-card-main">
                          <div className="booking-section-head">
                            <div>
                              <p className="booking-side-kicker">Xác nhận cuối</p>
                              <h3>Xem lại đầy đủ thông tin trước khi gửi</h3>
                            </div>
                          </div>

                          <div className="booking-review-list">
                            <div className="booking-review-item booking-review-item-primary"><span>Số khách</span><strong>{formData.guests} khách</strong></div>
                            <div className="booking-review-item booking-review-item-primary"><span>Ngày dùng bữa</span><strong>{formatDateDisplay(formData.date)}</strong></div>
                            <div className="booking-review-item booking-review-item-primary"><span>Khung giờ</span><strong>{formData.time}</strong></div>
                            <div className="booking-review-item booking-review-item-primary"><span>Dự kiến sử dụng bàn</span><strong>{getMealDurationText(guestCount, formData.time)}</strong></div>
                            <div className="booking-review-item booking-review-item-primary"><span>Khu vực ưu tiên</span><strong>{getSeatSummaryText(formData.seatingArea)}</strong></div>
                            <div className="booking-review-item booking-review-item-primary"><span>Trạng thái sau khi gửi</span><strong>{BOOKING_STATUS_LABELS[getBookingSubmissionStatus({ seatingArea: formData.seatingArea, guestCount, time: formData.time, notes: formData.notes })]}</strong></div>
                            <div className="booking-review-item booking-review-item-primary"><span>Khách liên hệ</span><strong>{formData.name}</strong></div>
                            <div className="booking-review-item booking-review-item-primary"><span>Số điện thoại</span><strong>{formData.phone}</strong></div>
                            {formData.email && <div className="booking-review-item"><span>Email</span><strong>{formData.email}</strong></div>}
                            {formData.occasion && <div className="booking-review-item"><span>Dịp</span><strong>{formData.occasion}</strong></div>}
                            <div className="booking-review-item booking-review-item-note"><span>Lưu ý vận hành</span><strong>{selectedSeatOperationalNote}</strong></div>
                            {formData.notes && <div className="booking-review-item booking-review-item-notes"><span>Ghi chú thêm</span><strong>{formData.notes}</strong></div>}
                          </div>
                        </article>

                        <aside className="booking-editorial-card booking-policy-card-premium">
                          <div className="booking-section-head compact">
                            <div>
                              <p className="booking-side-kicker">Điều kiện giữ bàn</p>
                              <h3>Chính sách giữ bàn</h3>
                            </div>
                          </div>

                          <div className="booking-keep-table-note">
                            <strong>Giữ bàn 15 phút</strong>
                            <span>Nhà hàng giữ bàn tối đa 15 phút kể từ giờ hẹn trước khi cần sắp xếp lại.</span>
                          </div>

                          <div className="booking-policy-notes booking-policy-notes-premium">
                            {getPolicyItems(guestCount, formData.seatingArea, formData.time).map((item) => (
                              <div className="policy-item" key={item.text}>
                                <span className="policy-icon">{item.icon}</span>
                                <span>{item.text}</span>
                              </div>
                            ))}
                          </div>

                          {submitError && <p className="form-error" role="alert">{submitError}</p>}

                          <div className="booking-confirm-panel">
                            <button type="submit" className="booking-primary-btn booking-confirm-btn">
                              {primaryCtaLabel}
                            </button>
                            <button type="button" className="booking-secondary-btn" onClick={() => goToStep(2)}>
                              Quay lại chỉnh sửa
                            </button>
                          </div>
                        </aside>
                      </section>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookingPage
