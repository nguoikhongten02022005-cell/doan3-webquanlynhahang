import { WEEKDAY_LABELS } from '../../data/bookingData'
import { OPEN_DATE_PICKER_DAYS, RESTAURANT_CLOSED_DATES, RESTAURANT_CLOSED_WEEKDAYS } from './constants'

export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return `${WEEKDAY_LABELS[date.getDay()]}, ${day}/${month}/${year}`
}
