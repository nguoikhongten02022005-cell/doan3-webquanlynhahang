export const NHAN_TRANG_THAI_DON_HANG = Object.freeze({
  MOI_TAO: 'Mới tạo',
  DA_XAC_NHAN: 'Đã xác nhận',
  DANG_CHUAN_BI: 'Đang chuẩn bị',
  DANG_PHUC_VU: 'Đang phục vụ',
  DA_HOAN_THANH: 'Đã hoàn thành',
  DA_HUY: 'Đã hủy',
})

export const SAC_THAI_TRANG_THAI_DON_HANG = Object.freeze({
  MOI_TAO: 'warning',
  DA_XAC_NHAN: 'success',
  DANG_CHUAN_BI: 'warning',
  DANG_PHUC_VU: 'warning',
  DA_HOAN_THANH: 'success',
  DA_HUY: 'danger',
})

export const CAC_BUOC_TIEN_TRINH_DON_HANG = Object.freeze([
  'Mới tạo',
  'Đã xác nhận',
  'Đang chuẩn bị',
  'Đang phục vụ',
  'Hoàn thành',
])

const BUOC_TIEN_TRINH_DON_HANG_THEO_TRANG_THAI = Object.freeze({
  MOI_TAO: 1,
  DA_XAC_NHAN: 2,
  DANG_CHUAN_BI: 3,
  DANG_PHUC_VU: 4,
  DA_HOAN_THANH: 5,
  DA_HUY: 0,
})

export const NHAN_PHUONG_THUC_THANH_TOAN = Object.freeze({
  TIEN_MAT: 'Tiền mặt',
  CHUYEN_KHOAN: 'Chuyển khoản',
  THE: 'Thẻ',
})

export const TUY_CHON_PHUONG_THUC_THANH_TOAN = Object.freeze([
  {
    value: 'TIEN_MAT',
    label: 'Tiền mặt',
    description: 'Thanh toán trực tiếp tại bàn hoặc khi nhận món.',
  },
  {
    value: 'CHUYEN_KHOAN',
    label: 'Chuyển khoản',
    description: 'Chuyển khoản cho đơn mang đi hoặc dùng tại bàn.',
  },
  {
    value: 'THE',
    label: 'Thanh toán bằng thẻ',
    description: 'Dùng thẻ tại quầy hoặc thiết bị hỗ trợ.',
  },
])

const chuanHoaVanBan = (giaTri) => String(giaTri ?? '').trim()

const chuanHoaKichCoDaChon = (giaTri) => chuanHoaVanBan(giaTri).toUpperCase() || 'M'

const chuanHoaToppingDaChon = (giaTri) => (
  Array.isArray(giaTri)
    ? giaTri.map((muc) => chuanHoaVanBan(muc)).filter(Boolean)
    : []
)

const BI_DANH_PHUONG_THUC_THANH_TOAN = Object.freeze({
  cash: 'TIEN_MAT',
  banking: 'CHUYEN_KHOAN',
  card: 'THE',
})

export const chuanHoaPhuongThucThanhToan = (giaTri) => {
  const giaTriDaChuanHoa = chuanHoaVanBan(giaTri)

  if (NHAN_PHUONG_THUC_THANH_TOAN[giaTriDaChuanHoa]) {
    return giaTriDaChuanHoa
  }

  return BI_DANH_PHUONG_THUC_THANH_TOAN[giaTriDaChuanHoa.toLowerCase()] || 'TIEN_MAT'
}

export const chuanHoaIdMonAn = (giaTri) => {
  const giaTriDaChuanHoa = Number(giaTri)
  return Number.isInteger(giaTriDaChuanHoa) && giaTriDaChuanHoa > 0 ? giaTriDaChuanHoa : undefined
}

export const layNhanTrangThaiDonHang = (trangThai) => NHAN_TRANG_THAI_DON_HANG[trangThai] || chuanHoaVanBan(trangThai) || 'Không xác định'

export const laySacThaiDonHang = (trangThai) => SAC_THAI_TRANG_THAI_DON_HANG[trangThai] || 'neutral'

export const layBuocTienTrinhDonHang = (trangThai) => BUOC_TIEN_TRINH_DON_HANG_THEO_TRANG_THAI[trangThai] ?? 0

export const laTrangThaiDonHangDaHuy = (trangThai) => trangThai === 'DA_HUY'

export const laTrangThaiDonHangKetThuc = (trangThai) => trangThai === 'DA_HOAN_THANH' || trangThai === 'DA_HUY'

export const laTrangThaiDonHangDangHoatDong = (trangThai) => Boolean(trangThai) && !laTrangThaiDonHangKetThuc(trangThai)

export const layNhanPhuongThucThanhToan = (phuongThucThanhToan) => (
  NHAN_PHUONG_THUC_THANH_TOAN[phuongThucThanhToan] || chuanHoaVanBan(phuongThucThanhToan) || 'Chưa chọn'
)

export const anhXaMonTrongGioThanhMonDonHang = (monTrongGio) => ({
  menuItemId: chuanHoaIdMonAn(monTrongGio?.menuItemId ?? monTrongGio?.id),
  quantity: Math.max(1, Number(monTrongGio?.quantity) || 1),
  selectedSize: chuanHoaKichCoDaChon(monTrongGio?.selectedSize),
  selectedToppings: chuanHoaToppingDaChon(monTrongGio?.selectedToppings),
  specialNote: chuanHoaVanBan(monTrongGio?.specialNote),
  variantKey: chuanHoaVanBan(monTrongGio?.variantKey),
})

export const taoDuLieuTaoDonHang = ({ cartItems, voucherCode, customer, note, tableNumber, paymentMethod }) => ({
  items: Array.isArray(cartItems) ? cartItems.map(anhXaMonTrongGioThanhMonDonHang) : [],
  voucherCode: chuanHoaVanBan(voucherCode).toUpperCase(),
  customer: {
    fullName: chuanHoaVanBan(customer?.fullName),
    phone: chuanHoaVanBan(customer?.phone),
    email: chuanHoaVanBan(customer?.email),
    address: chuanHoaVanBan(customer?.address),
  },
  note: chuanHoaVanBan(note),
  tableNumber: chuanHoaVanBan(tableNumber),
  paymentMethod: chuanHoaPhuongThucThanhToan(paymentMethod),
})

export const layMonKhongHopLeTrongDonHang = (cartItems) => (
  Array.isArray(cartItems)
    ? cartItems.filter((item) => !chuanHoaIdMonAn(item?.menuItemId ?? item?.id))
    : []
)
