import { STORAGE_KEYS } from '../constants/storageKeys'
import { getStorageItem } from './storageService'

const DEFAULT_DEV_API_BASE_URL = 'http://localhost:4000/api'

export const shouldUseBackend = () => String(import.meta.env.VITE_USE_BACKEND || 'false').toLowerCase() === 'true'

export const getApiBaseUrl = () => {
  const configuredBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim()

  if (configuredBaseUrl) {
    return configuredBaseUrl
  }

  if (import.meta.env.DEV) {
    return DEFAULT_DEV_API_BASE_URL
  }

  throw new Error('Thiếu VITE_API_BASE_URL cho frontend đang bật backend mode.')
}

const getAuthHeader = () => {
  const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN)

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

const laPhanHoiBao = (phanHoi) => (
  Boolean(phanHoi)
  && typeof phanHoi === 'object'
  && !Array.isArray(phanHoi)
  && ('success' in phanHoi || 'data' in phanHoi || 'message' in phanHoi || 'meta' in phanHoi)
)

export const layDuLieu = (phanHoi) => (laPhanHoiBao(phanHoi) ? (phanHoi.data ?? null) : (phanHoi ?? null))

export const layThongDiep = (phanHoi) => {
  if (!laPhanHoiBao(phanHoi)) {
    return ''
  }

  return typeof phanHoi.message === 'string' ? phanHoi.message : ''
}

export const layMeta = (phanHoi) => (laPhanHoiBao(phanHoi) ? (phanHoi.meta ?? null) : null)

export const tachPhanHoi = (phanHoi) => ({
  duLieu: layDuLieu(phanHoi),
  thongDiep: layThongDiep(phanHoi),
  meta: layMeta(phanHoi),
})

const request = async (path, options = {}) => {
  const { headers: customHeaders = {}, body, ...restOptions } = options
  const shouldSetJsonContentType = body !== undefined && !(body instanceof FormData)
  const headers = {
    ...getAuthHeader(),
    ...(shouldSetJsonContentType ? { 'Content-Type': 'application/json' } : {}),
    ...customHeaders,
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    credentials: 'include',
    headers,
    body,
    ...restOptions,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(data?.message || 'API request failed')
    error.status = response.status
    error.details = data?.details
    throw error
  }

  return data
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
