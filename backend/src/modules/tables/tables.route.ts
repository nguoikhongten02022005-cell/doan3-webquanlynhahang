import { Router } from 'express'
import { getTables, patchTableStatus } from './tables.controller.js'
import { authenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'

export const tablesRouter = Router()

tablesRouter.get('/', authenticate, authorize('admin', 'staff'), getTables)
tablesRouter.patch('/:id/status', authenticate, authorize('admin', 'staff'), patchTableStatus)
