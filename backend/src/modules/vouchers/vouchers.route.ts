import { Router } from 'express'
import { getVoucher } from './vouchers.controller.js'

export const vouchersRouter = Router()

vouchersRouter.get('/:code', getVoucher)
