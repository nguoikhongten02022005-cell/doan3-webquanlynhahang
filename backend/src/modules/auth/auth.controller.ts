import type { Request, Response } from 'express'
import { loginSchema, registerSchema, updateProfileSchema } from './auth.schema.js'
import { mapCurrentUser, mapUser } from '../users/user.mapper.js'
import { getAuthUserById, loginUser, registerUser, updateAuthUserProfile } from './auth.service.js'
import { signAccessToken } from '../../common/utils/jwt.js'

export const login = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body)
  const user = await loginUser(payload.identifier, payload.password)
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  })

  res.json({
    success: true,
    accessToken,
    tokenType: 'Bearer',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const internalLogin = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body)
  const user = await loginUser(payload.identifier, payload.password, { allowedRoles: ['admin', 'staff'] })
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  })

  res.json({
    success: true,
    accessToken,
    tokenType: 'Bearer',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const register = async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body)
  const user = await registerUser(payload)
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  })

  res.status(201).json({
    success: true,
    accessToken,
    tokenType: 'Bearer',
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const getMe = async (req: Request, res: Response) => {
  const user = await getAuthUserById(req.authUser!.id)

  res.json({
    success: true,
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}

export const patchMe = async (req: Request, res: Response) => {
  const payload = updateProfileSchema.parse(req.body)
  const user = await updateAuthUserProfile(req.authUser!.id, payload)

  res.json({
    success: true,
    user: mapUser(user),
    currentUser: mapCurrentUser(user),
  })
}
