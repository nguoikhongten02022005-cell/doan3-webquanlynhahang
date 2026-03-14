import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layJsonLuuTru, xoaMucLuuTru, datJsonLuuTru } from './dichVuLuuTru'

const normalizeCheckoutDraft = (draft) => {
  if (!draft || typeof draft !== 'object') {
    return null
  }

  return {
    note: String(draft.note ?? ''),
    tableNumber: String(draft.tableNumber ?? ''),
  }
}

export const layBanNhapTamThanhToan = () => normalizeCheckoutDraft(layJsonLuuTru(STORAGE_KEYS.CHECKOUT_DRAFT, null))

export const luuBanNhapTamThanhToan = (draft) => {
  const normalizedDraft = normalizeCheckoutDraft(draft)

  if (!normalizedDraft) {
    xoaMucLuuTru(STORAGE_KEYS.CHECKOUT_DRAFT)
    return null
  }

  datJsonLuuTru(STORAGE_KEYS.CHECKOUT_DRAFT, normalizedDraft)
  return normalizedDraft
}

export const xoaBanNhapTamThanhToan = () => {
  xoaMucLuuTru(STORAGE_KEYS.CHECKOUT_DRAFT)
}
