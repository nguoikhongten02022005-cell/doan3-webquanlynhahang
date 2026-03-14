export const TRANG_THAI_BAN = Object.freeze({
  TRONG: 'AVAILABLE',
  GIU_CHO: 'HELD',
  DANG_SU_DUNG: 'OCCUPIED',
  BAN: 'DIRTY',
})

const CAC_TRANG_THAI_BAN_DANG_HOAT_DONG = new Set([
  TRANG_THAI_BAN.GIU_CHO,
  TRANG_THAI_BAN.DANG_SU_DUNG,
])

export const laBanDangHoatDong = (table) => CAC_TRANG_THAI_BAN_DANG_HOAT_DONG.has(table?.status)
