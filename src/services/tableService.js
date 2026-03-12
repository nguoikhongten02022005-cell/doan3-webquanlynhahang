export const TABLE_STATUSES = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  HELD: 'HELD',
  OCCUPIED: 'OCCUPIED',
  DIRTY: 'DIRTY',
})

const ACTIVE_TABLE_STATUSES = new Set([
  TABLE_STATUSES.HELD,
  TABLE_STATUSES.OCCUPIED,
])

export const isTableActive = (table) => ACTIVE_TABLE_STATUSES.has(table?.status)
