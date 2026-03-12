import { Router } from 'express'
import { getBookingHistory, getBookings, patchAssignTables, patchBooking, patchBookingCancel, patchBookingStatus, postBooking } from './bookings.controller.js'
import { authenticate, optionalAuthenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'

export const bookingsRouter = Router()

bookingsRouter.get('/', authenticate, authorize('admin', 'staff'), getBookings)
bookingsRouter.get('/history', optionalAuthenticate, getBookingHistory)
bookingsRouter.post('/', optionalAuthenticate, postBooking)
bookingsRouter.patch('/:id', authenticate, authorize('admin', 'staff'), patchBooking)
bookingsRouter.patch('/:id/cancel', authenticate, patchBookingCancel)
bookingsRouter.patch('/:id/status', authenticate, authorize('admin', 'staff'), patchBookingStatus)
bookingsRouter.patch('/:id/assign-tables', authenticate, authorize('admin', 'staff'), patchAssignTables)
