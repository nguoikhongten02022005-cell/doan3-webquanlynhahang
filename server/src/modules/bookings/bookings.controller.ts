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
import { phanHoiThanhCong } from '../../common/phan-hoi.js'

export const getBookings = async (_req: Request, res: Response) => {
  const bookings = await listBookings()
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách booking thành công.',
    data: bookings.map(mapBooking),
    meta: { total: bookings.length },
  })
}

export const getBooking = async (req: Request, res: Response) => {
  const booking = await getBookingById(Number(req.params.id), req.authUser!)
  return phanHoiThanhCong(res, {
    message: 'Lấy thông tin booking thành công.',
    data: mapBooking(booking),
  })
}

export const getBookingHistory = async (req: Request, res: Response) => {
  if (!req.authUser) {
    throw new HttpError(401, 'Bạn cần đăng nhập để xem lịch sử đặt bàn.')
  }

  const bookings = await listBookingHistory(req.authUser)
  return phanHoiThanhCong(res, {
    message: 'Lấy lịch sử đặt bàn thành công.',
    data: bookings.map(mapBookingHistoryItem),
    meta: { total: bookings.length },
  })
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
  return phanHoiThanhCong(res, {
    statusCode: 201,
    message: 'Tạo booking thành công.',
    data: mapBooking(booking),
  })
}

export const postInternalBooking = async (req: Request, res: Response) => {
  const payload = createInternalBookingSchema.parse(req.body)
  const booking = await createBooking({
    ...payload,
    source: 'internal',
    confirmationChannel: ['Nội bộ'],
    createdBy: req.authUser?.email ?? 'internal',
  })
  return phanHoiThanhCong(res, {
    statusCode: 201,
    message: 'Tạo booking nội bộ thành công.',
    data: mapBooking(booking),
  })
}

export const patchBooking = async (req: Request, res: Response) => {
  const payload = updateBookingSchema.parse(req.body)
  const booking = await updateBooking(Number(req.params.id), payload)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật booking thành công.',
    data: mapBooking(booking),
  })
}

export const patchBookingCancel = async (req: Request, res: Response) => {
  const booking = await cancelBookingByCustomer(Number(req.params.id), req.authUser!)
  return phanHoiThanhCong(res, {
    message: 'Hủy booking thành công.',
    data: mapBooking(booking),
  })
}

export const patchBookingStatus = async (req: Request, res: Response) => {
  const payload = updateBookingStatusSchema.parse(req.body)
  const booking = await updateBookingStatus(Number(req.params.id), payload.status)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật trạng thái booking thành công.',
    data: mapBooking(booking),
  })
}

export const patchAssignTables = async (req: Request, res: Response) => {
  const payload = assignTablesSchema.parse(req.body)
  const booking = await assignTables(Number(req.params.id), payload.tableIds)
  return phanHoiThanhCong(res, {
    message: 'Gán bàn cho booking thành công.',
    data: mapBooking(booking),
  })
}

export const patchCheckInBooking = async (req: Request, res: Response) => {
  const booking = await updateBookingStatus(Number(req.params.id), 'DA_CHECK_IN')
  return phanHoiThanhCong(res, {
    message: 'Check-in booking thành công.',
    data: mapBooking(booking),
  })
}

export const patchCompleteBooking = async (req: Request, res: Response) => {
  const booking = await updateBookingStatus(Number(req.params.id), 'DA_HOAN_THANH')
  return phanHoiThanhCong(res, {
    message: 'Hoàn thành booking thành công.',
    data: mapBooking(booking),
  })
}

export const patchNoShowBooking = async (req: Request, res: Response) => {
  const booking = await updateBookingStatus(Number(req.params.id), 'KHONG_DEN')
  return phanHoiThanhCong(res, {
    message: 'Cập nhật booking không đến thành công.',
    data: mapBooking(booking),
  })
}
