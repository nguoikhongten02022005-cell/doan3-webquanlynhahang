import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildCalendarDays,
  buildOpenDateOptions,
  focusCalendarDateButton,
  formatDateDisplay,
  getCalendarNavigationStep,
  getInitialCalendarFocusDate,
  getLocalDateString,
  getNearestSelectableDate,
  getNextOpenDate,
  isClosedDate,
} from '../utils/booking'

export const useBookingCalendar = ({ selectedDate, onDateSelect }) => {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => new Date())
  const [calendarFocusedDate, setCalendarFocusedDate] = useState('')
  const calendarContainerRef = useRef(null)

  const openDateOptions = useMemo(() => buildOpenDateOptions(new Date()), [])
  const nextOpenDate = openDateOptions[0] || getNextOpenDate(new Date())
  const todayString = getLocalDateString()
  const maxBookableDate = openDateOptions[openDateOptions.length - 1] || nextOpenDate
  const selectedDateLabel = selectedDate ? formatDateDisplay(selectedDate) : ''
  const selectedDateShort = selectedDate ? `${selectedDate.slice(8, 10)}/${selectedDate.slice(5, 7)}/${selectedDate.slice(0, 4)}` : ''
  const isSelectedDateClosed = Boolean(selectedDate && isClosedDate(selectedDate))
  const isSelectedDateOutOfRange = Boolean(selectedDate && (selectedDate < todayString || selectedDate > maxBookableDate))
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth, todayString, maxBookableDate), [calendarMonth, maxBookableDate, todayString])

  const currentMonthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
  const [todayYear, todayMonth] = todayString.split('-').map(Number)
  const todayMonthStart = new Date(todayYear, todayMonth - 1, 1)
  const canViewPreviousMonth = currentMonthStart > todayMonthStart

  useEffect(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split('-').map(Number)
      setCalendarMonth(new Date(year, month - 1, 1))
    }
  }, [selectedDate])

  useEffect(() => {
    if (!calendarOpen) return

    const initialFocusDate = getInitialCalendarFocusDate(selectedDate, nextOpenDate, todayString, maxBookableDate)
    setCalendarFocusedDate(initialFocusDate)
    focusCalendarDateButton(initialFocusDate)
  }, [calendarOpen, maxBookableDate, nextOpenDate, selectedDate, todayString])

  useEffect(() => {
    if (!calendarOpen) return undefined

    const handlePointerDownOutside = (event) => {
      if (!calendarContainerRef.current?.contains(event.target)) {
        setCalendarOpen(false)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setCalendarOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDownOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [calendarOpen])

  const toggleCalendar = (nextState) => {
    if (typeof nextState === 'boolean') {
      setCalendarOpen(nextState)
      return
    }

    setCalendarOpen((prev) => !prev)
  }

  const closeCalendar = () => {
    setCalendarOpen(false)
  }

  const handleCalendarMonthChange = (direction) => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }

  const handleCalendarDayKeyDown = (event, dateValue) => {
    const navigationStep = getCalendarNavigationStep(event.key)

    if (navigationStep) {
      event.preventDefault()
      const nextDate = getNearestSelectableDate(dateValue, navigationStep, todayString, maxBookableDate)
      setCalendarFocusedDate(nextDate)
      const [year, month] = nextDate.split('-').map(Number)
      setCalendarMonth(new Date(year, month - 1, 1))
      focusCalendarDateButton(nextDate)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onDateSelect(dateValue)
    }
  }

  return {
    calendarContainerRef,
    calendarDays,
    calendarFocusedDate,
    calendarMonth,
    calendarOpen,
    canViewPreviousMonth,
    closeCalendar,
    handleCalendarDayKeyDown,
    handleCalendarMonthChange,
    isSelectedDateClosed,
    isSelectedDateOutOfRange,
    maxBookableDate,
    nextOpenDate,
    openDateOptions,
    selectedDateLabel,
    selectedDateShort,
    setCalendarFocusedDate,
    todayString,
    toggleCalendar,
  }
}
