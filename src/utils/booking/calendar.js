import { WEEKDAY_LABELS } from '../../data/bookingData'
import { getLocalDateString, isClosedDate } from './date'

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
