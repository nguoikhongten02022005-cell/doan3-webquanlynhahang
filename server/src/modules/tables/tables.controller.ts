import type { Request, Response } from 'express'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'
import { createTableSchema, updateTableSchema } from './table.create.schema.js'
import { listTablesQuerySchema } from './table.query.js'
import { updateTableStatusSchema } from './table.schema.js'
import { mapTable } from './table.mapper.js'
import { createTable, getAvailableTablesForBooking, getTableById, listTables, updateTable, updateTableStatus } from './tables.service.js'

export const getTables = async (req: Request, res: Response) => {
  const query = listTablesQuerySchema.parse(req.query)
  const tables = await listTables(query)
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách bàn thành công.',
    data: tables.map(mapTable),
    meta: { total: tables.length },
  })
}

export const getTable = async (req: Request, res: Response) => {
  const table = await getTableById(String(req.params.id))
  return phanHoiThanhCong(res, {
    message: 'Lấy thông tin bàn thành công.',
    data: mapTable(table),
  })
}

export const postTable = async (req: Request, res: Response) => {
  const payload = createTableSchema.parse(req.body)
  const table = await createTable(payload)
  return phanHoiThanhCong(res, {
    statusCode: 201,
    message: 'Tạo bàn thành công.',
    data: mapTable(table),
  })
}

export const patchTable = async (req: Request, res: Response) => {
  const payload = updateTableSchema.parse(req.body)
  const table = await updateTable(String(req.params.id), payload)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật bàn thành công.',
    data: mapTable(table),
  })
}

export const patchTableStatus = async (req: Request, res: Response) => {
  const payload = updateTableStatusSchema.parse(req.body)
  const table = await updateTableStatus(String(req.params.id), payload.status)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật trạng thái bàn thành công.',
    data: mapTable(table),
  })
}

export const getAvailableTables = async (req: Request, res: Response) => {
  const tables = await getAvailableTablesForBooking(Number(req.params.bookingId))
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách bàn khả dụng thành công.',
    data: tables.map(mapTable),
    meta: { total: tables.length },
  })
}
