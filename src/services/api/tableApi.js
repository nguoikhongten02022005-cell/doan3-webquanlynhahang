import { apiClient, tachPhanHoi } from '../apiClient'

export const getTablesApi = async () => tachPhanHoi(await apiClient.get('/tables'))
export const updateTableStatusApi = async (id, status) => tachPhanHoi(await apiClient.patch(`/tables/${id}/status`, { status }))
