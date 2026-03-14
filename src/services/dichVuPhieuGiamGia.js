import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layJsonLuuTru, xoaMucLuuTru, datJsonLuuTru } from './dichVuLuuTru'

const chuanHoaVoucher = (voucher) => {
  if (!voucher || typeof voucher !== 'object') {
    return null
  }

  const maGiamGia = String(voucher.code || '').trim().toUpperCase()
  const soTienGiam = Number(voucher.amount ?? voucher.discountAmount ?? 0)

  if (!maGiamGia || !Number.isFinite(soTienGiam) || soTienGiam <= 0) {
    return null
  }

  return {
    code: maGiamGia,
    amount: soTienGiam,
  }
}

export const layPhieuGiamGiaDaApDung = () => chuanHoaVoucher(layJsonLuuTru(STORAGE_KEYS.APPLIED_VOUCHER, null))

export const luuPhieuGiamGiaDaApDung = (voucher) => {
  const voucherDaChuanHoa = chuanHoaVoucher(voucher)

  if (!voucherDaChuanHoa) {
    xoaMucLuuTru(STORAGE_KEYS.APPLIED_VOUCHER)
    return null
  }

  datJsonLuuTru(STORAGE_KEYS.APPLIED_VOUCHER, voucherDaChuanHoa)
  return voucherDaChuanHoa
}

export const xoaPhieuGiamGiaDaApDung = () => {
  xoaMucLuuTru(STORAGE_KEYS.APPLIED_VOUCHER)
}
