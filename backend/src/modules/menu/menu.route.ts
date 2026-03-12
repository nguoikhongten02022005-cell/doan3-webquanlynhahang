import { Router } from 'express'
import { getMenuItems, patchMenuItem, postMenuItem, removeMenuItem } from './menu.controller.js'
import { authenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'

export const menuRouter = Router()

menuRouter.get('/', getMenuItems)
menuRouter.post('/', authenticate, authorize('admin'), postMenuItem)
menuRouter.patch('/:id', authenticate, authorize('admin'), patchMenuItem)
menuRouter.delete('/:id', authenticate, authorize('admin'), removeMenuItem)
