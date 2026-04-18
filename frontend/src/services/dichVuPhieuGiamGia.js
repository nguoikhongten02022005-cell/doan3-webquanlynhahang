import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layJsonLuuTru, xoaMucLuuTru, datJsonLuuTru } from './dichVuLuuTru'

const chuanHoaPhieuGiamGia = (phieuGiamGia) => {
  if (!phieuGiamGia || typeof phieuGiamGia !== 'object') {
    return null
  }

  const maGiamGia = String(phieuGiamGia.code || phieuGiamGia.maGiamGia || '').trim().toUpperCase()
  const loaiGiam = String(phieuGiamGia.discountType || phieuGiamGia.loaiGiam || '').trim()
  const giaTriGiam = Number(phieuGiamGia.discountValue ?? phieuGiamGia.giaTriGiam ?? 0)
  const soTienGiamThucTe = Number(phieuGiamGia.discountAmount ?? phieuGiamGia.soTienGiamThucTe ?? phieuGiamGia.amount ?? 0)
  const dieuKienToiThieu = Number(phieuGiamGia.minOrderAmount ?? phieuGiamGia.dieuKienToiThieu ?? 0)
  const giamToiDa = phieuGiamGia.maxDiscountAmount ?? phieuGiamGia.giamToiDa ?? null
  const tenGiamGia = String(phieuGiamGia.name || phieuGiamGia.tenGiamGia || '').trim()
  const thongDiep = String(phieuGiamGia.description || phieuGiamGia.thongDiep || '').trim()
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

export const tinhSoTienGiamTheoPhieuGiamGia = (phieuGiamGia, tongTienXetPhieuGiamGia = 0) => {
  const phieuGiamGiaDaChuanHoa = chuanHoaPhieuGiamGia(phieuGiamGia)
  const tongTienHopLe = Number(tongTienXetPhieuGiamGia || 0)

  if (!phieuGiamGiaDaChuanHoa || tongTienHopLe <= 0) {
    return 0
  }

  if (tongTienHopLe < phieuGiamGiaDaChuanHoa.minOrderAmount) {
    return 0
  }

  const laGiamPhanTram = String(phieuGiamGiaDaChuanHoa.discountType || '').toLowerCase() === 'phantram'
  const soTienGiamTamTinh = laGiamPhanTram
    ? Math.round((tongTienHopLe * Number(phieuGiamGiaDaChuanHoa.discountValue || 0)) / 100)
    : Number(phieuGiamGiaDaChuanHoa.discountValue || 0)

  const soTienGiamSauTran = phieuGiamGiaDaChuanHoa.maxDiscountAmount == null
    ? soTienGiamTamTinh
    : Math.min(soTienGiamTamTinh, Number(phieuGiamGiaDaChuanHoa.maxDiscountAmount || 0))

  return Math.min(Math.max(0, soTienGiamSauTran), tongTienHopLe)
}

export const layPhieuGiamGiaDaApDung = () => chuanHoaPhieuGiamGia(layJsonLuuTru(STORAGE_KEYS.PHIEU_GIAM_GIA_DA_AP_DUNG, null))

export const luuPhieuGiamGiaDaApDung = (phieuGiamGia) => {
  const phieuGiamGiaDaChuanHoa = chuanHoaPhieuGiamGia(phieuGiamGia)

  if (!phieuGiamGiaDaChuanHoa) {
    xoaMucLuuTru(STORAGE_KEYS.PHIEU_GIAM_GIA_DA_AP_DUNG)
    return null
  }

  datJsonLuuTru(STORAGE_KEYS.PHIEU_GIAM_GIA_DA_AP_DUNG, phieuGiamGiaDaChuanHoa)
  return phieuGiamGiaDaChuanHoa
}

export const xoaPhieuGiamGiaDaApDung = () => {
  xoaMucLuuTru(STORAGE_KEYS.PHIEU_GIAM_GIA_DA_AP_DUNG)
}
