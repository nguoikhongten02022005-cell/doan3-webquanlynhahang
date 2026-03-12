import { getTablesApi, updateTableStatusApi } from './tableApi'

export const getTablesGateway = async () => getTablesApi()

export const updateTableStatusGateway = async (id, status) => updateTableStatusApi(id, status)
