import { apiClient } from '../apiClient'

export const getMenuItemsApi = () => apiClient.get('/menu-items')
export const createMenuItemApi = (payload) => apiClient.post('/menu-items', payload)
export const updateMenuItemApi = (id, payload) => apiClient.patch(`/menu-items/${id}`, payload)
export const deleteMenuItemApi = (id) => apiClient.delete(`/menu-items/${id}`)
