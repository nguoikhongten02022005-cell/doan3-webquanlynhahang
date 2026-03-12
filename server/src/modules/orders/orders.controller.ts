import type { Request, Response } from 'express'
import { createOrderSchema, updateOrderStatusSchema } from './order.schema.js'
import { mapOrder } from './order.mapper.js'
import { createOrder, getOrderById, listMyOrders, listOrders, updateOrderStatus } from './orders.service.js'

export const getOrders = async (_req: Request, res: Response) => {
  const orders = await listOrders()
  res.json(orders.map(mapOrder))
}

export const getMyOrders = async (req: Request, res: Response) => {
  const orders = await listMyOrders(req.authUser!.email)
  res.json(orders.map(mapOrder))
}

export const getOrder = async (req: Request, res: Response) => {
  const order = await getOrderById(Number(req.params.id))
  res.json(mapOrder(order))
}

export const postOrder = async (req: Request, res: Response) => {
  const payload = createOrderSchema.parse(req.body)
  const order = await createOrder({
    ...payload,
    userEmail: req.authUser?.email ?? payload.userEmail,
  })
  res.status(201).json(mapOrder(order))
}

export const patchOrderStatus = async (req: Request, res: Response) => {
  const payload = updateOrderStatusSchema.parse(req.body)
  const order = await updateOrderStatus(Number(req.params.id), payload.status)
  res.json(mapOrder(order))
}
