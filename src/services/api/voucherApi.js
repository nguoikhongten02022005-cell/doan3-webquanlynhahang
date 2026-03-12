import { apiClient } from '../apiClient'

export const getVoucherByCodeApi = (code) => apiClient.get(`/vouchers/${encodeURIComponent(code)}`)
export const validateVoucherApi = (code, orderAmount = 0) => apiClient.post('/vouchers/validate', { code, orderAmount })
