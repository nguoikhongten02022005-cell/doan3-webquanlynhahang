import { Router } from 'express'
import { authenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'
import { getDashboardStats } from './internal.controller.js'
import { getUsers, getUser, patchUserRole, patchUserStatus } from '../users/users.controller.js'
import { getMenuItems, getMenuItem, postMenuItem, patchMenuItem, removeMenuItem } from '../menu/menu.controller.js'
import { getTables, getTable, postTable, patchTable, patchTableStatus, getAvailableTables } from '../tables/tables.controller.js'
import {
  getBookings,
  getBooking,
  postInternalBooking,
  patchBooking,
  patchBookingStatus,
  patchAssignTables,
  patchCheckInBooking,
  patchCompleteBooking,
  patchNoShowBooking,
} from '../bookings/bookings.controller.js'
import { getOrders, getOrder, patchOrderStatus } from '../orders/orders.controller.js'
import { getVouchers, postVoucher, patchVoucher, removeVoucher } from '../vouchers/vouchers.controller.js'

export const internalRouter = Router()

internalRouter.use(authenticate, authorize('admin', 'staff'))
internalRouter.get('/dashboard/stats', getDashboardStats)

internalRouter.get('/users', getUsers)
internalRouter.get('/users/:id', getUser)
internalRouter.patch('/users/:id/role', authorize('admin'), patchUserRole)
internalRouter.patch('/users/:id/status', authorize('admin'), patchUserStatus)

internalRouter.get('/menu', getMenuItems)
internalRouter.get('/menu/:id', getMenuItem)
internalRouter.post('/menu', authorize('admin'), postMenuItem)
internalRouter.patch('/menu/:id', authorize('admin'), patchMenuItem)
internalRouter.delete('/menu/:id', authorize('admin'), removeMenuItem)

internalRouter.get('/tables', getTables)
internalRouter.get('/tables/available-for-booking/:bookingId', getAvailableTables)
internalRouter.get('/tables/:id', getTable)
internalRouter.post('/tables', authorize('admin'), postTable)
internalRouter.patch('/tables/:id', authorize('admin'), patchTable)
internalRouter.patch('/tables/:id/status', patchTableStatus)

internalRouter.get('/bookings', getBookings)
internalRouter.get('/bookings/:id', getBooking)
internalRouter.post('/bookings', postInternalBooking)
internalRouter.patch('/bookings/:id', patchBooking)
internalRouter.patch('/bookings/:id/status', patchBookingStatus)
internalRouter.patch('/bookings/:id/assign-tables', patchAssignTables)
internalRouter.patch('/bookings/:id/check-in', patchCheckInBooking)
internalRouter.patch('/bookings/:id/complete', patchCompleteBooking)
internalRouter.patch('/bookings/:id/no-show', patchNoShowBooking)

internalRouter.get('/orders', getOrders)
internalRouter.get('/orders/:id', getOrder)
internalRouter.patch('/orders/:id/status', patchOrderStatus)

internalRouter.get('/vouchers', getVouchers)
internalRouter.post('/vouchers', authorize('admin'), postVoucher)
internalRouter.patch('/vouchers/:id', authorize('admin'), patchVoucher)
internalRouter.delete('/vouchers/:id', authorize('admin'), removeVoucher)
