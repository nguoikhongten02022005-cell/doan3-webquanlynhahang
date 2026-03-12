import { apiClient } from '../apiClient'

export const getVoucherByCodeApi = (code) => apiClient.get(`/vouchers/${encodeURIComponent(code)}`)
