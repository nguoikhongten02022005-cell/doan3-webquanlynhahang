import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import { taoPhanHoiOffline, timMaGiamGiaOfflineTheoCode } from '../offline/dichVuOfflineStore'
import { chuanHoaKetQuaVoucher as chuanHoaKetQuaPhieuGiamGia } from '../../features/donHang/contracts'

const chuanHoaPhieuGiamGia = (phieuGiamGia) => {
  const ketQua = chuanHoaKetQuaPhieuGiamGia(phieuGiamGia)
  if (!ketQua.maGiamGia) {
    return null
  }

  return {
    ...phieuGiamGia,
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

export const kiemTraPhieuGiamGiaApi = async (maPhieuGiamGia, tongTienDonHang = 0, loaiDon = '') => {
  if (!coSuDungMayChu()) {
    const voucher = timMaGiamGiaOfflineTheoCode(maPhieuGiamGia)

    if (!voucher) {
      throw new Error('Mã giảm giá không tồn tại hoặc không còn hiệu lực.')
    }

    const tongTien = Number(tongTienDonHang || 0)
    const dieuKienToiThieu = Number(voucher.minOrderAmount || voucher.dieuKienToiThieu || 0)
    if (tongTien < dieuKienToiThieu) {
      throw new Error('Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá.')
    }

    const phanHoi = tachPhanHoiApi(taoPhanHoiOffline({
      ...voucher,
      thongDiep: voucher.description || voucher.thongDiep || '',
      loaiDon,
    }, 'Kiem tra ma giam gia thanh cong'))

    return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.post('/ma-giam-gia/validate', { maCode: maPhieuGiamGia, tongTien: tongTienDonHang, loaiDon }))
  return { ...phanHoi, duLieu: chuanHoaPhieuGiamGia(phanHoi.duLieu) }
}
