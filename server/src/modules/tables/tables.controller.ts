import type { Request, Response } from 'express'
import { createTableSchema, updateTableSchema } from './table.create.schema.js'
import { listTablesQuerySchema } from './table.query.js'
import { updateTableStatusSchema } from './table.schema.js'
import { mapTable } from './table.mapper.js'
import { createTable, getAvailableTablesForBooking, getTableById, listTables, updateTable, updateTableStatus } from './tables.service.js'

export const getTables = async (req: Request, res: Response) => {
  const query = listTablesQuerySchema.parse(req.query)
  const tables = await listTables(query)
  res.json(tables.map(mapTable))
}

export const getTable = async (req: Request, res: Response) => {
  const table = await getTableById(String(req.params.id))
  res.json(mapTable(table))
}

export const postTable = async (req: Request, res: Response) => {
  const payload = createTableSchema.parse(req.body)
  const table = await createTable(payload)
  res.status(201).json(mapTable(table))
}

export const patchTable = async (req: Request, res: Response) => {
  const payload = updateTableSchema.parse(req.body)
  const table = await updateTable(String(req.params.id), payload)
  res.json(mapTable(table))
}

export const patchTableStatus = async (req: Request, res: Response) => {
  const payload = updateTableStatusSchema.parse(req.body)
  const table = await updateTableStatus(String(req.params.id), payload.status)
  res.json(mapTable(table))
}

export const getAvailableTables = async (req: Request, res: Response) => {
  const tables = await getAvailableTablesForBooking(Number(req.params.bookingId))
  res.json(tables.map(mapTable))
}
