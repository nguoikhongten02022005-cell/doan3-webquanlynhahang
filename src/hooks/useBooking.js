import { useCallback } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import {
  BOOKING_SEATING_LABELS,
  HOST_BOOKING_STATUS_ACTIONS,
} from '../data/bookingData'
import { generateBookingCode, getMealDuration } from '../utils/booking/submission'
import { getTables, saveTables, TABLE_STATUSES } from '../services/tableService'
import { getStorageJSON, removeStorageItem, setStorageJSON } from '../services/storageService'

export const BOOKING_DATA_CHANGED_EVENT = 'booking:data-changed'

const ACTIVE_BOOKING_STATUSES = new Set([
  'CHO_XAC_NHAN',
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])

const COMPLETED_BOOKING_STATUSES = new Set([
  'DA_HOAN_THANH',
  'DA_HUY',
  'KHONG_DEN',
  'TU_CHOI_HET_CHO',
])

const dispatchBookingDataChanged = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(BOOKING_DATA_CHANGED_EVENT))
}

const formatDate = (value) => {
  if (!value) return '--'

  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return '--'

  return `${day}/${month}/${year}`
}

const formatBookingId = (bookingId) => `DB-${String(bookingId).slice(-6)}`
const formatBookingDateTime = (booking) => `${formatDate(booking.date)} ${booking.time || ''}`.trim()

const mapBookingStatus = (status) => {
  if (!status) return '🟡 Yêu cầu đặt bàn'
  if (status === 'CHO_XAC_NHAN' || status === 'YEU_CAU_DAT_BAN') return '🟡 Yêu cầu đặt bàn'
  if (status === 'GIU_CHO_TAM') return '🟠 Đã giữ chỗ tạm'
  if (status === 'DA_XAC_NHAN') return '🟢 Đã xác nhận'
  if (status === 'CAN_GOI_LAI') return '📞 Cần gọi lại'
  if (status === 'DA_CHECK_IN') return '🟣 Đã check-in'
  if (status === 'DA_XEP_BAN') return '🍽️ Đã vào bàn'
  if (status === 'TU_CHOI_HET_CHO' || status === 'DA_HUY') return '🔴 Từ chối / hết chỗ'
  if (status === 'KHONG_DEN') return '⚫ Không đến'
  if (status === 'DA_HOAN_THANH') return '⚪ Đã hoàn thành'
  return status
}

const isCheckedInStatus = (status) => status === 'DA_CHECK_IN' || status === 'DA_XEP_BAN'
const isCompletedStatus = (status) => COMPLETED_BOOKING_STATUSES.has(status)

const EDITABLE_INTERNAL_BOOKING_STATUSES = new Set([
  'CHO_XAC_NHAN',
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
])

const INTERNAL_BOOKING_CREATE_STATUSES = new Set([
  'CHO_XAC_NHAN',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
])

const MANUAL_STATUS_TRANSITIONS = {
  YEU_CAU_DAT_BAN: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  CHO_XAC_NHAN: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  CAN_GOI_LAI: new Set(['GIU_CHO_TAM', 'DA_XAC_NHAN', 'DA_HUY', 'TU_CHOI_HET_CHO']),
  GIU_CHO_TAM: new Set(['DA_XAC_NHAN', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN', 'TU_CHOI_HET_CHO']),
  DA_XAC_NHAN: new Set(['GIU_CHO_TAM', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN']),
  DA_GHI_NHAN: new Set(['GIU_CHO_TAM', 'DA_CHECK_IN', 'DA_HUY', 'KHONG_DEN']),
  DA_CHECK_IN: new Set(['DA_XEP_BAN', 'DA_HOAN_THANH']),
  DA_XEP_BAN: new Set(['DA_HOAN_THANH']),
}

const canCancelBooking = (status) => (
  status === 'CHO_XAC_NHAN'
  || status === 'YEU_CAU_DAT_BAN'
  || status === 'GIU_CHO_TAM'
  || status === 'CAN_GOI_LAI'
)

const canEditInternalBooking = (booking) => {
  if (!booking) {
    return false
  }

  return !isCheckedInStatus(booking.status) && !isCompletedStatus(booking.status) && EDITABLE_INTERNAL_BOOKING_STATUSES.has(booking.status)
}

const getMetadataPatchForInternalBooking = (payload) => ({
  name: payload.name,
  phone: payload.phone,
  email: payload.email,
  guests: payload.guests,
  date: payload.date,
  time: payload.time,
  seatingArea: payload.seatingArea,
  notes: payload.notes,
  internalNote: payload.internalNote,
  occasion: payload.occasion,
})

const canManuallyTransitionBooking = (booking, nextStatus) => {
  if (!booking || !nextStatus || booking.status === nextStatus) {
    return false
  }

  if (isCompletedStatus(booking.status)) {
    return false
  }

  const allowedStatuses = MANUAL_STATUS_TRANSITIONS[booking.status]
  if (!allowedStatuses || !allowedStatuses.has(nextStatus)) {
    return false
  }

  if ((nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN') && !normalizeAssignedTableIds(booking.assignedTableIds).length) {
    return false
  }

  return true
}

const readBookings = () => {
  const parsedBookings = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])

  if (!Array.isArray(parsedBookings)) {
    return []
  }

  return parsedBookings
}

const normalizeAssignedTableIds = (value) => (
  Array.isArray(value)
    ? value.map((tableId) => String(tableId).trim()).filter(Boolean)
    : []
)

const normalizeBooking = (booking) => {
  if (!booking || typeof booking !== 'object') {
    return null
  }

  const normalizedId = Number.parseInt(booking.id, 10)

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    return null
  }

  const normalizedStatus = String(booking.status || 'CHO_XAC_NHAN').trim() || 'CHO_XAC_NHAN'
  const assignedTableIds = normalizeAssignedTableIds(booking.assignedTableIds)

  return {
    id: normalizedId,
    bookingCode: String(booking.bookingCode || formatBookingId(normalizedId)).trim() || formatBookingId(normalizedId),
    guests: String(booking.guests ?? '').trim(),
    date: String(booking.date ?? '').trim(),
    time: String(booking.time ?? '').trim(),
    seatingArea: String(booking.seatingArea ?? 'KHONG_UU_TIEN').trim() || 'KHONG_UU_TIEN',
    notes: String(booking.notes ?? '').trim(),
    name: String(booking.name ?? '').trim(),
    phone: String(booking.phone ?? '').trim(),
    email: String(booking.email ?? '').trim(),
    status: normalizedStatus,
    source: String(booking.source ?? 'web').trim() || 'web',
    createdAt: String(booking.createdAt ?? '').trim(),
    updatedAt: String(booking.updatedAt ?? '').trim(),
    userEmail: booking.userEmail ?? null,
    occasion: String(booking.occasion ?? '').trim(),
    confirmationChannel: Array.isArray(booking.confirmationChannel)
      ? booking.confirmationChannel.filter(Boolean)
      : booking.confirmationChannel
        ? [String(booking.confirmationChannel)]
        : [],
    internalNote: String(booking.internalNote ?? '').trim(),
    assignedTableIds,
    checkedInAt: String(booking.checkedInAt ?? '').trim(),
    seatedAt: String(booking.seatedAt ?? '').trim(),
    completedAt: String(booking.completedAt ?? '').trim(),
    cancelledAt: String(booking.cancelledAt ?? '').trim(),
    noShowAt: String(booking.noShowAt ?? '').trim(),
    createdBy: String(booking.createdBy ?? '').trim(),
  }
}

const mapBookingItem = (booking) => ({
  bookingId: booking.id,
  id: formatBookingId(booking.id),
  dateTime: formatBookingDateTime(booking),
  guests: Number(booking.guests) || 0,
  seatingArea: BOOKING_SEATING_LABELS[booking.seatingArea] || '',
  rawStatus: booking.status || 'CHO_XAC_NHAN',
  status: mapBookingStatus(booking.status),
})

const getTableLookup = (tables) => new Map(tables.map((table) => [table.id, table]))

const hydrateBookingsWithTables = (bookings, tables) => {
  const tableLookup = getTableLookup(tables)

  return bookings.map((booking) => {
    const assignedTableIds = normalizeAssignedTableIds(booking.assignedTableIds)
    const assignedTables = assignedTableIds
      .map((tableId) => tableLookup.get(tableId))
      .filter(Boolean)

    return {
      ...booking,
      assignedTableIds,
      assignedTables,
    }
  })
}

const loadBookingHistory = (userEmail) => {
  const parsedBookings = readAllBookings()
  const normalizedUserEmail = String(userEmail ?? '').trim().toLowerCase()

  return [...parsedBookings]
    .filter((booking) => {
      if (!normalizedUserEmail) {
        return false
      }

      return String(booking.userEmail ?? booking.email ?? '').trim().toLowerCase() === normalizedUserEmail
    })
    .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    .map(mapBookingItem)
}

const readQueueStatuses = () => {
  const parsed = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
  if (!Array.isArray(parsed)) return new Map()

  try {
    return new Map(parsed.map((item) => [item.bookingCode, item.status]))
  } catch {
    return new Map()
  }
}

const normalizeBookings = (bookings) => {
  const queueStatusMap = readQueueStatuses()

  return bookings
    .map(normalizeBooking)
    .filter(Boolean)
    .map((booking) => {
      const queueStatus = queueStatusMap.get(booking.bookingCode)
      return queueStatus && queueStatus !== booking.status
        ? { ...booking, status: queueStatus }
        : booking
    })
}

const readAllBookings = () => {
  const parsed = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])
  if (!Array.isArray(parsed)) return []

  try {
    const bookings = normalizeBookings(parsed)
    return hydrateBookingsWithTables(bookings, getTables())
  } catch {
    return []
  }
}

const syncBookingsToQueue = (bookings, tables = getTables()) => {
  const normalizedBookings = normalizeBookings(bookings)
  saveTables(tables)
  setStorageJSON(STORAGE_KEYS.BOOKINGS, normalizedBookings)

  const queue = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
  if (Array.isArray(queue)) {
    try {
      const nextQueue = queue.map((item) => {
        const matchedBooking = normalizedBookings.find((booking) => item.bookingCode === booking.bookingCode)
        return matchedBooking
          ? {
              ...item,
              status: matchedBooking.status,
              assignedTableIds: matchedBooking.assignedTableIds,
            }
          : item
      })

      setStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, nextQueue)
    } catch {
      // noop
    }
  }

  dispatchBookingDataChanged()
  return hydrateBookingsWithTables(normalizedBookings, tables)
}

const updateTablesForBooking = ({ booking, tables, nextStatus, assignedTableIds = booking.assignedTableIds ?? [] }) => {
  const normalizedAssignedTableIds = normalizeAssignedTableIds(assignedTableIds)
  const occupiedTimestamp = booking.checkedInAt || new Date().toISOString()

  return tables.map((table) => {
    if (!normalizedAssignedTableIds.includes(table.id)) {
      return table.activeBookingId === booking.id && !ACTIVE_BOOKING_STATUSES.has(nextStatus)
        ? {
            ...table,
            status: TABLE_STATUSES.AVAILABLE,
            activeBookingId: null,
            activeBookingCode: '',
            occupiedAt: '',
            releasedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : table
    }

    if (!ACTIVE_BOOKING_STATUSES.has(nextStatus)) {
      return {
        ...table,
        status: TABLE_STATUSES.AVAILABLE,
        activeBookingId: null,
        activeBookingCode: '',
        occupiedAt: '',
        releasedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    return {
      ...table,
      status: nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN'
        ? TABLE_STATUSES.OCCUPIED
        : TABLE_STATUSES.HELD,
      activeBookingId: booking.id,
      activeBookingCode: booking.bookingCode,
      occupiedAt: nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN' ? occupiedTimestamp : table.occupiedAt,
      releasedAt: '',
      updatedAt: new Date().toISOString(),
    }
  })
}

const buildBookingStatusPatch = (booking, nextStatus) => {
  const timestamp = new Date().toISOString()

  return {
    ...booking,
    status: nextStatus,
    updatedAt: timestamp,
    checkedInAt: nextStatus === 'DA_CHECK_IN' || nextStatus === 'DA_XEP_BAN' ? booking.checkedInAt || timestamp : booking.checkedInAt,
    seatedAt: nextStatus === 'DA_XEP_BAN' ? timestamp : booking.seatedAt,
    completedAt: nextStatus === 'DA_HOAN_THANH' ? timestamp : booking.completedAt,
    cancelledAt: nextStatus === 'DA_HUY' || nextStatus === 'TU_CHOI_HET_CHO' ? timestamp : booking.cancelledAt,
    noShowAt: nextStatus === 'KHONG_DEN' ? timestamp : booking.noShowAt,
  }
}

const updateBookingStatus = (bookings, bookingId, nextStatus) => {
  const tables = getTables()
  let updatedBooking = null

  const nextBookings = bookings.map((booking) => {
    if (String(booking.id) !== String(bookingId)) {
      return booking
    }

    updatedBooking = buildBookingStatusPatch(booking, nextStatus)
    return updatedBooking
  })

  if (!updatedBooking) {
    return hydrateBookingsWithTables(normalizeBookings(bookings), tables)
  }

  const nextTables = updateTablesForBooking({
    booking: updatedBooking,
    tables,
    nextStatus,
    assignedTableIds: updatedBooking.assignedTableIds,
  })

  return syncBookingsToQueue(nextBookings, nextTables)
}

const getNextBookingId = (bookings) => bookings.reduce((maxId, booking) => Math.max(maxId, Number(booking.id) || 0), 0) + 1

const validateAssignedTables = ({ assignedTableIds, tables, guestCount, preferredArea, bookingId }) => {
  const selectedTables = assignedTableIds
    .map((tableId) => tables.find((table) => table.id === tableId))
    .filter(Boolean)

  if (selectedTables.length !== assignedTableIds.length) {
    return { success: false, error: 'Có bàn không tồn tại hoặc đã bị thay đổi. Vui lòng tải lại dữ liệu.' }
  }

  const busyTable = selectedTables.find((table) => table.activeBookingId && String(table.activeBookingId) !== String(bookingId))
  if (busyTable) {
    return { success: false, error: `Bàn ${busyTable.code} hiện đang được sử dụng.` }
  }

  const invalidStatusTable = selectedTables.find((table) => table.status === TABLE_STATUSES.DIRTY)
  if (invalidStatusTable) {
    return { success: false, error: `Bàn ${invalidStatusTable.code} đang ở trạng thái dọn bàn.` }
  }

  const totalCapacity = selectedTables.reduce((sum, table) => sum + table.capacity, 0)
  if (guestCount > 0 && totalCapacity < guestCount) {
    return { success: false, error: 'Tổng sức chứa bàn được chọn chưa đủ số khách.' }
  }

  if (preferredArea && preferredArea !== 'KHONG_UU_TIEN') {
    const hasWrongArea = selectedTables.some((table) => table.areaId !== preferredArea)
    if (hasWrongArea) {
      return { success: false, error: 'Bàn được chọn không khớp khu vực ưu tiên của booking.' }
    }
  }

  return { success: true }
}

const assignTablesForBooking = ({ bookings, bookingId, tableIds }) => {
  const tables = getTables()
  const normalizedTableIds = normalizeAssignedTableIds(tableIds)
  const booking = bookings.find((item) => String(item.id) === String(bookingId))

  if (!booking) {
    return { success: false, error: 'Không tìm thấy booking cần gán bàn.' }
  }

  const validation = validateAssignedTables({
    assignedTableIds: normalizedTableIds,
    tables,
    guestCount: Number(booking.guests) || 0,
    preferredArea: booking.seatingArea,
    bookingId: booking.id,
  })

  if (!validation.success) {
    return validation
  }

  const timestamp = new Date().toISOString()
  const nextBookings = bookings.map((item) => (
    String(item.id) === String(bookingId)
      ? {
          ...item,
          assignedTableIds: normalizedTableIds,
          updatedAt: timestamp,
          status: item.status === 'YEU_CAU_DAT_BAN' || item.status === 'CHO_XAC_NHAN'
            ? 'GIU_CHO_TAM'
            : item.status,
        }
      : item
  ))

  const updatedBooking = nextBookings.find((item) => String(item.id) === String(bookingId))
  const releasedTables = tables.map((table) => (
    table.activeBookingId === booking.id && !normalizedTableIds.includes(table.id)
      ? {
          ...table,
          status: TABLE_STATUSES.AVAILABLE,
          activeBookingId: null,
          activeBookingCode: '',
          occupiedAt: '',
          releasedAt: timestamp,
          updatedAt: timestamp,
        }
      : table
  ))

  const nextTables = updateTablesForBooking({
    booking: updatedBooking,
    tables: releasedTables,
    nextStatus: updatedBooking.status,
    assignedTableIds: normalizedTableIds,
  })

  return {
    success: true,
    bookings: syncBookingsToQueue(nextBookings, nextTables),
  }
}

export const useBooking = () => {
  const saveDraft = useCallback((draftPayload) => {
    setStorageJSON(STORAGE_KEYS.BOOKING_DRAFT, draftPayload)
  }, [])

  const getDraft = useCallback(() => getStorageJSON(STORAGE_KEYS.BOOKING_DRAFT, null), [])

  const clearDraft = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)
  }, [])

  const createBooking = useCallback(({ booking, confirmationPayload, receptionQueueItem }) => {
    const storedBookings = getStorageJSON(STORAGE_KEYS.BOOKINGS, [])
    const bookings = Array.isArray(storedBookings) ? storedBookings : []
    const nextBookings = [...bookings, normalizeBooking(booking)].filter(Boolean)

    setStorageJSON(STORAGE_KEYS.LAST_BOOKING_CONFIRMATION, confirmationPayload)
    removeStorageItem(STORAGE_KEYS.BOOKING_DRAFT)

    const receptionQueue = getStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [])
    const safeReceptionQueue = Array.isArray(receptionQueue) ? receptionQueue : []
    setStorageJSON(STORAGE_KEYS.RECEPTION_QUEUE, [...safeReceptionQueue, receptionQueueItem])
    syncBookingsToQueue(nextBookings, getTables())
  }, [])

  const createInternalBooking = useCallback((payload, actor) => {
    const currentBookings = normalizeBookings(readBookings())
    const nextId = getNextBookingId(currentBookings)
    const timestamp = new Date().toISOString()
    const initialStatus = INTERNAL_BOOKING_CREATE_STATUSES.has(payload.status) ? payload.status : 'DA_XAC_NHAN'
    const booking = normalizeBooking({
      id: nextId,
      bookingCode: generateBookingCode(),
      guests: payload.guests,
      date: payload.date,
      time: payload.time,
      seatingArea: payload.seatingArea,
      notes: payload.notes,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      status: initialStatus,
      source: 'internal',
      createdAt: timestamp,
      updatedAt: timestamp,
      userEmail: payload.email || null,
      occasion: payload.occasion,
      confirmationChannel: ['Nội bộ'],
      internalNote: payload.internalNote,
      assignedTableIds: [],
      createdBy: actor?.email || actor?.username || 'internal',
    })

    if (!booking) {
      return { success: false, error: 'Dữ liệu booking nội bộ không hợp lệ.' }
    }

    return {
      success: true,
      booking,
      bookings: syncBookingsToQueue([...currentBookings, booking], getTables()),
    }
  }, [])

  const updateInternalBooking = useCallback((bookingId, payload) => {
    const currentBookings = normalizeBookings(readBookings())
    const matchedBooking = currentBookings.find((booking) => String(booking.id) === String(bookingId))

    if (!matchedBooking) {
      return { success: false, error: 'Không tìm thấy booking cần cập nhật.' }
    }

    if (!canEditInternalBooking(matchedBooking)) {
      return { success: false, error: 'Booking đang phục vụ hoặc đã kết thúc nên không thể sửa bằng form này.' }
    }

    const updatedBooking = normalizeBooking({
      ...matchedBooking,
      ...getMetadataPatchForInternalBooking(payload),
      id: matchedBooking.id,
      status: matchedBooking.status,
      assignedTableIds: matchedBooking.assignedTableIds,
      updatedAt: new Date().toISOString(),
    })

    if (!updatedBooking) {
      return { success: false, error: 'Dữ liệu booking sau khi cập nhật không hợp lệ.' }
    }

    const currentTables = getTables()
    if (updatedBooking.assignedTableIds.length > 0) {
      const assignedTablesValidation = validateAssignedTables({
        assignedTableIds: updatedBooking.assignedTableIds,
        tables: currentTables,
        guestCount: Number(updatedBooking.guests) || 0,
        preferredArea: updatedBooking.seatingArea,
        bookingId: updatedBooking.id,
      })

      if (!assignedTablesValidation.success) {
        return { success: false, error: 'Thông tin mới không còn khớp với các bàn đang gán. Hãy cập nhật gán bàn trước khi lưu.' }
      }
    }

    const nextBookings = currentBookings.map((booking) => (
      String(booking.id) === String(bookingId)
        ? updatedBooking
        : booking
    ))

    const nextTables = updateTablesForBooking({
      booking: updatedBooking,
      tables: currentTables,
      nextStatus: updatedBooking.status,
      assignedTableIds: updatedBooking.assignedTableIds,
    })

    return {
      success: true,
      booking: updatedBooking,
      bookings: syncBookingsToQueue(nextBookings, nextTables),
    }
  }, [])

  const assignBookingTables = useCallback((bookingId, tableIds) => {
    const result = assignTablesForBooking({ bookings: normalizeBookings(readBookings()), bookingId, tableIds })

    if (!result.success) {
      return result
    }

    return {
      success: true,
      bookings: result.bookings,
    }
  }, [])

  const setBookingCheckedIn = useCallback((bookingId) => {
    const currentBookings = normalizeBookings(readBookings())
    const matchedBooking = currentBookings.find((booking) => String(booking.id) === String(bookingId))

    if (!matchedBooking) {
      return { success: false, error: 'Không tìm thấy booking để check-in.' }
    }

    if (isCompletedStatus(matchedBooking.status) || isCheckedInStatus(matchedBooking.status)) {
      return { success: false, error: 'Booking này không còn hợp lệ để check-in.' }
    }

    if ((matchedBooking.assignedTableIds || []).length === 0) {
      return { success: false, error: 'Cần gán bàn trước khi check-in.' }
    }

    return {
      success: true,
      bookings: updateBookingStatus(currentBookings, bookingId, 'DA_CHECK_IN'),
    }
  }, [])

  const setBookingCompleted = useCallback((bookingId) => {
    const currentBookings = normalizeBookings(readBookings())
    const matchedBooking = currentBookings.find((booking) => String(booking.id) === String(bookingId))

    if (!matchedBooking) {
      return { success: false, error: 'Không tìm thấy booking để hoàn thành.' }
    }

    if (!isCheckedInStatus(matchedBooking.status)) {
      return { success: false, error: 'Chỉ có thể hoàn thành booking đã check-in hoặc đã vào bàn.' }
    }

    return {
      success: true,
      bookings: updateBookingStatus(currentBookings, bookingId, 'DA_HOAN_THANH'),
    }
  }, [])

  const setBookingNoShow = useCallback((bookingId) => {
    const currentBookings = normalizeBookings(readBookings())
    const matchedBooking = currentBookings.find((booking) => String(booking.id) === String(bookingId))

    if (!matchedBooking) {
      return { success: false, error: 'Không tìm thấy booking để đánh dấu không đến.' }
    }

    if (isCheckedInStatus(matchedBooking.status) || isCompletedStatus(matchedBooking.status)) {
      return { success: false, error: 'Booking này không còn hợp lệ để đánh dấu không đến.' }
    }

    return {
      success: true,
      bookings: updateBookingStatus(currentBookings, bookingId, 'KHONG_DEN'),
    }
  }, [])

  const releaseBookingTables = useCallback(() => ({
    success: false,
    error: 'Không hỗ trợ trả bàn độc lập. Hãy hoàn thành, đánh dấu không đến hoặc hủy booking để đồng bộ trạng thái bàn.',
  }), [])

  const getBookingHistory = useCallback((userEmail) => loadBookingHistory(userEmail), [])

  const cancelBooking = useCallback((bookingId, bookingCode, userEmail) => {
    const parsedBookings = getStorageJSON(STORAGE_KEYS.BOOKINGS, null)

    if (!Array.isArray(parsedBookings)) {
      return { success: false, error: 'Không thể hủy đặt bàn này. Vui lòng thử lại.' }
    }

    const bookingIndex = parsedBookings.findIndex((item) => String(item.id) === String(bookingId))

    if (bookingIndex === -1) {
      return { success: false, error: 'Không thể hủy đặt bàn này. Vui lòng thử lại.' }
    }

    if (!canCancelBooking(parsedBookings[bookingIndex].status)) {
      return { success: false, error: 'Đặt bàn đã xác nhận. Vui lòng gọi hotline để được hỗ trợ hủy.' }
    }

    const nextBookings = updateBookingStatus(normalizeBookings(parsedBookings), bookingId, 'DA_HUY')

    return {
      success: true,
      message: `Đã hủy đặt bàn ${bookingCode} thành công.`,
      bookingHistory: nextBookings
        .filter((booking) => String(booking.userEmail ?? booking.email ?? '').trim().toLowerCase() === String(userEmail ?? '').trim().toLowerCase())
        .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
        .map(mapBookingItem),
    }
  }, [])

  const getHostBookings = useCallback(() => readAllBookings(), [])

  const getHostStats = useCallback((bookings) => {
    const total = bookings.length
    const pending = bookings.filter((item) => item.status === 'YEU_CAU_DAT_BAN' || item.status === 'CAN_GOI_LAI' || item.status === 'CHO_XAC_NHAN').length
    const confirmed = bookings.filter((item) => item.status === 'DA_XAC_NHAN' || item.status === 'DA_GHI_NHAN' || item.status === 'GIU_CHO_TAM').length
    const vip = bookings.filter((item) => item.seatingArea === 'PHONG_VIP').length

    return { total, pending, confirmed, vip }
  }, [])

  const sortHostBookings = useCallback((bookings) => [...bookings].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)), [])

  const updateHostBookingStatus = useCallback((bookings, bookingId, nextStatus) => {
    const matchedBooking = bookings.find((booking) => String(booking.id) === String(bookingId))

    if (!matchedBooking || !canManuallyTransitionBooking(matchedBooking, nextStatus)) {
      return hydrateBookingsWithTables(normalizeBookings(bookings), getTables())
    }

    return updateBookingStatus(bookings, bookingId, nextStatus)
  }, [])

  const getAvailableTablesForBooking = useCallback((booking) => {
    const tables = getTables()
    const guestCount = Number(booking?.guests) || 0

    return tables.filter((table) => {
      if (table.status === TABLE_STATUSES.DIRTY) {
        return false
      }

      if (table.activeBookingId && String(table.activeBookingId) !== String(booking?.id)) {
        return false
      }

      if (booking?.seatingArea && booking.seatingArea !== 'KHONG_UU_TIEN' && table.areaId !== booking.seatingArea) {
        return false
      }

      return table.capacity >= guestCount || guestCount <= 0
    })
  }, [])

  return {
    bookingStatusActions: HOST_BOOKING_STATUS_ACTIONS,
    getDraft,
    saveDraft,
    clearDraft,
    createBooking,
    createInternalBooking,
    updateInternalBooking,
    assignBookingTables,
    setBookingCheckedIn,
    setBookingCompleted,
    setBookingNoShow,
    releaseBookingTables,
    getAvailableTablesForBooking,
    getBookingHistory,
    cancelBooking,
    getHostBookings,
    getHostStats,
    sortHostBookings,
    updateHostBookingStatus,
  }
}
