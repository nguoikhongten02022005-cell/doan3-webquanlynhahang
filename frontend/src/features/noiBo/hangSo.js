import { CAC_KHU_VUC_BAN_CHUAN } from '../../constants/khuVucBan'

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

export const CAC_KHU_VUC_BAN = CAC_KHU_VUC_BAN_CHUAN

export const CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG = new Set([
  'PENDING',
  'Pending',
  'CONFIRMED',
  'Confirmed',
  'SEATED',
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
  'PENDING',
  'Pending',
  'YEU_CAU_DAT_BAN',
  'CAN_GOI_LAI',
  'CHO_XAC_NHAN',
])

export const CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN = new Set([
  'CONFIRMED',
  'Confirmed',
  'SEATED',
  'Seated',
  'GIU_CHO_TAM',
  'DA_XAC_NHAN',
  'DA_GHI_NHAN',
  'DA_CHECK_IN',
  'DA_XEP_BAN',
])

export const TRANG_THAI_DON_SAP_TOI = new Set(['PENDING', 'Pending', 'Confirmed', 'Seated', 'YEU_CAU_DAT_BAN', 'GIU_CHO_TAM', 'DA_XAC_NHAN', 'CAN_GOI_LAI', 'CHO_XAC_NHAN', 'DA_GHI_NHAN', 'DA_CHECK_IN', 'DA_XEP_BAN'])

const BAN_DO_TRANG_THAI_DAT_BAN = Object.freeze({
  NOSHOW: 'NO_SHOW',
  NO_SHOW: 'NO_SHOW',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SEATED: 'SEATED',
})

export const chuanHoaTrangThaiDatBan = (trangThai = '') => {
  const giaTri = String(trangThai || '').trim()
  if (!giaTri) return ''

  const khoa = giaTri.replace(/[\s-]+/g, '_').toUpperCase()
  return BAN_DO_TRANG_THAI_DAT_BAN[khoa] || khoa
}

export const TRANG_THAI_LICH_SU = new Set(['COMPLETED', 'DA_HOAN_THANH', 'CANCELLED', 'DA_HUY', 'EXPIRED', 'KHONG_DEN', 'TU_CHOI_HET_CHO', 'NO_SHOW'])
