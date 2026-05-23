export const CAC_BO_LOC_NGAY = Object.freeze([
  { key: 'all', label: 'Tất cả ngày' },
  { key: 'today', label: 'Hôm nay' },
  { key: 'tomorrow', label: 'Ngày mai' },
  { key: 'last7Days', label: '7 ngày gần đây' },
  { key: 'last30Days', label: '30 ngày gần đây' },
])

export const CAC_BO_LOC_CA = Object.freeze([
  { key: 'all', label: 'Mọi ca' },
  { key: 'lunch', label: 'Ca trưa' },
  { key: 'dinner', label: 'Ca tối' },
])

export const CAC_KHU_VUC_BAN = Object.freeze([
  { id: 'SANH_CHINH', name: 'Sảnh chính', total: 12 },
  { id: 'PHONG_VIP', name: 'Khu riêng / VIP', total: 4 },
  { id: 'BAN_CONG', name: 'Ngoài trời', total: 6 },
  { id: 'QUAY_BAR', name: 'Quầy bar', total: 5 },
])

export const CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG = new Set([
  'Pending',
  'Confirmed',
  'Seated',
  'YEU_CAU_DAT_BAN',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])

export const CAC_TRANG_THAI_DAT_BAN_CHO_XAC_NHAN = new Set([
  'Pending',
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
])

export const CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN = new Set([
  'Confirmed',
  'Seated',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])

export const TRANG_THAI_DON_SAP_TOI = new Set(['PENDING', 'Pending', 'Confirmed', 'Seated', 'YEU_CAU_DAT_BAN', 'GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'CHO_XAC_NHAN', 'DA_GHI_NHAN', 'DA_CHECK_IN', 'DA_XEP_BAN'])

export const TRANG_THAI_LICH_SU = new Set(['COMPLETED', 'DA_HOAN_THANH', 'CANCELLED', 'DA_HUY', 'EXPIRED', 'KHONG_DEN', 'TU_CHOI_HET_CHO', 'NO_SHOW'])
