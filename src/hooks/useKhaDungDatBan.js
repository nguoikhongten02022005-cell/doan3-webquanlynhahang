import { useEffect, useMemo, useRef, useState } from 'react'
import {
  taoNhomKhungGio,
  timKhungGioKhaDungGanNhat,
  layThoiLuongBuaAnText,
  layQuyTacVanHanh,
  giaLapKhaDungKhungGio,
} from '../utils/datBan/index'

const AVAILABILITY_DELAY = 550

export const useKhaDungDatBan = ({ closedDate, formData, guestCount, invalidPastDate, laNhomDongChiDatQuaHotline }) => {
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotData, setSlotData] = useState({ available: [], unavailable: [] })
  const availabilityPanelRef = useRef(null)
  const firstAvailableSlotRef = useRef(null)
  const shouldScrollToAvailabilityRef = useRef(false)
  const shouldFocusFirstSlotRef = useRef(false)

  useEffect(() => {
    if (!shouldScrollToAvailabilityRef.current || !formData.date) return

    availabilityPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    shouldScrollToAvailabilityRef.current = false
  }, [formData.date])

  useEffect(() => {
    if (!shouldFocusFirstSlotRef.current || slotsLoading || !formData.date) return

    if (firstAvailableSlotRef.current) {
      firstAvailableSlotRef.current.focus()
    }

    shouldFocusFirstSlotRef.current = false
  }, [formData.date, slotData, slotsLoading])

  useEffect(() => {
    if (!formData.guests || !formData.date || invalidPastDate || closedDate || laNhomDongChiDatQuaHotline(guestCount)) {
      setSlotsLoading(false)
      setSlotData(giaLapKhaDungKhungGio(formData.date, guestCount))
      return
    }

    setSlotsLoading(true)
    const timeoutId = window.setTimeout(() => {
      setSlotData(giaLapKhaDungKhungGio(formData.date, guestCount))
      setSlotsLoading(false)
    }, AVAILABILITY_DELAY)

    return () => window.clearTimeout(timeoutId)
  }, [closedDate, formData.date, formData.guests, guestCount, invalidPastDate, laNhomDongChiDatQuaHotline])

  const slotGroups = useMemo(() => taoNhomKhungGio(slotData), [slotData])

  const firstAvailableSlotTime = useMemo(() => {
    for (const group of slotGroups) {
      const firstAvailableSlot = group.slots.find((slot) => slot.status !== 'full')
      if (firstAvailableSlot) return firstAvailableSlot.time
    }
    return ''
  }, [slotGroups])

  const recommendedSlotTime = useMemo(() => {
    for (const group of slotGroups) {
      const availableSlot = group.slots.find((slot) => slot.status === 'available')
      if (availableSlot) return availableSlot.time
    }
    return firstAvailableSlotTime
  }, [firstAvailableSlotTime, slotGroups])

  const selectedTimeSuggestions = useMemo(() => timKhungGioKhaDungGanNhat(formData.time, slotData), [formData.time, slotData])
  const selectedMealDurationText = useMemo(() => (formData.time ? layThoiLuongBuaAnText(guestCount, formData.time) : ''), [formData.time, guestCount])
  const bookingOperationalRules = useMemo(() => layQuyTacVanHanh(guestCount, formData.seatingArea, formData.time), [formData.seatingArea, formData.time, guestCount])

  const requestScrollToAvailability = () => {
    shouldScrollToAvailabilityRef.current = true
  }

  const requestFocusFirstSlot = () => {
    shouldFocusFirstSlotRef.current = true
  }

  return {
    availabilityPanelRef,
    bookingOperationalRules,
    firstAvailableSlotRef,
    firstAvailableSlotTime,
    recommendedSlotTime,
    requestFocusFirstSlot,
    requestScrollToAvailability,
    selectedMealDurationText,
    selectedTimeSuggestions,
    slotData,
    slotGroups,
    slotsLoading,
  }
}
