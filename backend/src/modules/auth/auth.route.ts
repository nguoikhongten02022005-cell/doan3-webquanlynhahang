import { Router } from 'express'
import { internalLogin, login, register, getMe, patchMe } from './auth.controller.js'
import { authenticate } from '../../common/middleware/authenticate.js'

export const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/internal-login', internalLogin)
authRouter.post('/register', register)
authRouter.get('/me', authenticate, getMe)
authRouter.patch('/me', authenticate, patchMe)
