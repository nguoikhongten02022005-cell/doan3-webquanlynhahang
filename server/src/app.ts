import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.js'
import { errorHandler } from './common/middleware/errorHandler.js'
import { notFound } from './common/middleware/notFound.js'
import { apiRouter, apiV1Router } from './routes/index.js'
import { openApiDocument } from './docs/openapi.js'

export const app = express()

const allowedOrigins = new Set(env.CORS_ORIGIN)

app.use(helmet({ contentSecurityPolicy: false }))
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
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (env.API_DOCS_ENABLED) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))
}

app.use('/api/v1', apiV1Router)
app.use('/api', apiRouter)
app.use(notFound)
app.use(errorHandler)
