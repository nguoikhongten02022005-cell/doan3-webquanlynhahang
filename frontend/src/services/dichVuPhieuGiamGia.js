import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layJsonLuuTru, xoaMucLuuTru, datJsonLuuTru } from './dichVuLuuTru'

const chuanHoaVoucher = (voucher) => {
  if (!voucher || typeof voucher !== 'object') {
    return null
  }

  const maGiamGia = String(voucher.code || voucher.maGiamGia || '').trim().toUpperCase()
  const loaiGiam = String(voucher.discountType || voucher.loaiGiam || '').trim()
  const giaTriGiam = Number(voucher.discountValue ?? voucher.giaTriGiam ?? 0)
  const soTienGiamThucTe = Number(voucher.discountAmount ?? voucher.soTienGiamThucTe ?? voucher.amount ?? 0)
  const dieuKienToiThieu = Number(voucher.minOrderAmount ?? voucher.dieuKienToiThieu ?? 0)
  const giamToiDa = voucher.maxDiscountAmount ?? voucher.giamToiDa ?? null
  const tenGiamGia = String(voucher.name || voucher.tenGiamGia || '').trim()
  const thongDiep = String(voucher.description || voucher.thongDiep || '').trim()
  const laPhanTram = loaiGiam.toLowerCase() === 'phantram'
  const laTienMat = !laPhanTram && Number.isFinite(giaTriGiam) && giaTriGiam > 0

  if (!maGiamGia || (!laPhanTram && !laTienMat)) {
    return null
  }

  return {
    code: maGiamGia,
    maGiamGia,
    tenGiamGia,
    thongDiep,
    discountType: loaiGiam,
    discountValue: Number.isFinite(giaTriGiam) ? giaTriGiam : 0,
    minOrderAmount: Number.isFinite(dieuKienToiThieu) ? dieuKienToiThieu : 0,
    maxDiscountAmount: giamToiDa == null ? null : Number(giamToiDa),
    discountAmount: Number.isFinite(soTienGiamThucTe) ? Math.max(0, soTienGiamThucTe) : 0,
    discountPercent: laPhanTram && Number.isFinite(giaTriGiam) ? giaTriGiam : 0,
    amount: !laPhanTram && Number.isFinite(giaTriGiam) ? giaTriGiam : 0,
  }
}

export const tinhSoTienGiamTheoVoucher = (voucher, tongTienXetVoucher = 0) => {
  const voucherDaChuanHoa = chuanHoaVoucher(voucher)
  const tongTienHopLe = Number(tongTienXetVoucher || 0)

  if (!voucherDaChuanHoa || tongTienHopLe <= 0) {
    return 0
  }

  if (tongTienHopLe < voucherDaChuanHoa.minOrderAmount) {
    return 0
  }

  const laGiamPhanTram = String(voucherDaChuanHoa.discountType || '').toLowerCase() === 'phantram'
  const soTienGiamTamTinh = laGiamPhanTram
    ? Math.round((tongTienHopLe * Number(voucherDaChuanHoa.discountValue || 0)) / 100)
    : Number(voucherDaChuanHoa.discountValue || 0)

  const soTienGiamSauTran = voucherDaChuanHoa.maxDiscountAmount == null
    ? soTienGiamTamTinh
    : Math.min(soTienGiamTamTinh, Number(voucherDaChuanHoa.maxDiscountAmount || 0))

  return Math.min(Math.max(0, soTienGiamSauTran), tongTienHopLe)
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
