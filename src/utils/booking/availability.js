import { BOOKING_TIME_SLOTS } from '../../data/bookingData'
import { ONLINE_BOOKING_MAX_GUESTS } from './constants'
import { getLocalDateString, isClosedDate } from './date'

export const parseTimeToMinutes = (value) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export const simulateSlotAvailability = (dateValue, guestCount) => {
  if (!dateValue) return { available: [], unavailable: [] }

  if (guestCount > ONLINE_BOOKING_MAX_GUESTS) {
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
