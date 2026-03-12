import type { Request, Response } from 'express'
import {
  assignTablesSchema,
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
} from './booking.schema.js'
import { createInternalBookingSchema } from './booking.internal.schema.js'
import { mapBooking, mapBookingHistoryItem } from './booking.mapper.js'
import {
  assignTables,
  cancelBookingByCustomer,
  createBooking,
  getBookingById,
  listBookingHistory,
  listBookings,
  updateBooking,
  updateBookingStatus,
} from './bookings.service.js'
import { HttpError } from '../../common/http-error.js'

export const getBookings = async (_req: Request, res: Response) => {
  const bookings = await listBookings()
  res.json(bookings.map(mapBooking))
}

export const getBooking = async (req: Request, res: Response) => {
  const booking = await getBookingById(Number(req.params.id), req.authUser!)
  res.json(mapBooking(booking))
}

export const getBookingHistory = async (req: Request, res: Response) => {
  if (!req.authUser) {
    throw new HttpError(401, 'Bạn cần đăng nhập để xem lịch sử đặt bàn.')
  }

  const bookings = await listBookingHistory(req.authUser)
  res.json(bookings.map(mapBookingHistoryItem))
}

export const postBooking = async (req: Request, res: Response) => {
  const payload = createBookingSchema.parse(req.body)
  const emailNguoiDung = req.authUser?.email ?? payload.email
  const booking = await createBooking({
    ...payload,
    email: emailNguoiDung,
    userEmail: req.authUser?.email ?? payload.userEmail,
    createdBy: req.authUser?.email ?? payload.createdBy,
  })
  res.status(201).json(mapBooking(booking))
}

export const postInternalBooking = async (req: Request, res: Response) => {
  const payload = createInternalBookingSchema.parse(req.body)
  const booking = await createBooking({
    ...payload,
    source: 'internal',
    confirmationChannel: ['Nội bộ'],
    createdBy: req.authUser?.email ?? 'internal',
  })
  res.status(201).json(mapBooking(booking))
}

export const patchBooking = async (req: Request, res: Response) => {
  const payload = updateBookingSchema.parse(req.body)
  const booking = await updateBooking(Number(req.params.id), payload)
  res.json(mapBooking(booking))
}

export const patchBookingCancel = async (req: Request, res: Response) => {
  const booking = await cancelBookingByCustomer(Number(req.params.id), req.authUser!)
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

export const patchCheckInBooking = async (req: Request, res: Response) => {
  const booking = await updateBookingStatus(Number(req.params.id), 'DA_CHECK_IN')
  res.json(mapBooking(booking))
}

export const patchCompleteBooking = async (req: Request, res: Response) => {
  const booking = await updateBookingStatus(Number(req.params.id), 'DA_HOAN_THANH')
  res.json(mapBooking(booking))
}

export const patchNoShowBooking = async (req: Request, res: Response) => {
  const booking = await updateBookingStatus(Number(req.params.id), 'KHONG_DEN')
  res.json(mapBooking(booking))
}
