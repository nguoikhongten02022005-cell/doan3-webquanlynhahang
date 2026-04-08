import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'
import { chuanHoaKetQuaVoucher } from '../../features/donHang/contracts'

const chuanHoaPhieuGiamGia = (voucher) => {
  const ketQua = chuanHoaKetQuaVoucher(voucher)
  if (!ketQua.maGiamGia) {
    return null
  }

  return {
    ...voucher,
    ...ketQua,
    code: ketQua.maGiamGia,
    name: ketQua.tenGiamGia,
    description: ketQua.thongDiep,
    discountType: ketQua.loaiGiam,
    discountValue: ketQua.giaTriGiam,
    minOrderAmount: ketQua.dieuKienToiThieu,
    maxDiscountAmount: ketQua.giamToiDa,
    discountAmount: ketQua.soTienGiamThucTe,
  }
}

export const kiemTraPhieuGiamGiaApi = async (code, orderAmount = 0, loaiDon = '') => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.post('/ma-giam-gia/validate', { maCode: code, tongTien: orderAmount, loaiDon }))
  return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
}
