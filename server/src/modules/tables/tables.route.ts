import { Router } from 'express'
import { getAvailableTables, getTable, getTables, patchTable, patchTableStatus, postTable } from './tables.controller.js'
import { authenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'

export const tablesRouter = Router()

tablesRouter.get('/', authenticate, authorize('admin', 'staff'), getTables)
tablesRouter.get('/available-for-booking/:bookingId', authenticate, authorize('admin', 'staff'), getAvailableTables)
tablesRouter.get('/:id', authenticate, authorize('admin', 'staff'), getTable)
tablesRouter.post('/', authenticate, authorize('admin'), postTable)
tablesRouter.patch('/:id', authenticate, authorize('admin'), patchTable)
tablesRouter.patch('/:id/status', authenticate, authorize('admin', 'staff'), patchTableStatus)
