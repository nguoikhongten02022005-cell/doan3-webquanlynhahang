import type { Request, Response } from 'express'
import { updateTableStatusSchema } from './table.schema.js'
import { mapTable } from './table.mapper.js'
import { listTables, updateTableStatus } from './tables.service.js'

export const getTables = async (_req: Request, res: Response) => {
  const tables = await listTables()
  res.json(tables.map(mapTable))
}

export const patchTableStatus = async (req: Request, res: Response) => {
  const payload = updateTableStatusSchema.parse(req.body)
  const table = await updateTableStatus(String(req.params.id), payload.status)
  res.json(mapTable(table))
}
