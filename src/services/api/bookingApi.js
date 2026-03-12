import { apiClient } from '../apiClient'

export const getBookingsApi = () => apiClient.get('/bookings')
export const getBookingHistoryApi = () => apiClient.get('/bookings/history')
export const createBookingApi = (payload) => apiClient.post('/bookings', payload)
export const createInternalBookingApi = (payload) => apiClient.post('/bookings/internal', payload)
export const updateBookingApi = (id, payload) => apiClient.patch(`/bookings/${id}`, payload)
export const updateBookingStatusApi = (id, status) => apiClient.patch(`/bookings/${id}/status`, { status })
export const assignBookingTablesApi = (id, tableIds) => apiClient.patch(`/bookings/${id}/assign-tables`, { tableIds })
export const cancelBookingApi = (id) => apiClient.patch(`/bookings/${id}/cancel`, {})
