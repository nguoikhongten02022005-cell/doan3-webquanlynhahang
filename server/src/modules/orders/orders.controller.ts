import type { Request, Response } from 'express'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'
import { createOrderSchema, updateOrderStatusSchema } from './order.schema.js'
import { mapOrder } from './order.mapper.js'
import { createOrder, getOrderById, listMyOrders, listOrders, updateOrderStatus } from './orders.service.js'

export const getOrders = async (_req: Request, res: Response) => {
  const orders = await listOrders()
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách đơn hàng thành công.',
    data: orders.map(mapOrder),
    meta: { total: orders.length },
  })
}

export const getMyOrders = async (req: Request, res: Response) => {
  const orders = await listMyOrders(req.authUser!)
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách đơn hàng của bạn thành công.',
    data: orders.map(mapOrder),
    meta: { total: orders.length },
  })
}

export const getOrder = async (req: Request, res: Response) => {
  const order = await getOrderById(Number(req.params.id), req.authUser!)
  return phanHoiThanhCong(res, {
    message: 'Lấy thông tin đơn hàng thành công.',
    data: mapOrder(order),
  })
}

export const postOrder = async (req: Request, res: Response) => {
  const payload = createOrderSchema.parse(req.body)
  const emailNguoiDung = req.authUser?.email ?? payload.customer.email
  const order = await createOrder({
    ...payload,
    userEmail: emailNguoiDung,
    customer: {
      ...payload.customer,
      email: payload.customer.email || emailNguoiDung,
    },
  })
  return phanHoiThanhCong(res, {
    statusCode: 201,
    message: 'Tạo đơn hàng thành công.',
    data: mapOrder(order),
  })
}

export const patchOrderStatus = async (req: Request, res: Response) => {
  const payload = updateOrderStatusSchema.parse(req.body)
  const order = await updateOrderStatus(Number(req.params.id), payload.status)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật trạng thái đơn hàng thành công.',
    data: mapOrder(order),
  })
}
