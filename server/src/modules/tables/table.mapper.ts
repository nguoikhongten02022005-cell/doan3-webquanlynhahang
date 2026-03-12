import type { Table } from '@prisma/client'
import { toIsoString } from '../../common/serializers.js'

export const mapTable = (table: Table) => ({
  id: table.id,
  code: table.code,
  name: table.name,
  areaId: table.areaId,
  capacity: table.capacity,
  status: table.status,
  activeBookingId: table.activeBookingId,
  activeBookingCode: table.activeBookingCode,
  occupiedAt: toIsoString(table.occupiedAt),
  releasedAt: toIsoString(table.releasedAt),
  note: table.note,
  updatedAt: toIsoString(table.updatedAt),
})
