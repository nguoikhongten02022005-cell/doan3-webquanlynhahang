export const INTERNAL_TABS = Object.freeze([
  { key: 'overview', label: 'Tổng quan' },
  { key: 'bookings', label: 'Đặt bàn' },
  { key: 'orders', label: 'Đơn đang mở' },
  { key: 'tables', label: 'Bàn ăn' },
  { key: 'dishes', label: 'Quản lý món ăn', adminOnly: true },
  { key: 'accounts', label: 'Tài khoản', adminOnly: true },
])

export const DAY_FILTERS = Object.freeze([
  { key: 'all', label: 'Toàn bộ ngày' },
  { key: 'today', label: 'Hôm nay' },
  { key: 'tomorrow', label: 'Ngày mai' },
])

export const SHIFT_FILTERS = Object.freeze([
  { key: 'all', label: 'Mọi ca' },
  { key: 'lunch', label: 'Ca trưa' },
  { key: 'dinner', label: 'Ca tối' },
])

export const TABLE_AREAS = Object.freeze([
  { id: 'SANH_CHINH', name: 'Sảnh chính', total: 12 },
  { id: 'PHONG_VIP', name: 'Phòng VIP', total: 4 },
  { id: 'BAN_CONG', name: 'Ban công', total: 6 },
  { id: 'QUAY_BAR', name: 'Quầy bar', total: 5 },
])

export const ACTIVE_BOOKING_STATUSES = new Set([
  'YEU_CAU_DAT_BAN',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])

export const PENDING_CONFIRMATION_STATUSES = new Set([
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
])

export const CONFIRMED_BOOKING_STATUSES = new Set([
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])
