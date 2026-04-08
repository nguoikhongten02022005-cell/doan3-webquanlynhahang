export const TRANG_THAI_DON_HANG = Object.freeze({
  MOI_TAO: 'Pending',
  DA_XAC_NHAN: 'Confirmed',
  DANG_CHUAN_BI: 'Preparing',
  SAN_SANG: 'Ready',
  DANG_PHUC_VU: 'Served',
  HOAN_THANH: 'Paid',
  DA_HUY: 'Cancelled',
})

export const LOAI_DON_HANG = Object.freeze({
  TAI_QUAN: 'TAI_QUAN',
  MANG_VE_PICKUP: 'MANG_VE_PICKUP',
  MANG_VE_GIAO_HANG: 'MANG_VE_GIAO_HANG',
})

export const LOAI_GIAM_GIA = Object.freeze({
  PHAN_TRAM: 'PhanTram',
  TIEN_MAT: 'TienMat',
})

export const TAO_PRICING_SUMMARY_MAC_DINH = () => ({
  tamTinh: 0,
  giamGia: 0,
  phiDichVu: 0,
  phiShip: 0,
  tongTien: 0,
})

const layGiaTri = (nguon, ...khoa) => {
  for (const key of khoa) {
    if (nguon?.[key] !== undefined && nguon?.[key] !== null) {
      return nguon[key]
    }
  }
  return undefined
}

export const chuanHoaPricingSummary = (nguon = {}) => ({
  tamTinh: Number(layGiaTri(nguon, 'tamTinh', 'TamTinh', 'subtotal', 'Subtotal', 'tongTamTinh') || 0),
  giamGia: Number(layGiaTri(nguon, 'giamGia', 'GiamGia', 'discountAmount', 'DiscountAmount') || 0),
  phiDichVu: Number(layGiaTri(nguon, 'phiDichVu', 'PhiDichVu', 'serviceFee', 'ServiceFee') || 0),
  phiShip: Number(layGiaTri(nguon, 'phiShip', 'PhiShip', 'shippingFee', 'ShippingFee') || 0),
  tongTien: Number(layGiaTri(nguon, 'tongTien', 'TongTien', 'total', 'Total') || 0),
})

export const chuanHoaKetQuaVoucher = (nguon = {}) => ({
  hopLe: Boolean(layGiaTri(nguon, 'hopLe', 'HopLe', 'isValid', 'IsValid', 'maCode', 'MaCode')),
  maGiamGia: String(layGiaTri(nguon, 'maGiamGia', 'MaGiamGia', 'maCode', 'MaCode', 'code', 'Code') || '').trim(),
  tenGiamGia: String(layGiaTri(nguon, 'tenGiamGia', 'TenGiamGia', 'tenCode', 'TenCode', 'name', 'Name') || '').trim(),
  loaiGiam: String(layGiaTri(nguon, 'loaiGiam', 'LoaiGiam', 'discountType', 'DiscountType') || '').trim(),
  giaTriGiam: Number(layGiaTri(nguon, 'giaTriGiam', 'GiaTriGiam', 'giaTri', 'GiaTri', 'discountValue', 'DiscountValue') || 0),
  giamToiDa: layGiaTri(nguon, 'giamToiDa', 'GiamToiDa', 'giaTriToiDa', 'GiaTriToiDa', 'maxDiscountAmount', 'MaxDiscountAmount') == null
    ? null
    : Number(layGiaTri(nguon, 'giamToiDa', 'GiamToiDa', 'giaTriToiDa', 'GiaTriToiDa', 'maxDiscountAmount', 'MaxDiscountAmount')),
  dieuKienToiThieu: Number(layGiaTri(nguon, 'dieuKienToiThieu', 'DieuKienToiThieu', 'donHangToiThieu', 'DonHangToiThieu', 'minOrderAmount', 'MinOrderAmount') || 0),
  soTienGiamThucTe: Number(layGiaTri(nguon, 'soTienGiamThucTe', 'SoTienGiamThucTe', 'discountAmount', 'DiscountAmount') || 0),
  thongDiep: String(layGiaTri(nguon, 'thongDiep', 'ThongDiep', 'message', 'Message', 'moTa', 'MoTa', 'description', 'Description') || '').trim(),
})

export const chuanHoaThongTinNhanHang = (nguon = {}) => ({
  loaiDon: String(layGiaTri(nguon, 'loaiDon', 'LoaiDon') || '').trim(),
  diaChiGiao: String(layGiaTri(nguon, 'diaChiGiao', 'DiaChiGiao', 'address', 'Address') || '').trim(),
  gioLayHang: String(layGiaTri(nguon, 'gioLayHang', 'GioLayHang', 'pickupTime', 'PickupTime') || '').trim(),
  gioGiao: String(layGiaTri(nguon, 'gioGiao', 'GioGiao', 'deliveryTime', 'DeliveryTime') || '').trim(),
})

export const chuanHoaResponseDonHang = (nguon = {}) => ({
  pricingSummary: chuanHoaPricingSummary(nguon.pricingSummary || nguon.PricingSummary || nguon),
  voucher: chuanHoaKetQuaVoucher(nguon.voucher || nguon.Voucher || {}),
  thongTinNhanHang: chuanHoaThongTinNhanHang(nguon.thongTinNhanHang || nguon.ThongTinNhanHang || nguon),
})
