import { Router } from 'express'
import { healthRouter } from '../modules/health/health.route.js'
import { authRouter } from '../modules/auth/auth.route.js'
import { usersRouter } from '../modules/users/users.route.js'
import { tablesRouter } from '../modules/tables/tables.route.js'
import { bookingsRouter } from '../modules/bookings/bookings.route.js'
import { menuRouter } from '../modules/menu/menu.route.js'
import { ordersRouter } from '../modules/orders/orders.route.js'
import { vouchersRouter } from '../modules/vouchers/vouchers.route.js'
import { profileRouter } from '../modules/profile/profile.route.js'
import { internalRouter } from '../modules/internal/internal.route.js'

export const apiRouter = Router()
export const apiV1Router = Router()

const mountRoutes = (router: Router) => {
  router.use('/health', healthRouter)
  router.use('/auth', authRouter)
  router.use('/users', usersRouter)
  router.use('/tables', tablesRouter)
  router.use('/bookings', bookingsRouter)
  router.use('/menu-items', menuRouter)
  router.use('/orders', ordersRouter)
  router.use('/vouchers', vouchersRouter)
  router.use('/profile', profileRouter)
  router.use('/internal', internalRouter)
}

mountRoutes(apiRouter)
mountRoutes(apiV1Router)
