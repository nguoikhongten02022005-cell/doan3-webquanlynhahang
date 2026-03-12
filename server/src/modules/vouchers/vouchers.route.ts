import { Router } from 'express'
import { getVoucher, getVouchers, patchVoucher, postValidateVoucher, postVoucher, removeVoucher } from './vouchers.controller.js'
import { authenticate } from '../../common/middleware/authenticate.js'
import { authorize } from '../../common/middleware/authorize.js'

export const vouchersRouter = Router()

vouchersRouter.post('/validate', postValidateVoucher)
vouchersRouter.get('/', authenticate, authorize('admin', 'staff'), getVouchers)
vouchersRouter.post('/', authenticate, authorize('admin'), postVoucher)
vouchersRouter.patch('/:id', authenticate, authorize('admin'), patchVoucher)
vouchersRouter.delete('/:id', authenticate, authorize('admin'), removeVoucher)
vouchersRouter.get('/:code', getVoucher)
