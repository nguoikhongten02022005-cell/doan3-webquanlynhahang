import 'dotenv/config'
import { z } from 'zod'

const corsOriginSchema = z.string().min(1).transform((value) => value
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean))

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: corsOriginSchema,
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('7d'),
  REFRESH_TOKEN_COOKIE_NAME: z.string().min(1).default('restaurant_refresh_token'),
  REFRESH_TOKEN_COOKIE_PATH: z.string().min(1).default('/api'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(15).default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(10),
  API_DOCS_ENABLED: z.coerce.boolean().default(true),
})

export const env = envSchema.parse(process.env)
