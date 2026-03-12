import { apiClient } from '../apiClient'

export const getOrdersApi = () => apiClient.get('/orders')
export const getMyOrdersApi = () => apiClient.get('/orders/me')
export const createOrderApi = (payload) => apiClient.post('/orders', payload)
export const updateOrderStatusApi = (id, status) => apiClient.patch(`/orders/${id}/status`, { status })
