import { apiClient } from '../apiClient'

export const loginApi = (identifier, password) => apiClient.post('/auth/login', { identifier, password })
export const internalLoginApi = (identifier, password) => apiClient.post('/auth/internal-login', { identifier, password })
export const registerApi = (payload) => apiClient.post('/auth/register', payload)
export const getMeApi = () => apiClient.get('/auth/me')
export const logoutApi = () => apiClient.post('/auth/logout', {})
export const getUsersApi = () => apiClient.get('/users')
