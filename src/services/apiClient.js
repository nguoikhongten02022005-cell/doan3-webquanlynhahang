import { STORAGE_KEYS } from '../constants/storageKeys'
import { clearAuthSession, saveAuthSession } from './authService'
import { getStorageItem } from './storageService'

const DEFAULT_DEV_API_BASE_URL = 'http://localhost:4000/api'
const AUTH_REFRESH_PATH = '/auth/refresh'
const AUTH_LOGOUT_PATH = '/auth/logout'

let refreshDangChay = null

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

const parseResponseData = async (response) => {
  if (response.status === 204) {
    return null
  }

  return response.json().catch(() => null)
}

const taoLoiApi = (response, data) => {
  const error = new Error(data?.message || 'API request failed')
  error.status = response.status
  error.details = data?.details
  return error
}

const rawRequest = async (path, options = {}) => {
  const {
    headers: customHeaders = {},
    body,
    includeAuthHeader = true,
    ...restOptions
  } = options

  const shouldSetJsonContentType = body !== undefined && !(body instanceof FormData)
  const headers = {
    ...(includeAuthHeader ? getAuthHeader() : {}),
    ...(shouldSetJsonContentType ? { 'Content-Type': 'application/json' } : {}),
    ...customHeaders,
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    credentials: 'include',
    headers,
    body,
    ...restOptions,
  })

  const data = await parseResponseData(response)

  return {
    response,
    data,
  }
}

const luuPhienMoiTuRefresh = (data) => {
  const duLieu = layDuLieu(data)
  const user = duLieu?.currentUser || duLieu?.user || null
  const accessToken = String(duLieu?.accessToken || '').trim()

  if (!user || !accessToken) {
    throw new Error('Phiên đăng nhập mới không hợp lệ.')
  }

  saveAuthSession({ user, accessToken })
  return duLieu
}

const refreshAccessToken = async () => {
  if (!refreshDangChay) {
    refreshDangChay = (async () => {
      const { response, data } = await rawRequest(AUTH_REFRESH_PATH, {
        method: 'POST',
        body: JSON.stringify({}),
        includeAuthHeader: false,
      })

      if (!response.ok) {
        throw taoLoiApi(response, data)
      }

      return luuPhienMoiTuRefresh(data)
    })().finally(() => {
      refreshDangChay = null
    })
  }

  return refreshDangChay
}

const coTheThuRefresh = (path, options) => {
  if (!shouldUseBackend()) {
    return false
  }

  if (options?.skipAuthRefresh) {
    return false
  }

  return path !== AUTH_REFRESH_PATH && path !== AUTH_LOGOUT_PATH
}

const request = async (path, options = {}) => {
  const { response, data } = await rawRequest(path, options)

  if (response.ok) {
    return data
  }

  if (response.status === 401 && coTheThuRefresh(path, options) && !options._retriedAfterRefresh) {
    try {
      await refreshAccessToken()
      return request(path, {
        ...options,
        _retriedAfterRefresh: true,
      })
    } catch (refreshError) {
      clearAuthSession()
      throw refreshError
    }
  }

  throw taoLoiApi(response, data)
}

export const apiClient = {
  get: (path, options = {}) => request(path, options),
  post: (path, body, options = {}) => request(path, { method: 'POST', body: JSON.stringify(body), ...options }),
  patch: (path, body, options = {}) => request(path, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: (path, options = {}) => request(path, { method: 'DELETE', ...options }),
}
