import type { Request, Response } from 'express'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'
import { createMenuItemSchema, updateMenuItemSchema } from './menu.schema.js'
import { mapMenuItem } from './menu.mapper.js'
import { createMenuItem, deleteMenuItem, getMenuItemById, listMenuItems, updateMenuItem } from './menu.service.js'

export const getMenuItems = async (_req: Request, res: Response) => {
  const items = await listMenuItems()
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách món ăn thành công.',
    data: items.map(mapMenuItem),
    meta: { total: items.length },
  })
}

export const getMenuItem = async (req: Request, res: Response) => {
  const item = await getMenuItemById(Number(req.params.id))
  return phanHoiThanhCong(res, {
    message: 'Lấy thông tin món ăn thành công.',
    data: mapMenuItem(item),
  })
}

export const postMenuItem = async (req: Request, res: Response) => {
  const payload = createMenuItemSchema.parse(req.body)
  const item = await createMenuItem(payload)
  return phanHoiThanhCong(res, {
    statusCode: 201,
    message: 'Tạo món ăn thành công.',
    data: mapMenuItem(item),
  })
}

export const patchMenuItem = async (req: Request, res: Response) => {
  const payload = updateMenuItemSchema.parse(req.body)
  const item = await updateMenuItem(Number(req.params.id), payload)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật món ăn thành công.',
    data: mapMenuItem(item),
  })
}

export const removeMenuItem = async (req: Request, res: Response) => {
  await deleteMenuItem(Number(req.params.id))
  return phanHoiThanhCong(res, {
    message: 'Xóa món ăn thành công.',
    data: null,
  })
}
