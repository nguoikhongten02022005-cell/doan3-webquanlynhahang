import { apiClient } from '../apiClient'

export const getTablesApi = () => apiClient.get('/tables')
export const updateTableStatusApi = (id, status) => apiClient.patch(`/tables/${id}/status`, { status })
