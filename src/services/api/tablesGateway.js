import { shouldUseBackend } from '../apiClient'
import { getTablesApi, updateTableStatusApi } from './tableApi'
import { getTables as getLocalTables, updateTableStatus as updateLocalTableStatus } from '../tableService'

export const getTablesGateway = async () => {
  if (shouldUseBackend()) {
    return getTablesApi()
  }

  return getLocalTables()
}

export const updateTableStatusGateway = async (id, status) => {
  if (shouldUseBackend()) {
    return updateTableStatusApi(id, status)
  }

  return updateLocalTableStatus(id, status)
}
