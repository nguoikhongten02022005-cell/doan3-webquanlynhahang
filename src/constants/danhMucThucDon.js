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

export const GHI_CHU_DANH_MUC_THUC_DON = Object.freeze({
  'Món Chính': 'Đậm vị, chỉn chu cho bữa chính.',
  'Khai Vị': 'Nhẹ nhàng để mở vị và khởi nhịp bàn ăn.',
  'Đồ Uống': 'Cocktail, trà và thức uống đi cùng món.',
  'Tráng Miệng': 'Một kết thúc mềm và gọn cho bữa tối.',
  Combo: 'Lựa chọn tiện cho cặp đôi và nhóm nhỏ.',
})

export const HOME_CAC_DANH_MUC_THUC_DON = Object.freeze([
  { name: 'Món Chính', icon: '🍲', note: GHI_CHU_DANH_MUC_THUC_DON['Món Chính'] },
  { name: 'Khai Vị', icon: '🥗', note: GHI_CHU_DANH_MUC_THUC_DON['Khai Vị'] },
  { name: 'Đồ Uống', icon: '🍹', note: GHI_CHU_DANH_MUC_THUC_DON['Đồ Uống'] },
  { name: 'Tráng Miệng', icon: '🍮', note: GHI_CHU_DANH_MUC_THUC_DON['Tráng Miệng'] },
  { name: 'Combo', icon: '🍱', note: GHI_CHU_DANH_MUC_THUC_DON.Combo },
])

export const DIEM_TIN_CAY_TRANG_THUC_DON = Object.freeze([
  'Chọn món theo nhịp bữa ăn, không bị rối bởi quá nhiều thao tác.',
  'Giữ luồng xem chi tiết và thêm giỏ nhanh ngay trên từng món.',
  'Dễ chuyển từ xem món sang đặt bàn cho nhóm nhỏ hoặc buổi hẹn tối.',
])

export const NHAN_THUC_DON_NOI_BAT = Object.freeze([
  'Chuẩn bị theo ngày',
  'Ưu tiên món được chọn nhiều',
  'Có thể lọc nhanh theo khẩu vị',
])

export const NHAN_CTA_DAT_BAN_THUC_DON = Object.freeze([
  'Giữ chỗ nhanh',
  'Phù hợp nhóm nhỏ',
  'Đi thẳng vào bữa ăn',
])

export const CAC_MOC_THONG_TIN_THUC_DON = Object.freeze([
  'Chọn theo danh mục rõ ràng',
  'Mở chi tiết món ngay tại chỗ',
  'Phối hợp cùng bước đặt bàn cuối trang',
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
