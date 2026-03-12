import { getUsersApi } from './authApi'

export const getAccountsGateway = async () => {
  const { duLieu } = await getUsersApi()
  return Array.isArray(duLieu) ? duLieu : []
}
