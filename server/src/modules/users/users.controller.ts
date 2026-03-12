import type { Request, Response } from 'express'
import { mapCurrentUser, mapUser } from './user.mapper.js'
import { updateUserRoleSchema, updateUserStatusSchema } from './user.schema.js'
import { getCurrentUserProfile, getUserById, listUsers, updateUserRole, updateUserStatus } from './users.service.js'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await listUsers()
  res.json(users.map(mapUser))
}

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await getCurrentUserProfile(req.authUser!.id)
  res.json(mapCurrentUser(user))
}

export const getUser = async (req: Request, res: Response) => {
  const user = await getUserById(Number(req.params.id))
  res.json(mapUser(user))
}

export const patchUserRole = async (req: Request, res: Response) => {
  const payload = updateUserRoleSchema.parse(req.body)
  const user = await updateUserRole(Number(req.params.id), payload.role)
  res.json(mapUser(user))
}

export const patchUserStatus = async (req: Request, res: Response) => {
  const payload = updateUserStatusSchema.parse(req.body)
  const user = await updateUserStatus(Number(req.params.id), payload.status)
  res.json(mapUser(user))
}
