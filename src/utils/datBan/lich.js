import { NHAN_THU_TRONG_TUAN } from '../../data/duLieuDatBan'
import { layChuoiNgayDiaPhuong, laNgayDongCua } from './ngay'

export const laNgayCoTheChon = (dateValue, minDate, maxDate) => {
  if (!dateValue) return false
  return dateValue >= minDate && dateValue <= maxDate && !laNgayDongCua(dateValue)
}

export const taoDanhSachNgayLich = (monthDate, minDate, maxDate) => {
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
    const dateValue = layChuoiNgayDiaPhuong(new Date(year, month, day))
    const isDisabled = !laNgayCoTheChon(dateValue, minDate, maxDate)

    days.push({
      key: dateValue,
      value: dateValue,
      day,
      weekdayLabel: NHAN_THU_TRONG_TUAN[new Date(year, month, day).getDay()],
      isDisabled,
      isEmpty: false,
    })
  }

  return days
}

export const layNgayGanNhatCoTheChon = (startDateValue, step, minDate, maxDate) => {
  if (!startDateValue) return ''

  const [year, month, day] = startDateValue.split('-').map(Number)
  const cursor = new Date(year, month - 1, day)

  for (let attempt = 0; attempt < 45; attempt += 1) {
    cursor.setDate(cursor.getDate() + step)
    const nextValue = layChuoiNgayDiaPhuong(cursor)
    if (!laNgayCoTheChon(nextValue, minDate, maxDate)) continue
    return nextValue
  }

  return startDateValue
}

export const layNgayTapTrungLichBanDau = (selectedDate, fallbackDate, minDate, maxDate) => {
  if (laNgayCoTheChon(selectedDate, minDate, maxDate)) return selectedDate
  if (laNgayCoTheChon(fallbackDate, minDate, maxDate)) return fallbackDate
  return minDate
}

export const layBuocDieuHuongLich = (key) => {
  if (key === 'ArrowLeft') return -1
  if (key === 'ArrowRight') return 1
  if (key === 'ArrowUp') return -7
  if (key === 'ArrowDown') return 7
  return 0
}

export const tapTrungNutNgayLich = (dateValue) => {
  if (!dateValue) return
  window.requestAnimationFrame(() => {
    document.querySelector(`[data-calendar-date="${dateValue}"]`)?.focus()
  })
}

export const dinhDangThangLich = (date) => `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
