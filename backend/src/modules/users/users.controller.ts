import type { Request, Response } from 'express'
import { mapCurrentUser, mapUser } from './user.mapper.js'
import { getCurrentUserProfile, listUsers } from './users.service.js'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await listUsers()
  res.json(users.map(mapUser))
}

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await getCurrentUserProfile(req.authUser!.id)
  res.json(mapCurrentUser(user))
}
