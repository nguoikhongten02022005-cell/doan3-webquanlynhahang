import type { Request, Response } from 'express'
import { createMenuItemSchema, updateMenuItemSchema } from './menu.schema.js'
import { mapMenuItem } from './menu.mapper.js'
import { createMenuItem, deleteMenuItem, getMenuItemById, listMenuItems, updateMenuItem } from './menu.service.js'

export const getMenuItems = async (_req: Request, res: Response) => {
  const items = await listMenuItems()
  res.json(items.map(mapMenuItem))
}

export const getMenuItem = async (req: Request, res: Response) => {
  const item = await getMenuItemById(Number(req.params.id))
  res.json(mapMenuItem(item))
}

export const postMenuItem = async (req: Request, res: Response) => {
  const payload = createMenuItemSchema.parse(req.body)
  const item = await createMenuItem(payload)
  res.status(201).json(mapMenuItem(item))
}

export const patchMenuItem = async (req: Request, res: Response) => {
  const payload = updateMenuItemSchema.parse(req.body)
  const item = await updateMenuItem(Number(req.params.id), payload)
  res.json(mapMenuItem(item))
}

export const removeMenuItem = async (req: Request, res: Response) => {
  await deleteMenuItem(Number(req.params.id))
  res.status(204).send()
}
