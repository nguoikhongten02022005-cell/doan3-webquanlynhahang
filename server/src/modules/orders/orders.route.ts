import { Router } from 'express'
import { getMyOrders, getOrder, getOrders, patchOrderStatus, postOrder } from './orders.controller.js'
import { authenticate, optionalAuthenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'

export const ordersRouter = Router()

ordersRouter.get('/me', authenticate, getMyOrders)
ordersRouter.get('/', authenticate, authorize('admin', 'staff'), getOrders)
ordersRouter.get('/:id', authenticate, getOrder)
ordersRouter.post('/', optionalAuthenticate, postOrder)
ordersRouter.post('/checkout', optionalAuthenticate, postOrder)
ordersRouter.patch('/:id/status', authenticate, authorize('admin', 'staff'), patchOrderStatus)
