export const DANH_MUC_TAT_CA_THUC_DON = 'Tất cả'
export const DANH_MUC_MAC_DINH_THUC_DON = 'Món Chính'

export const CAC_DANH_MUC_CHUAN_THUC_DON = Object.freeze([
  'Món Chính',
  'Khai Vị',
  'Đồ Uống',
  'Tráng Miệng',
  'Combo',
])

export const CAC_DANH_MUC_THUC_DON = Object.freeze([
  DANH_MUC_TAT_CA_THUC_DON,
  ...CAC_DANH_MUC_CHUAN_THUC_DON,
])

export const MO_TA_DANH_MUC_THUC_DON = Object.freeze({
  [DANH_MUC_TAT_CA_THUC_DON]: 'Toàn bộ thực đơn trong ngày',
  'Món Chính': 'Các món no bụng và đậm vị',
  'Khai Vị': 'Nhẹ nhàng để bắt đầu bữa ăn',
  'Đồ Uống': 'Nước uống mát lạnh và cà phê',
  'Tráng Miệng': 'Món ngọt kết thúc bữa ăn',
  Combo: 'Set tiết kiệm cho nhóm và cặp đôi',
})

export const HOME_CAC_DANH_MUC_THUC_DON = Object.freeze([
  { name: 'Món Chính', icon: '🍲' },
  { name: 'Khai Vị', icon: '🥗' },
  { name: 'Đồ Uống', icon: '🍹' },
  { name: 'Tráng Miệng', icon: '🍮' },
  { name: 'Combo', icon: '🍱' },
])

export const BI_DANH_DANH_MUC_THUC_DON = Object.freeze({
  '': DANH_MUC_MAC_DINH_THUC_DON,
  monchinh: 'Món Chính',
  monchinhh: 'Món Chính',
  'mónchính': 'Món Chính',
  'mónănchính': 'Món Chính',
  main: 'Món Chính',
  mains: 'Món Chính',
  maincourse: 'Món Chính',
  maindish: 'Món Chính',
  entree: 'Món Chính',
  khaivi: 'Khai Vị',
  appetiser: 'Khai Vị',
  appetizer: 'Khai Vị',
  appetizers: 'Khai Vị',
  appetisers: 'Khai Vị',
  starter: 'Khai Vị',
  starters: 'Khai Vị',
  douong: 'Đồ Uống',
  drink: 'Đồ Uống',
  drinks: 'Đồ Uống',
  beverage: 'Đồ Uống',
  beverages: 'Đồ Uống',
  dessert: 'Tráng Miệng',
  desserts: 'Tráng Miệng',
  trangmieng: 'Tráng Miệng',
  sweet: 'Tráng Miệng',
  sweets: 'Tráng Miệng',
  combo: 'Combo',
  combos: 'Combo',
  combomeal: 'Combo',
  setmenu: 'Combo',
})
