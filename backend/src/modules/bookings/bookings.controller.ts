import type { Request, Response } from 'express'
import {
  assignTablesSchema,
  bookingHistoryQuerySchema,
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
} from './booking.schema.js'
import { mapBooking, mapBookingHistoryItem } from './booking.mapper.js'
import {
  assignTables,
  cancelBookingByCustomer,
  createBooking,
  listBookingHistory,
  listBookings,
  updateBooking,
  updateBookingStatus,
} from './bookings.service.js'

export const getBookings = async (_req: Request, res: Response) => {
  const bookings = await listBookings()
  res.json(bookings.map(mapBooking))
}

export const getBookingHistory = async (req: Request, res: Response) => {
  const query = bookingHistoryQuerySchema.parse(req.query)
  const bookings = await listBookingHistory(req.authUser?.email ?? query.userEmail)
  res.json(bookings.map(mapBookingHistoryItem))
}

export const postBooking = async (req: Request, res: Response) => {
  const payload = createBookingSchema.parse(req.body)
  const booking = await createBooking({
    ...payload,
    userEmail: req.authUser?.email ?? payload.userEmail,
    createdBy: req.authUser?.email ?? payload.createdBy,
  })
  res.status(201).json(mapBooking(booking))
}

export const patchBooking = async (req: Request, res: Response) => {
  const payload = updateBookingSchema.parse(req.body)
  const booking = await updateBooking(Number(req.params.id), payload)
  res.json(mapBooking(booking))
}

export const patchBookingCancel = async (req: Request, res: Response) => {
  const booking = await cancelBookingByCustomer(Number(req.params.id), req.authUser!.email)
  res.json(mapBooking(booking))
}

export const patchBookingStatus = async (req: Request, res: Response) => {
  const payload = updateBookingStatusSchema.parse(req.body)
  const booking = await updateBookingStatus(Number(req.params.id), payload.status)
  res.json(mapBooking(booking))
}

export const patchAssignTables = async (req: Request, res: Response) => {
  const payload = assignTablesSchema.parse(req.body)
  const booking = await assignTables(Number(req.params.id), payload.tableIds)
  res.json(mapBooking(booking))
}
