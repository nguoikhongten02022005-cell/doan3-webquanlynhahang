import { apiClient, tachPhanHoi } from '../apiClient'

export const getOrdersApi = async () => tachPhanHoi(await apiClient.get('/orders'))
export const getMyOrdersApi = async () => tachPhanHoi(await apiClient.get('/orders/me'))
export const createOrderApi = async (payload) => tachPhanHoi(await apiClient.post('/orders', payload))
export const updateOrderStatusApi = async (id, status) => tachPhanHoi(await apiClient.patch(`/orders/${id}/status`, { status }))
