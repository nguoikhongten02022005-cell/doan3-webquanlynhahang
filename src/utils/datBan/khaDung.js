import { CAC_KHUNG_GIO_DAT_BAN } from '../../data/duLieuDatBan'
import { SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN } from './hangSo'
import { layChuoiNgayDiaPhuong, laNgayDongCua } from './ngay'

export const phanTichGioThanhPhut = (value) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export const giaLapKhaDungKhungGio = (dateValue, guestCount) => {
  if (!dateValue) return { available: [], unavailable: [] }

  if (guestCount > SO_KHACH_TOI_DA_DAT_BAN_TRUC_TUYEN) {
    return {
      available: [],
      unavailable: CAC_KHUNG_GIO_DAT_BAN.map((time) => ({ time, reason: 'group_limit' })),
    }
  }

  if (laNgayDongCua(dateValue)) {
    return {
      available: [],
      unavailable: CAC_KHUNG_GIO_DAT_BAN.map((time) => ({ time, reason: 'closed' })),
    }
  }

  const today = layChuoiNgayDiaPhuong()
  const now = new Date()
  const minimumMinutes = now.getHours() * 60 + now.getMinutes() + 30

  const available = []
  const unavailable = []

  CAC_KHUNG_GIO_DAT_BAN.forEach((slot) => {
    if (dateValue === today && phanTichGioThanhPhut(slot) < minimumMinutes) {
      unavailable.push({ time: slot, reason: 'past' })
      return
    }

    const seed = dateValue.split('-').reduce((a, b) => a + Number(b), 0) + phanTichGioThanhPhut(slot)
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

const filterLunchSlots = (slots) => slots.filter((slot) => phanTichGioThanhPhut(slot.time) < 17 * 60)
const filterDinnerSlots = (slots) => slots.filter((slot) => phanTichGioThanhPhut(slot.time) >= 17 * 60)

export const taoNhomKhungGio = (slotData) => {
  const availableMap = new Map(slotData.available.map((slot) => [slot.time, slot]))
  const unavailableMap = new Map(slotData.unavailable.map((slot) => [slot.time, slot]))

  const allSlots = CAC_KHUNG_GIO_DAT_BAN.map((time) => {
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

export const timKhungGioKhaDungGanNhat = (timeValue, slotData) => {
  if (!timeValue) return []

  const availableTimes = slotData.available.map((slot) => slot.time)
  if (availableTimes.length === 0) return []

  const selectedMinutes = phanTichGioThanhPhut(timeValue)

  return availableTimes
    .map((time) => ({ time, diff: Math.abs(phanTichGioThanhPhut(time) - selectedMinutes) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3)
    .map((item) => item.time)
}
