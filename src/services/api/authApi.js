import { apiClient, tachPhanHoi } from '../apiClient'

export const loginApi = async (identifier, password) => tachPhanHoi(await apiClient.post('/auth/login', { identifier, password }))
export const internalLoginApi = async (identifier, password) => tachPhanHoi(await apiClient.post('/auth/internal-login', { identifier, password }))
export const registerApi = async (payload) => tachPhanHoi(await apiClient.post('/auth/register', payload))
export const getMeApi = async () => tachPhanHoi(await apiClient.get('/auth/me'))
export const logoutApi = async () => tachPhanHoi(await apiClient.post('/auth/logout', {}))
export const getUsersApi = async () => tachPhanHoi(await apiClient.get('/users'))
