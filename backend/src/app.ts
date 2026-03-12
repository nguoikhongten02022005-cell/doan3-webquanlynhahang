import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './common/middleware/errorHandler.js'
import { notFound } from './common/middleware/notFound.js'
import { apiRouter } from './routes/index.js'

export const app = express()

const allowedOrigins = new Set(env.CORS_ORIGIN)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())
app.use('/api', apiRouter)
app.use(notFound)
app.use(errorHandler)
