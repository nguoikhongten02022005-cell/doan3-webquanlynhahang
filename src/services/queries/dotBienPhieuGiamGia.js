import { kiemTraPhieuGiamGiaApi } from '../api/apiPhieuGiamGia'
import { luuPhieuGiamGiaDaApDung } from '../dichVuPhieuGiamGia'

export const thucHienKiemTraPhieuGiamGia = async (maVoucher, tamTinh) => {
  const { duLieu } = await kiemTraPhieuGiamGiaApi(maVoucher, tamTinh)
  const voucher = duLieu
    ? {
        code: duLieu.code,
        amount: duLieu.discountType === 'FIXED'
          ? Number(duLieu.discountValue || 0)
          : Math.min(
              (tamTinh * Number(duLieu.discountValue || 0)) / 100,
              Number(duLieu.maxDiscountAmount || Number.MAX_SAFE_INTEGER),
            ),
      }
    : null

  return luuPhieuGiamGiaDaApDung(voucher)
}
