export const TAB_NOI_BO = Object.freeze({
  TONG_QUAN: 'overview',
  DAT_BAN: 'bookings',
  DON_HANG: 'orders',
  BAN_AN: 'tables',
  MON_AN: 'dishes',
  TAI_KHOAN: 'accounts',
})

export const CAC_TAB_NOI_BO = Object.freeze([
  { key: TAB_NOI_BO.TONG_QUAN, label: 'Tổng quan' },
  { key: TAB_NOI_BO.DAT_BAN, label: 'Đặt bàn' },
  { key: TAB_NOI_BO.DON_HANG, label: 'Đơn đang mở' },
  { key: TAB_NOI_BO.BAN_AN, label: 'Bàn ăn' },
  { key: TAB_NOI_BO.MON_AN, label: 'Quản lý món ăn', adminOnly: true },
  { key: TAB_NOI_BO.TAI_KHOAN, label: 'Tài khoản', adminOnly: true },
])

export const CAC_BO_LOC_NGAY = Object.freeze([
  { key: 'all', label: 'Toàn bộ ngày' },
  { key: 'today', label: 'Hôm nay' },
  { key: 'tomorrow', label: 'Ngày mai' },
])

export const CAC_BO_LOC_CA = Object.freeze([
  { key: 'all', label: 'Mọi ca' },
  { key: 'lunch', label: 'Ca trưa' },
  { key: 'dinner', label: 'Ca tối' },
])

export const CAC_KHU_VUC_BAN = Object.freeze([
  { id: 'SANH_CHINH', name: 'Sảnh chính', total: 12 },
  { id: 'PHONG_VIP', name: 'Phòng VIP', total: 4 },
  { id: 'BAN_CONG', name: 'Ban công', total: 6 },
  { id: 'QUAY_BAR', name: 'Quầy bar', total: 5 },
])

export const CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG = new Set([
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
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
])

export const CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN = new Set([
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])
