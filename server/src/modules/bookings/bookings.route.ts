import { Router } from 'express'
import {
  getBooking,
  getBookingHistory,
  getBookings,
  patchAssignTables,
  patchBooking,
  patchBookingCancel,
  patchBookingStatus,
  patchCheckInBooking,
  patchCompleteBooking,
  patchNoShowBooking,
  postBooking,
  postInternalBooking,
} from './bookings.controller.js'
import { authenticate, optionalAuthenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'

export const bookingsRouter = Router()

bookingsRouter.get('/', authenticate, authorize('admin', 'staff'), getBookings)
bookingsRouter.get('/history', optionalAuthenticate, getBookingHistory)
bookingsRouter.get('/:id', authenticate, getBooking)
bookingsRouter.post('/', optionalAuthenticate, postBooking)
bookingsRouter.post('/internal', authenticate, authorize('admin', 'staff'), postInternalBooking)
bookingsRouter.patch('/:id', authenticate, authorize('admin', 'staff'), patchBooking)
bookingsRouter.patch('/:id/cancel', authenticate, patchBookingCancel)
bookingsRouter.patch('/:id/status', authenticate, authorize('admin', 'staff'), patchBookingStatus)
bookingsRouter.patch('/:id/assign-tables', authenticate, authorize('admin', 'staff'), patchAssignTables)
bookingsRouter.patch('/:id/check-in', authenticate, authorize('admin', 'staff'), patchCheckInBooking)
bookingsRouter.patch('/:id/complete', authenticate, authorize('admin', 'staff'), patchCompleteBooking)
bookingsRouter.patch('/:id/no-show', authenticate, authorize('admin', 'staff'), patchNoShowBooking)
