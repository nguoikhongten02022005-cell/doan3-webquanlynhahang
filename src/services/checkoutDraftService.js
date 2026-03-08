import { STORAGE_KEYS } from '../constants/storageKeys'
import { getStorageJSON, removeStorageItem, setStorageJSON } from './storageService'

const normalizeCheckoutDraft = (draft) => {
  if (!draft || typeof draft !== 'object') {
    return null
  }

  return {
    note: String(draft.note ?? ''),
    tableNumber: String(draft.tableNumber ?? ''),
  }
}

export const getCheckoutDraft = () => normalizeCheckoutDraft(getStorageJSON(STORAGE_KEYS.CHECKOUT_DRAFT, null))

export const setCheckoutDraft = (draft) => {
  const normalizedDraft = normalizeCheckoutDraft(draft)

  if (!normalizedDraft) {
    removeStorageItem(STORAGE_KEYS.CHECKOUT_DRAFT)
    return null
  }

  setStorageJSON(STORAGE_KEYS.CHECKOUT_DRAFT, normalizedDraft)
  return normalizedDraft
}

export const clearCheckoutDraft = () => {
  removeStorageItem(STORAGE_KEYS.CHECKOUT_DRAFT)
}
