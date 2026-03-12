import { STORAGE_KEYS } from '../constants/storageKeys'
import { getStorageItem, getStorageJSON, removeStorageItem, setStorageItem, setStorageJSON } from './storageService'

export const AUTH_USER_CHANGED_EVENT = 'auth:user-changed'
export const AUTH_ROLES = Object.freeze({
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
})

const DEFAULT_INTERNAL_ACCOUNTS = Object.freeze([
  {
    fullName: 'Quản trị nhà hàng',
    username: 'admin',
    email: 'admin@nguyenvi.local',
    password: 'admin123',
    role: AUTH_ROLES.ADMIN,
  },
  {
    fullName: 'Nhân viên vận hành',
    username: 'staff',
    email: 'staff@nguyenvi.local',
    password: 'staff123',
    role: AUTH_ROLES.STAFF,
  },
])

const dispatchAuthUserChanged = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(AUTH_USER_CHANGED_EVENT))
}

const normalizeRole = (role) => {
  if (role === AUTH_ROLES.ADMIN) return AUTH_ROLES.ADMIN
  if (role === AUTH_ROLES.STAFF) return AUTH_ROLES.STAFF
  return AUTH_ROLES.CUSTOMER
}

const normalizeAccount = (account) => {
  if (!account || typeof account !== 'object') {
    return null
  }

  return {
    ...account,
    fullName: String(account.fullName ?? account.name ?? '').trim(),
    username: String(account.username ?? '').trim(),
    email: String(account.email ?? '').trim(),
    phone: String(account.phone ?? '').trim(),
    role: normalizeRole(account.role),
  }
}

const normalizeCurrentUser = (account) => {
  const normalizedAccount = normalizeAccount(account)

  if (!normalizedAccount) {
    return null
  }

  return {
    fullName: normalizedAccount.fullName,
    username: normalizedAccount.username,
    email: normalizedAccount.email,
    phone: normalizedAccount.phone,
    role: normalizedAccount.role,
  }
}

const mergeAccounts = (accounts) => {
  const mergedAccounts = [...DEFAULT_INTERNAL_ACCOUNTS, ...accounts]
  const seenIdentifiers = new Set()

  return mergedAccounts.filter((account) => {
    const normalizedAccount = normalizeAccount(account)

    if (!normalizedAccount) {
      return false
    }

    const accountKey = `${normalizedAccount.username.toLowerCase()}::${normalizedAccount.email.toLowerCase()}`
    if (seenIdentifiers.has(accountKey)) {
      return false
    }

    seenIdentifiers.add(accountKey)
    return true
  })
}

export const getAccounts = () => {
  const accounts = getStorageJSON(STORAGE_KEYS.ACCOUNTS, [])
  if (!Array.isArray(accounts)) {
    return [...DEFAULT_INTERNAL_ACCOUNTS]
  }

  return mergeAccounts(accounts.map(normalizeAccount).filter(Boolean))
}

export const saveAccounts = (accounts) => {
  const normalizedAccounts = Array.isArray(accounts) ? accounts.map(normalizeAccount).filter(Boolean) : []
  setStorageJSON(STORAGE_KEYS.ACCOUNTS, mergeAccounts(normalizedAccounts))
}

export const getCurrentUser = () => normalizeCurrentUser(getStorageJSON(STORAGE_KEYS.CURRENT_USER, null))

export const saveCurrentUser = (account) => {
  const normalizedCurrentUser = normalizeCurrentUser(account)

  if (!normalizedCurrentUser) {
    return
  }

  setStorageJSON(STORAGE_KEYS.CURRENT_USER, normalizedCurrentUser)
  dispatchAuthUserChanged()
}

export const clearCurrentUser = () => {
  removeStorageItem(STORAGE_KEYS.CURRENT_USER)
  dispatchAuthUserChanged()
}

export const getAuthToken = () => {
  const auth = getStorageItem(STORAGE_KEYS.AUTH_TOKEN)
  return typeof auth === 'string' && auth.trim() ? auth : ''
}

export const saveAuthToken = (token) => {
  if (!token || typeof token !== 'string') {
    return
  }

  setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

export const clearAuthToken = () => {
  removeStorageItem(STORAGE_KEYS.AUTH_TOKEN)
}

export const saveAuthSession = ({ user, accessToken }) => {
  saveCurrentUser(user)
  saveAuthToken(accessToken)
}

export const clearAuthSession = () => {
  clearAuthToken()
  clearCurrentUser()
}

export const findAccountByIdentifier = (accounts, identifier) => {
  const normalizedIdentifier = String(identifier || '').trim().toLowerCase()

  return accounts.find((account) => {
    const username = String(account?.username ?? '').toLowerCase()
    const email = String(account?.email ?? '').toLowerCase()

    return username === normalizedIdentifier || email === normalizedIdentifier
  })
}
