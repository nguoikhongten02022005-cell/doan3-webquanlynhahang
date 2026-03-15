import { useEffect, useMemo, useRef, useState } from 'react'
import {
  taoNhomKhungGio,
  timKhungGioKhaDungGanNhat,
  layThoiLuongBuaAnText,
  layQuyTacVanHanh,
  giaLapKhaDungKhungGio,
} from '../utils/datBan/index'

const AVAILABILITY_DELAY = 550

export const useKhaDungDatBan = ({ closedDate, formData, soLuongKhach, invalidPastDate, laNhomDongChiDatQuaHotline }) => {
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
    if (!formData.guests || !formData.date || invalidPastDate || closedDate || laNhomDongChiDatQuaHotline(soLuongKhach)) {
      setSlotsLoading(false)
      setSlotData(giaLapKhaDungKhungGio(formData.date, soLuongKhach))
      return
    }

    setSlotsLoading(true)
    const timeoutId = window.setTimeout(() => {
      setSlotData(giaLapKhaDungKhungGio(formData.date, soLuongKhach))
      setSlotsLoading(false)
    }, AVAILABILITY_DELAY)

    return () => window.clearTimeout(timeoutId)
  }, [closedDate, formData.date, formData.guests, soLuongKhach, invalidPastDate, laNhomDongChiDatQuaHotline])

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
  const selectedMealDurationText = useMemo(() => (formData.time ? layThoiLuongBuaAnText(soLuongKhach, formData.time) : ''), [formData.time, soLuongKhach])
  const bookingOperationalRules = useMemo(() => layQuyTacVanHanh(soLuongKhach, formData.seatingArea, formData.time), [formData.seatingArea, formData.time, soLuongKhach])

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
