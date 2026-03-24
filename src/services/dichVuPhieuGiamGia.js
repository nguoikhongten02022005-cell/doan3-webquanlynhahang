import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layJsonLuuTru, xoaMucLuuTru, datJsonLuuTru } from './dichVuLuuTru'

const chuanHoaVoucher = (voucher) => {
  if (!voucher || typeof voucher !== 'object') {
    return null
  }

  const maGiamGia = String(voucher.code || '').trim().toUpperCase()
  const soTienGiam = Number(voucher.amount ?? voucher.discountAmount ?? 0)
  const phanTramGiam = Number(voucher.discountPercent ?? voucher.percentage ?? 0)
  const laSoTienHopLe = Number.isFinite(soTienGiam) && soTienGiam > 0
  const laPhanTramHopLe = Number.isFinite(phanTramGiam) && phanTramGiam > 0

  if (!maGiamGia || (!laSoTienHopLe && !laPhanTramHopLe)) {
    return null
  }

  return {
    code: maGiamGia,
    amount: laSoTienHopLe ? soTienGiam : 0,
    discountPercent: laPhanTramHopLe ? phanTramGiam : 0,
  }
}

export const layPhieuGiamGiaDaApDung = () => chuanHoaVoucher(layJsonLuuTru(STORAGE_KEYS.PHIEU_GIAM_GIA_DA_AP_DUNG, null))

export const luuPhieuGiamGiaDaApDung = (voucher) => {
  const voucherDaChuanHoa = chuanHoaVoucher(voucher)

  if (!voucherDaChuanHoa) {
    xoaMucLuuTru(STORAGE_KEYS.PHIEU_GIAM_GIA_DA_AP_DUNG)
    return null
  }

  datJsonLuuTru(STORAGE_KEYS.PHIEU_GIAM_GIA_DA_AP_DUNG, voucherDaChuanHoa)
  return voucherDaChuanHoa
}

export const xoaPhieuGiamGiaDaApDung = () => {
  xoaMucLuuTru(STORAGE_KEYS.PHIEU_GIAM_GIA_DA_AP_DUNG)
}
