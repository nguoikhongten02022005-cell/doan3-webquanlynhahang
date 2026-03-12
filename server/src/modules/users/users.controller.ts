import type { Request, Response } from 'express'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'
import { mapCurrentUser, mapUser } from './user.mapper.js'
import { updateUserRoleSchema, updateUserStatusSchema } from './user.schema.js'
import { getCurrentUserProfile, getUserById, listUsers, updateUserRole, updateUserStatus } from './users.service.js'

export const getUsers = async (_req: Request, res: Response) => {
  const users = await listUsers()
  return phanHoiThanhCong(res, {
    message: 'Lấy danh sách người dùng thành công.',
    data: users.map(mapUser),
    meta: { total: users.length },
  })
}

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await getCurrentUserProfile(req.authUser!.id)
  return phanHoiThanhCong(res, {
    message: 'Lấy thông tin người dùng hiện tại thành công.',
    data: mapCurrentUser(user),
  })
}

export const getUser = async (req: Request, res: Response) => {
  const user = await getUserById(Number(req.params.id))
  return phanHoiThanhCong(res, {
    message: 'Lấy thông tin người dùng thành công.',
    data: mapUser(user),
  })
}

export const patchUserRole = async (req: Request, res: Response) => {
  const payload = updateUserRoleSchema.parse(req.body)
  const user = await updateUserRole(Number(req.params.id), payload.role)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật vai trò người dùng thành công.',
    data: mapUser(user),
  })
}

export const patchUserStatus = async (req: Request, res: Response) => {
  const payload = updateUserStatusSchema.parse(req.body)
  const user = await updateUserStatus(Number(req.params.id), payload.status)
  return phanHoiThanhCong(res, {
    message: 'Cập nhật trạng thái người dùng thành công.',
    data: mapUser(user),
  })
}
