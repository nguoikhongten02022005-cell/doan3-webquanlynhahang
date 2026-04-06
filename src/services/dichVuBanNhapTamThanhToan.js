import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layJsonLuuTru, xoaMucLuuTru, datJsonLuuTru } from './dichVuLuuTru'

const chuanHoaBanNhapTamThanhToan = (banNhapTam) => {
  if (!banNhapTam || typeof banNhapTam !== 'object') {
    return null
  }

  return {
    note: String(banNhapTam.note ?? ''),
    tableNumber: String(banNhapTam.tableNumber ?? ''),
  }
}

export const layBanNhapTamThanhToan = () => chuanHoaBanNhapTamThanhToan(layJsonLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_THANH_TOAN, null))

export const luuBanNhapTamThanhToan = (banNhapTam) => {
  const banNhapTamDaChuanHoa = chuanHoaBanNhapTamThanhToan(banNhapTam)

  if (!banNhapTamDaChuanHoa) {
    xoaMucLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_THANH_TOAN)
    return null
  }

  datJsonLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_THANH_TOAN, banNhapTamDaChuanHoa)
  return banNhapTamDaChuanHoa
}

export const xoaBanNhapTamThanhToan = () => {
  xoaMucLuuTru(STORAGE_KEYS.BAN_NHAP_TAM_THANH_TOAN)
}
