import { shouldUseBackend } from '../apiClient'
import { getUsersApi } from './authApi'
import { getAccounts } from '../authService'

export const getAccountsGateway = async () => {
  if (shouldUseBackend()) {
    return getUsersApi()
  }

  return getAccounts()
}
