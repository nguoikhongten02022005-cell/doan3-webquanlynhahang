import { STORAGE_KEYS } from '../constants/storageKeys'
import { getStorageJSON, removeStorageItem, setStorageJSON } from './storageService'

const chuanHoaVoucher = (voucher) => {
  if (!voucher || typeof voucher !== 'object') {
    return null
  }

  const maGiamGia = String(voucher.code || '').trim().toUpperCase()
  const soTienGiam = Number(voucher.amount ?? voucher.discountAmount ?? 0)

  if (!maGiamGia || !Number.isFinite(soTienGiam) || soTienGiam <= 0) {
    return null
  }

  return {
    code: maGiamGia,
    amount: soTienGiam,
  }
}

export const getAppliedVoucher = () => chuanHoaVoucher(getStorageJSON(STORAGE_KEYS.APPLIED_VOUCHER, null))

export const setAppliedVoucher = (voucher) => {
  const voucherDaChuanHoa = chuanHoaVoucher(voucher)

  if (!voucherDaChuanHoa) {
    removeStorageItem(STORAGE_KEYS.APPLIED_VOUCHER)
    return null
  }

  setStorageJSON(STORAGE_KEYS.APPLIED_VOUCHER, voucherDaChuanHoa)
  return voucherDaChuanHoa
}

export const clearAppliedVoucher = () => {
  removeStorageItem(STORAGE_KEYS.APPLIED_VOUCHER)
}
