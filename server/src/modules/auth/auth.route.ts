import rateLimit from 'express-rate-limit'
import { Router } from 'express'
import { getMe, internalLogin, login, logout, patchMe, refresh, register } from './auth.controller.js'
import { authenticate } from '../../common/middleware/authenticate.js'
import { phanHoiLoi } from '../../common/phan-hoi.js'
import { env } from '../../config/env.js'

const loginRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    phanHoiLoi(res, {
      statusCode: 429,
      message: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau.',
      errors: [],
    })
  },
})

export const authRouter = Router()

authRouter.post('/login', loginRateLimiter, login)
authRouter.post('/internal-login', loginRateLimiter, internalLogin)
authRouter.post('/register', register)
authRouter.get('/me', authenticate, getMe)
authRouter.patch('/me', authenticate, patchMe)
authRouter.post('/refresh', refresh)
authRouter.post('/logout', logout)
