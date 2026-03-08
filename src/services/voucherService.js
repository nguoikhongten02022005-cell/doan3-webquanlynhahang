import { STORAGE_KEYS } from '../constants/storageKeys'
import { DEFAULT_VOUCHER } from '../constants/voucher'
import { getStorageJSON, removeStorageItem, setStorageJSON } from './storageService'

const normalizeVoucher = (voucher) => {
  if (!voucher) {
    return null
  }

  const normalizedCode = String(voucher.code || '').toUpperCase()
  const normalizedAmount = Number(voucher.amount)

  if (normalizedCode !== DEFAULT_VOUCHER.code || !Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    return null
  }

  return {
    code: normalizedCode,
    amount: normalizedAmount,
  }
}

export const getAppliedVoucher = () => {
  const voucher = getStorageJSON(STORAGE_KEYS.APPLIED_VOUCHER, null)
  return normalizeVoucher(voucher)
}

export const setAppliedVoucher = (voucher) => {
  const normalizedVoucher = normalizeVoucher(voucher)

  if (!normalizedVoucher) {
    removeStorageItem(STORAGE_KEYS.APPLIED_VOUCHER)
    return null
  }

  setStorageJSON(STORAGE_KEYS.APPLIED_VOUCHER, normalizedVoucher)
  return normalizedVoucher
}

export const clearAppliedVoucher = () => {
  removeStorageItem(STORAGE_KEYS.APPLIED_VOUCHER)
}
