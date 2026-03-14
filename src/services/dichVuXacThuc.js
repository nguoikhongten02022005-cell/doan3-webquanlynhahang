import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layMucLuuTru, layJsonLuuTru, xoaMucLuuTru, datMucLuuTru, datJsonLuuTru } from './dichVuLuuTru'

export const SU_KIEN_THAY_DOI_NGUOI_DUNG_XAC_THUC = 'auth:user-changed'
export const VAI_TRO_XAC_THUC = Object.freeze({
  KHACH_HANG: 'customer',
  NHAN_VIEN: 'staff',
  QUAN_TRI: 'admin',
})

const phatSuKienThayDoiNguoiDung = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(SU_KIEN_THAY_DOI_NGUOI_DUNG_XAC_THUC))
}

const chuanHoaVaiTro = (vaiTro) => {
  if (vaiTro === VAI_TRO_XAC_THUC.QUAN_TRI) return VAI_TRO_XAC_THUC.QUAN_TRI
  if (vaiTro === VAI_TRO_XAC_THUC.NHAN_VIEN) return VAI_TRO_XAC_THUC.NHAN_VIEN
  return VAI_TRO_XAC_THUC.KHACH_HANG
}

const chuanHoaNguoiDung = (nguoiDung) => {
  if (!nguoiDung || typeof nguoiDung !== 'object') {
    return null
  }

  return {
    ...nguoiDung,
    fullName: String(nguoiDung.fullName ?? nguoiDung.name ?? '').trim(),
    username: String(nguoiDung.username ?? '').trim(),
    email: String(nguoiDung.email ?? '').trim(),
    phone: String(nguoiDung.phone ?? '').trim(),
    role: chuanHoaVaiTro(nguoiDung.role),
  }
}

const chuanHoaNguoiDungHienTai = (nguoiDung) => {
  const nguoiDungDaChuanHoa = chuanHoaNguoiDung(nguoiDung)

  if (!nguoiDungDaChuanHoa) {
    return null
  }

  return {
    fullName: nguoiDungDaChuanHoa.fullName,
    username: nguoiDungDaChuanHoa.username,
    email: nguoiDungDaChuanHoa.email,
    phone: nguoiDungDaChuanHoa.phone,
    role: nguoiDungDaChuanHoa.role,
  }
}

export const layNguoiDungHienTai = () => chuanHoaNguoiDungHienTai(layJsonLuuTru(STORAGE_KEYS.CURRENT_USER, null))

export const luuNguoiDungHienTai = (nguoiDung) => {
  const nguoiDungHienTai = chuanHoaNguoiDungHienTai(nguoiDung)

  if (!nguoiDungHienTai) {
    return
  }

  datJsonLuuTru(STORAGE_KEYS.CURRENT_USER, nguoiDungHienTai)
  phatSuKienThayDoiNguoiDung()
}

export const xoaNguoiDungHienTai = () => {
  xoaMucLuuTru(STORAGE_KEYS.CURRENT_USER)
  phatSuKienThayDoiNguoiDung()
}

export const layMaXacThuc = () => {
  const maXacThuc = layMucLuuTru(STORAGE_KEYS.AUTH_TOKEN)
  return typeof maXacThuc === 'string' && maXacThuc.trim() ? maXacThuc : ''
}

export const luuMaXacThuc = (token) => {
  if (!token || typeof token !== 'string') {
    return
  }

  datMucLuuTru(STORAGE_KEYS.AUTH_TOKEN, token)
}

export const xoaMaXacThuc = () => {
  xoaMucLuuTru(STORAGE_KEYS.AUTH_TOKEN)
}

export const luuPhienXacThuc = ({ user, accessToken }) => {
  luuNguoiDungHienTai(user)
  luuMaXacThuc(accessToken)
}

export const xoaPhienXacThuc = () => {
  xoaMaXacThuc()
  xoaNguoiDungHienTai()
}
