import { Router } from 'express'
import { healthRouter } from '../modules/health/health.route.js'
import { authRouter } from '../modules/auth/auth.route.js'
import { usersRouter } from '../modules/users/users.route.js'
import { tablesRouter } from '../modules/tables/tables.route.js'
import { bookingsRouter } from '../modules/bookings/bookings.route.js'
import { menuRouter } from '../modules/menu/menu.route.js'
import { ordersRouter } from '../modules/orders/orders.route.js'
import { vouchersRouter } from '../modules/vouchers/vouchers.route.js'

export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/tables', tablesRouter)
apiRouter.use('/bookings', bookingsRouter)
apiRouter.use('/menu-items', menuRouter)
apiRouter.use('/orders', ordersRouter)
apiRouter.use('/vouchers', vouchersRouter)
