import bcrypt from 'bcryptjs'
import { env } from '../../config/env.js'

export const hashPassword = (value: string) => bcrypt.hash(value, env.BCRYPT_SALT_ROUNDS)

export const verifyPassword = (value: string, hashedValue: string) => bcrypt.compare(value, hashedValue)