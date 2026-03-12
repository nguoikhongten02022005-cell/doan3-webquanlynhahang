import { apiClient, layDuLieu, tachPhanHoi } from '../apiClient'

export const loginApi = async (identifier, password) => layDuLieu(await apiClient.post('/auth/login', { identifier, password }))
export const internalLoginApi = async (identifier, password) => layDuLieu(await apiClient.post('/auth/internal-login', { identifier, password }))
export const registerApi = async (payload) => layDuLieu(await apiClient.post('/auth/register', payload))
export const getMeApi = async () => layDuLieu(await apiClient.get('/auth/me'))
export const logoutApi = () => apiClient.post('/auth/logout', {})
export const getUsersApi = async () => tachPhanHoi(await apiClient.get('/users'))
