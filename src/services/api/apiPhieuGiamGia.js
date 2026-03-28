import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaPhieuGiamGia = (voucher) => {
  if (!voucher || typeof voucher !== 'object') {
    return null
  }

  return {
    ...voucher,
    code: voucher.maCode || voucher.MaCode,
    name: voucher.tenCode || voucher.TenCode,
    description: voucher.moTa || voucher.MoTa || '',
    discountType: voucher.loaiGiam || voucher.LoaiGiam,
    discountValue: Number(voucher.giaTri || voucher.GiaTri || 0),
    minOrderAmount: Number(voucher.donHangToiThieu || voucher.DonHangToiThieu || 0),
    maxDiscountAmount: voucher.giaTriToiDa == null && voucher.GiaTriToiDa == null ? null : Number(voucher.giaTriToiDa ?? voucher.GiaTriToiDa),
  }
}

export const layPhieuGiamGiaTheoMaApi = async (code) => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get(`/ma-giam-gia/${encodeURIComponent(code)}`))
  return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
}

export const kiemTraPhieuGiamGiaApi = async (code, orderAmount = 0) => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.post('/ma-giam-gia/validate', { maCode: code, tongTien: orderAmount }))
  return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
}
