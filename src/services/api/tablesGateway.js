import { getTablesApi, updateTableStatusApi } from './tableApi'
import { layDuLieu } from '../apiClient'

export const getTablesGateway = async () => {
  const duLieu = layDuLieu(await getTablesApi())
  return Array.isArray(duLieu) ? duLieu : []
}

export const updateTableStatusGateway = async (id, status) => layDuLieu(await updateTableStatusApi(id, status))
