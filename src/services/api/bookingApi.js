import { apiClient, tachPhanHoi } from '../apiClient'

export const getBookingsApi = async () => tachPhanHoi(await apiClient.get('/bookings'))
export const getBookingHistoryApi = async () => tachPhanHoi(await apiClient.get('/bookings/history'))
export const createBookingApi = async (payload) => tachPhanHoi(await apiClient.post('/bookings', payload))
export const createInternalBookingApi = async (payload) => tachPhanHoi(await apiClient.post('/bookings/internal', payload))
export const updateBookingApi = async (id, payload) => tachPhanHoi(await apiClient.patch(`/bookings/${id}`, payload))
export const updateBookingStatusApi = async (id, status) => tachPhanHoi(await apiClient.patch(`/bookings/${id}/status`, { status }))
export const assignBookingTablesApi = async (id, tableIds) => tachPhanHoi(await apiClient.patch(`/bookings/${id}/assign-tables`, { tableIds }))
export const cancelBookingApi = async (id) => tachPhanHoi(await apiClient.patch(`/bookings/${id}/cancel`, {}))
