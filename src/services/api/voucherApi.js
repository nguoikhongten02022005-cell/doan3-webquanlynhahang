import { apiClient, tachPhanHoi } from '../apiClient'

export const getVoucherByCodeApi = async (code) => tachPhanHoi(await apiClient.get(`/vouchers/${encodeURIComponent(code)}`))
export const validateVoucherApi = async (code, orderAmount = 0) => tachPhanHoi(await apiClient.post('/vouchers/validate', { code, orderAmount }))
