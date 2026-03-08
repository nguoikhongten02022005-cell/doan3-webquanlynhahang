import { STORAGE_KEYS } from '../constants/storageKeys'
import { getStorageJSON, removeStorageItem, setStorageJSON } from './storageService'

export const AUTH_USER_CHANGED_EVENT = 'auth:user-changed'

const dispatchAuthUserChanged = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(AUTH_USER_CHANGED_EVENT))
}

export const getAccounts = () => {
  const accounts = getStorageJSON(STORAGE_KEYS.ACCOUNTS, [])
  return Array.isArray(accounts) ? accounts : []
}

export const saveAccounts = (accounts) => {
  setStorageJSON(STORAGE_KEYS.ACCOUNTS, accounts)
}

export const getCurrentUser = () => getStorageJSON(STORAGE_KEYS.CURRENT_USER, null)

export const saveCurrentUser = (account) => {
  if (!account) {
    return
  }

  setStorageJSON(STORAGE_KEYS.CURRENT_USER, {
    fullName: account.fullName,
    username: account.username,
    email: account.email,
  })
  dispatchAuthUserChanged()
}

export const clearCurrentUser = () => {
  removeStorageItem(STORAGE_KEYS.CURRENT_USER)
  dispatchAuthUserChanged()
}

export const findAccountByIdentifier = (accounts, identifier) => {
  const normalizedIdentifier = String(identifier || '').trim().toLowerCase()

  return accounts.find((account) => {
    const username = String(account?.username ?? '').toLowerCase()
    const email = String(account?.email ?? '').toLowerCase()

    return username === normalizedIdentifier || email === normalizedIdentifier
  })
}
