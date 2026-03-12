import type { Request, Response } from 'express'
import { mapBooking, mapBookingHistoryItem } from '../bookings/booking.mapper.js'
import { listBookingHistory } from '../bookings/bookings.service.js'
import { mapOrder } from '../orders/order.mapper.js'
import { listMyOrders } from '../orders/orders.service.js'
import { mapCurrentUser } from '../users/user.mapper.js'
import { getCurrentUserProfile } from '../users/users.service.js'

export const getProfileMe = async (req: Request, res: Response) => {
  const user = await getCurrentUserProfile(req.authUser!.id)
  res.json({
    success: true,
    data: mapCurrentUser(user),
  })
}

export const getProfileOrders = async (req: Request, res: Response) => {
  const orders = await listMyOrders(req.authUser!.email)
  res.json({
    success: true,
    data: orders.map(mapOrder),
  })
}

export const getProfileBookings = async (req: Request, res: Response) => {
  const bookings = await listBookingHistory(req.authUser!.email)
  res.json({
    success: true,
    data: bookings.map(mapBooking),
    meta: { total: bookings.length },
  })
}

export const getProfileBookingHistory = async (req: Request, res: Response) => {
  const bookings = await listBookingHistory(req.authUser!.email)
  res.json({
    success: true,
    data: bookings.map(mapBookingHistoryItem),
    meta: { total: bookings.length },
  })
}
