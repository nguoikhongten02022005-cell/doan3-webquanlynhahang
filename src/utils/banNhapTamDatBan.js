import { layJsonLuuTru, xoaMucLuuTru, datJsonLuuTru } from '../services/dichVuLuuTru'

const THOI_GIAN_HET_HAN_BAN_NHAP_TAM = 1000 * 60 * 60 * 12
const CAC_TRUONG_BAN_NHAP_TAM_DAT_BAN = [
  'guests',
  'date',
  'time',
  'seatingArea',
  'occasion',
  'notes',
  'name',
  'phone',
  'email',
]

const chuanHoaGiaTriBanNhapTam = (giaTri) => String(giaTri ?? '').trim()

const chuanHoaBanNhapTam = (banNhapTam) => {
  if (!banNhapTam || typeof banNhapTam !== 'object') {
    return null
  }

  const thoiDiemCapNhat = typeof banNhapTam.updatedAt === 'string' ? banNhapTam.updatedAt : new Date().toISOString()
  const banNhapTamDaChuanHoa = CAC_TRUONG_BAN_NHAP_TAM_DAT_BAN.reduce((ketQua, truong) => {
    ketQua[truong] = chuanHoaGiaTriBanNhapTam(banNhapTam[truong])
    return ketQua
  }, {})

  return {
    ...banNhapTamDaChuanHoa,
    seatingArea: banNhapTamDaChuanHoa.seatingArea || 'KHONG_UU_TIEN',
    updatedAt: thoiDiemCapNhat,
  }
}

const laBanNhapTamDaHetHan = (banNhapTam) => {
  const dauMocThoiGian = Date.parse(banNhapTam?.updatedAt || '')

  if (Number.isNaN(dauMocThoiGian)) {
    return true
  }

  return (Date.now() - dauMocThoiGian) > THOI_GIAN_HET_HAN_BAN_NHAP_TAM
}

export const layBanNhapTamDatBanHopLe = (khoaLuuTru) => {
  const banNhapTam = chuanHoaBanNhapTam(layJsonLuuTru(khoaLuuTru, null))

  if (!banNhapTam || laBanNhapTamDaHetHan(banNhapTam)) {
    xoaMucLuuTru(khoaLuuTru)
    return null
  }

  return banNhapTam
}

export const luuBanNhapTamDatBan = (khoaLuuTru, duLieuBanNhapTam) => {
  const banNhapTamDaChuanHoa = chuanHoaBanNhapTam({
    ...duLieuBanNhapTam,
    updatedAt: new Date().toISOString(),
  })

  if (!banNhapTamDaChuanHoa) {
    xoaMucLuuTru(khoaLuuTru)
    return null
  }

  datJsonLuuTru(khoaLuuTru, banNhapTamDaChuanHoa)
  return banNhapTamDaChuanHoa
}

export const xoaBanNhapTamDatBan = (khoaLuuTru) => {
  xoaMucLuuTru(khoaLuuTru)
}

export const taoAnhChupBanNhapTamDatBan = (duLieuForm) => ({
  guests: duLieuForm?.guests,
  date: duLieuForm?.date,
  time: duLieuForm?.time,
  seatingArea: duLieuForm?.seatingArea,
  occasion: duLieuForm?.occasion,
  notes: duLieuForm?.notes,
  name: duLieuForm?.name,
  phone: duLieuForm?.phone,
  email: duLieuForm?.email,
})
