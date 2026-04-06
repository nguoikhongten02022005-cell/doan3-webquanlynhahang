export const NHAN_TRANG_THAI_DON_HANG = Object.freeze({
  Pending: 'Mới tạo',
  Confirmed: 'Đã xác nhận',
  Preparing: 'Đang chuẩn bị',
  Ready: 'Sẵn sàng',
  Served: 'Đang phục vụ',
  Paid: 'Đã hoàn thành',
  Cancelled: 'Đã hủy',
})

export const SAC_THAI_TRANG_THAI_DON_HANG = Object.freeze({
  Pending: 'warning',
  Confirmed: 'success',
  Preparing: 'warning',
  Ready: 'warning',
  Served: 'warning',
  Paid: 'success',
  Cancelled: 'danger',
})

const BUOC_TIEN_TRINH_DON_HANG_THEO_TRANG_THAI = Object.freeze({
  Pending: 1,
  Confirmed: 2,
  Preparing: 3,
  Ready: 4,
  Served: 5,
  Paid: 6,
  Cancelled: 0,
})

export const NHAN_PHUONG_THUC_THANH_TOAN = Object.freeze({
  TienMat: 'Tiền mặt',
  ChuyenKhoan: 'Chuyển khoản',
  TheNganHang: 'Thẻ',
  MoMo: 'MoMo',
  ZaloPay: 'ZaloPay',
  VNPay: 'VNPay',
})

export const TUY_CHON_PHUONG_THUC_THANH_TOAN = Object.freeze([
  {
    value: 'TienMat',
    label: 'Tiền mặt',
    description: 'Thanh toán trực tiếp tại bàn hoặc khi nhận món.',
  },
  {
    value: 'ChuyenKhoan',
    label: 'Chuyển khoản',
    description: 'Chuyển khoản cho đơn mang đi hoặc dùng tại bàn.',
  },
  {
    value: 'TheNganHang',
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
  cash: 'TienMat',
  banking: 'ChuyenKhoan',
  card: 'TheNganHang',
})

export const chuanHoaPhuongThucThanhToan = (giaTri) => {
  const giaTriDaChuanHoa = chuanHoaVanBan(giaTri)

  if (NHAN_PHUONG_THUC_THANH_TOAN[giaTriDaChuanHoa]) {
    return giaTriDaChuanHoa
  }

  return BI_DANH_PHUONG_THUC_THANH_TOAN[giaTriDaChuanHoa.toLowerCase()] || 'TienMat'
}

export const chuanHoaIdMonAn = (giaTri) => String(giaTri ?? '').trim() || undefined

export const layNhanTrangThaiDonHang = (trangThai) => NHAN_TRANG_THAI_DON_HANG[trangThai] || chuanHoaVanBan(trangThai) || 'Không xác định'

export const laySacThaiDonHang = (trangThai) => SAC_THAI_TRANG_THAI_DON_HANG[trangThai] || 'neutral'

export const layBuocTienTrinhDonHang = (trangThai) => BUOC_TIEN_TRINH_DON_HANG_THEO_TRANG_THAI[trangThai] ?? 0

export const laTrangThaiDonHangDaHuy = (trangThai) => trangThai === 'Cancelled'

export const laTrangThaiDonHangKetThuc = (trangThai) => trangThai === 'Paid' || trangThai === 'Cancelled'

export const laTrangThaiDonHangDangHoatDong = (trangThai) => Boolean(trangThai) && !laTrangThaiDonHangKetThuc(trangThai)

export const layNhanPhuongThucThanhToan = (phuongThucThanhToan) => (
  NHAN_PHUONG_THUC_THANH_TOAN[phuongThucThanhToan] || chuanHoaVanBan(phuongThucThanhToan) || 'Chưa chọn'
)

export const anhXaMonTrongGioThanhMonDonHang = (monTrongGio) => ({
  menuItemId: chuanHoaIdMonAn(monTrongGio?.menuItemId ?? monTrongGio?.maMon ?? monTrongGio?.id),
  quantity: Math.max(1, Number(monTrongGio?.quantity) || 1),
  kichCoDaChon: chuanHoaKichCoDaChon(monTrongGio?.kichCoDaChon),
  toppingDaChon: chuanHoaToppingDaChon(monTrongGio?.toppingDaChon),
  ghiChuRieng: chuanHoaVanBan(monTrongGio?.ghiChuRieng),
  variantKey: chuanHoaVanBan(monTrongGio?.variantKey),
})

export const taoDuLieuTaoDonHang = ({ cartItems, voucherCode, customer, note, tableNumber, paymentMethod }) => ({
  maKH: chuanHoaVanBan(customer?.customerCode || customer?.maKH),
  maBan: chuanHoaVanBan(tableNumber) || null,
  maNV: null,
  maDatBan: null,
  nguonTao: 'Online',
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
