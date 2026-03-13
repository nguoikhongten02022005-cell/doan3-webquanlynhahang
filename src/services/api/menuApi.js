import { apiClient, tachPhanHoi } from '../apiClient'

export const getMenuItemsApi = async () => tachPhanHoi(await apiClient.get('/menu-items'))
export const createMenuItemApi = async (payload) => tachPhanHoi(await apiClient.post('/menu-items', payload))
export const updateMenuItemApi = async (id, payload) => tachPhanHoi(await apiClient.patch(`/menu-items/${id}`, payload))
export const deleteMenuItemApi = async (id) => tachPhanHoi(await apiClient.delete(`/menu-items/${id}`))
