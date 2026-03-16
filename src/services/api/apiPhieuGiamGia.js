import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaPhieuGiamGia = (voucher) => {
  if (!voucher || typeof voucher !== 'object') {
    return null
  }

  return {
    ...voucher,
    code: voucher.maGiam,
    name: voucher.tenMaGiam,
    description: voucher.moTa,
    discountType: voucher.loaiGiam,
    discountValue: Number(voucher.giaTriGiam || 0),
    minOrderAmount: Number(voucher.donToiThieu || 0),
    maxDiscountAmount: voucher.giamToiDa == null ? null : Number(voucher.giamToiDa),
  }
}

export const layPhieuGiamGiaTheoMaApi = async (code) => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get(`/ma-giam-gia/${encodeURIComponent(code)}`))
  return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
}

export const kiemTraPhieuGiamGiaApi = async (code, orderAmount = 0) => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.post('/ma-giam-gia/validate', { maGiam: code, giaTriDonHang: orderAmount }))
  return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
}
