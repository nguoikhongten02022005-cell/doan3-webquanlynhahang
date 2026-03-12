const DEFAULT_API_BASE_URL = 'http://localhost:4000/api'

import { STORAGE_KEYS } from '../constants/storageKeys'
import { getStorageItem } from './storageService'

export const shouldUseBackend = () => String(import.meta.env.VITE_USE_BACKEND || 'false').toLowerCase() === 'true'
export const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL

const getAuthHeader = () => {
  const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN)

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

const request = async (path, options = {}) => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
    ...options,
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
