import { getTablesApi, updateTableStatusApi } from './tableApi'

export const getTablesGateway = async () => {
  const { duLieu } = await getTablesApi()
  return Array.isArray(duLieu) ? duLieu : []
}

export const updateTableStatusGateway = async (id, status) => {
  const { duLieu } = await updateTableStatusApi(id, status)
  return duLieu
}
