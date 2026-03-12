import { Router } from 'express'
import { authenticate } from '../../common/middleware/authenticate.js'
import { getProfileBookingHistory, getProfileBookings, getProfileMe, getProfileOrders } from './profile.controller.js'

export const profileRouter = Router()

profileRouter.use(authenticate)
profileRouter.get('/me', getProfileMe)
profileRouter.get('/orders', getProfileOrders)
profileRouter.get('/bookings', getProfileBookings)
profileRouter.get('/bookings/history', getProfileBookingHistory)
