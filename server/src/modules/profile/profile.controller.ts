import type { Request, Response } from 'express'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'
import { mapBooking, mapBookingHistoryItem } from '../bookings/booking.mapper.js'
import { listBookingHistory } from '../bookings/bookings.service.js'
import { mapOrder } from '../orders/order.mapper.js'
import { listMyOrders } from '../orders/orders.service.js'
import { mapCurrentUser } from '../users/user.mapper.js'
import { getCurrentUserProfile } from '../users/users.service.js'

export const getProfileMe = async (req: Request, res: Response) => {
  const user = await getCurrentUserProfile(req.authUser!.id)
  return phanHoiThanhCong(res, {
    message: 'Lấy hồ sơ người dùng thành công.',
    data: mapCurrentUser(user),
  })
}

export const getProfileOrders = async (req: Request, res: Response) => {
  const orders = await listMyOrders(req.authUser!)
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách đơn hàng của bạn thành công.',
    data: orders.map(mapOrder),
    meta: { total: orders.length },
  })
}

export const getProfileBookings = async (req: Request, res: Response) => {
  const bookings = await listBookingHistory(req.authUser!)
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách đặt bàn của bạn thành công.',
    data: bookings.map(mapBooking),
    meta: { total: bookings.length },
  })
}

export const getProfileBookingHistory = async (req: Request, res: Response) => {
  const bookings = await listBookingHistory(req.authUser!)
  return phanHoiThanhCong(res, {
    message: 'Lấy lịch sử đặt bàn thành công.',
    data: bookings.map(mapBookingHistoryItem),
    meta: { total: bookings.length },
  })
}
