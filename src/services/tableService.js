import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { TABLE_AREAS } from '../pages/internalDashboard/constants.js'
import { getStorageJSON, setStorageJSON } from './storageService.js'

export const TABLE_STATUSES = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  HELD: 'HELD',
  OCCUPIED: 'OCCUPIED',
  DIRTY: 'DIRTY',
})

const DEFAULT_AREA_CAPACITIES = Object.freeze({
  SANH_CHINH: [2, 2, 4, 4, 4, 4, 6, 6, 6, 8, 8, 10],
  PHONG_VIP: [8, 8, 10, 10],
  BAN_CONG: [2, 2, 4, 4, 4, 6],
  QUAY_BAR: [1, 1, 2, 2, 2],
})

const AREA_CODE_PREFIX = Object.freeze({
  SANH_CHINH: 'SC',
  PHONG_VIP: 'VIP',
  BAN_CONG: 'BC',
  QUAY_BAR: 'BAR',
})

const ACTIVE_TABLE_STATUSES = new Set([
  TABLE_STATUSES.HELD,
  TABLE_STATUSES.OCCUPIED,
])

const normalizeTableStatus = (status) => {
  if (status === TABLE_STATUSES.HELD) return TABLE_STATUSES.HELD
  if (status === TABLE_STATUSES.OCCUPIED) return TABLE_STATUSES.OCCUPIED
  if (status === TABLE_STATUSES.DIRTY) return TABLE_STATUSES.DIRTY
  return TABLE_STATUSES.AVAILABLE
}

const createDefaultTables = () => TABLE_AREAS.flatMap((area) => {
  const capacities = DEFAULT_AREA_CAPACITIES[area.id] || Array.from({ length: area.total }, () => 4)

  return Array.from({ length: area.total }, (_, index) => {
    const sequence = String(index + 1).padStart(2, '0')
    return {
      id: `${area.id}_${sequence}`,
      code: `${AREA_CODE_PREFIX[area.id] || area.id}-${sequence}`,
      name: `${area.name} ${sequence}`,
      areaId: area.id,
      capacity: capacities[index] || capacities.at(-1) || 4,
      status: TABLE_STATUSES.AVAILABLE,
      activeBookingId: null,
      activeBookingCode: '',
      occupiedAt: '',
      releasedAt: '',
      note: '',
      updatedAt: '',
    }
  })
})

const normalizeTable = (table) => {
  if (!table || typeof table !== 'object') {
    return null
  }

  const normalizedAreaId = String(table.areaId ?? '').trim()
  const matchedArea = TABLE_AREAS.find((area) => area.id === normalizedAreaId)

  if (!matchedArea) {
    return null
  }

  const normalizedId = String(table.id ?? '').trim()
  const normalizedCode = String(table.code ?? '').trim()
  const normalizedCapacity = Number.parseInt(table.capacity, 10)

  if (!normalizedId || !normalizedCode || !Number.isInteger(normalizedCapacity) || normalizedCapacity <= 0) {
    return null
  }

  return {
    id: normalizedId,
    code: normalizedCode,
    name: String(table.name ?? `${matchedArea.name} ${normalizedCode}`).trim() || `${matchedArea.name} ${normalizedCode}`,
    areaId: matchedArea.id,
    capacity: normalizedCapacity,
    status: normalizeTableStatus(table.status),
    activeBookingId: table.activeBookingId ?? null,
    activeBookingCode: String(table.activeBookingCode ?? '').trim(),
    occupiedAt: String(table.occupiedAt ?? '').trim(),
    releasedAt: String(table.releasedAt ?? '').trim(),
    note: String(table.note ?? '').trim(),
    updatedAt: String(table.updatedAt ?? '').trim(),
  }
}

const normalizeTables = (tables) => {
  if (!Array.isArray(tables)) {
    return null
  }

  const seenIds = new Set()

  return tables
    .map(normalizeTable)
    .filter((table) => {
      if (!table || seenIds.has(table.id)) {
        return false
      }

      seenIds.add(table.id)
      return true
    })
}

const DEFAULT_TABLES = createDefaultTables()

const cloneDefaultTables = () => DEFAULT_TABLES.map((table) => ({ ...table }))

export const getTables = () => {
  const storedTables = getStorageJSON(STORAGE_KEYS.TABLES, null)

  if (storedTables === null) {
    const defaultTables = cloneDefaultTables()
    setStorageJSON(STORAGE_KEYS.TABLES, defaultTables)
    return defaultTables
  }

  const normalizedTables = normalizeTables(storedTables)

  if (!normalizedTables || normalizedTables.length === 0) {
    const defaultTables = cloneDefaultTables()
    setStorageJSON(STORAGE_KEYS.TABLES, defaultTables)
    return defaultTables
  }

  return normalizedTables
}

export const saveTables = (tables) => {
  const normalizedTables = normalizeTables(tables)

  if (!normalizedTables || normalizedTables.length === 0) {
    return null
  }

  setStorageJSON(STORAGE_KEYS.TABLES, normalizedTables)
  return normalizedTables
}

export const updateTableStatus = (tableId, nextStatus) => {
  const tables = getTables()
  const timestamp = new Date().toISOString()
  const nextTables = tables.map((table) => (
    table.id === tableId
      ? {
          ...table,
          status: normalizeTableStatus(nextStatus),
          activeBookingId: nextStatus === TABLE_STATUSES.DIRTY ? null : table.activeBookingId,
          activeBookingCode: nextStatus === TABLE_STATUSES.DIRTY ? '' : table.activeBookingCode,
          occupiedAt: nextStatus === TABLE_STATUSES.AVAILABLE || nextStatus === TABLE_STATUSES.DIRTY ? '' : table.occupiedAt,
          releasedAt: nextStatus === TABLE_STATUSES.AVAILABLE ? timestamp : table.releasedAt,
          updatedAt: timestamp,
        }
      : table
  ))

  return saveTables(nextTables)
}

export const getTableAreaName = (areaId) => TABLE_AREAS.find((area) => area.id === areaId)?.name || areaId

export const isTableActive = (table) => ACTIVE_TABLE_STATUSES.has(table?.status)
