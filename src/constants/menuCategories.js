export const MENU_ALL_CATEGORY = 'Tất cả'
export const MENU_DEFAULT_CATEGORY = 'Món Chính'

export const MENU_CANONICAL_CATEGORIES = Object.freeze([
  'Món Chính',
  'Khai Vị',
  'Đồ Uống',
  'Tráng Miệng',
  'Combo',
])

export const MENU_CATEGORIES = Object.freeze([
  MENU_ALL_CATEGORY,
  ...MENU_CANONICAL_CATEGORIES,
])

export const MENU_CATEGORY_DESCRIPTIONS = Object.freeze({
  [MENU_ALL_CATEGORY]: 'Toàn bộ thực đơn trong ngày',
  'Món Chính': 'Các món no bụng và đậm vị',
  'Khai Vị': 'Nhẹ nhàng để bắt đầu bữa ăn',
  'Đồ Uống': 'Nước uống mát lạnh và cà phê',
  'Tráng Miệng': 'Món ngọt kết thúc bữa ăn',
  Combo: 'Set tiết kiệm cho nhóm và cặp đôi',
})

export const HOME_MENU_CATEGORIES = Object.freeze([
  { name: 'Món Chính', icon: '🍲' },
  { name: 'Khai Vị', icon: '🥗' },
  { name: 'Đồ Uống', icon: '🍹' },
  { name: 'Tráng Miệng', icon: '🍮' },
  { name: 'Combo', icon: '🍱' },
])

export const MENU_CATEGORY_ALIASES = Object.freeze({
  '': MENU_DEFAULT_CATEGORY,
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
