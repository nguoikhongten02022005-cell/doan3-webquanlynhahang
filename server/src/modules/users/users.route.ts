import { Router } from 'express'
import { getCurrentUser, getUser, getUsers, patchUserRole, patchUserStatus } from './users.controller.js'
import { authenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'

export const usersRouter = Router()

usersRouter.get('/me', authenticate, getCurrentUser)
usersRouter.get('/', authenticate, authorize('admin', 'staff'), getUsers)
usersRouter.get('/:id', authenticate, authorize('admin', 'staff'), getUser)
usersRouter.patch('/:id/role', authenticate, authorize('admin'), patchUserRole)
usersRouter.patch('/:id/status', authenticate, authorize('admin'), patchUserStatus)
