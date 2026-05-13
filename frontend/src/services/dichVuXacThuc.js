import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layJsonLuuTru, xoaMucLuuTru, datJsonLuuTru } from './dichVuLuuTru'

let maXacThucTrongBoNho = ''

export const SU_KIEN_THAY_DOI_NGUOI_DUNG_XAC_THUC = 'auth:user-changed'
export const VAI_TRO_XAC_THUC = Object.freeze({
  KHACH_HANG: 'KhachHang',
  NHAN_VIEN: 'NhanVien',
  QUAN_TRI: 'Admin',
})

const phatSuKienThayDoiNguoiDung = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(SU_KIEN_THAY_DOI_NGUOI_DUNG_XAC_THUC))
}

const chuanHoaVaiTro = (vaiTro) => {
  if (vaiTro === 'Admin' || vaiTro === 'admin') return VAI_TRO_XAC_THUC.QUAN_TRI
  if (vaiTro === 'NhanVien' || vaiTro === 'staff') return VAI_TRO_XAC_THUC.NHAN_VIEN
  if (vaiTro === 'KhachHang' || vaiTro === 'customer') return VAI_TRO_XAC_THUC.KHACH_HANG
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
    maND: String(nguoiDung.maND ?? nguoiDung.MaND ?? '').trim(),
    maKH: String(nguoiDung.maKH ?? nguoiDung.MaKH ?? '').trim(),
    fullName: String(nguoiDung.fullName ?? nguoiDung.tenND ?? nguoiDung.TenND ?? nguoiDung.tenKH ?? nguoiDung.TenKH ?? nguoiDung.name ?? '').trim(),
    username: String(nguoiDung.username ?? nguoiDung.maND ?? nguoiDung.MaND ?? '').trim(),
    email: String(nguoiDung.email ?? '').trim(),
    phone: String(nguoiDung.phone ?? nguoiDung.sdt ?? nguoiDung.SDT ?? '').trim(),
    role: chuanHoaVaiTro(nguoiDung.role ?? nguoiDung.vaiTro ?? nguoiDung.VaiTro),
  }
}

const chuanHoaNguoiDungHienTai = (nguoiDung) => {
  const nguoiDungDaChuanHoa = chuanHoaNguoiDung(nguoiDung)

  if (!nguoiDungDaChuanHoa) {
    return null
  }

  return {
    fullName: nguoiDungDaChuanHoa.fullName,
    id: nguoiDungDaChuanHoa.id ?? nguoiDungDaChuanHoa.maND ?? null,
    maND: nguoiDungDaChuanHoa.maND ?? '',
    maKH: nguoiDungDaChuanHoa.maKH ?? '',
    username: nguoiDungDaChuanHoa.username,
    email: nguoiDungDaChuanHoa.email,
    phone: nguoiDungDaChuanHoa.phone,
    role: nguoiDungDaChuanHoa.role,
  }
}

export const layNguoiDungHienTai = () => chuanHoaNguoiDungHienTai(layJsonLuuTru(STORAGE_KEYS.NGUOI_DUNG_HIEN_TAI, null))

export const luuNguoiDungHienTai = (nguoiDung) => {
  const nguoiDungHienTai = chuanHoaNguoiDungHienTai(nguoiDung)

  if (!nguoiDungHienTai) {
    return
  }

  datJsonLuuTru(STORAGE_KEYS.NGUOI_DUNG_HIEN_TAI, nguoiDungHienTai)
  phatSuKienThayDoiNguoiDung()
}

export const xoaNguoiDungHienTai = () => {
  xoaMucLuuTru(STORAGE_KEYS.NGUOI_DUNG_HIEN_TAI)
  phatSuKienThayDoiNguoiDung()
}

export const layMaXacThuc = () => maXacThucTrongBoNho

export const luuMaXacThuc = (token) => {
  if (!token || typeof token !== 'string') {
    maXacThucTrongBoNho = ''
    return
  }

  maXacThucTrongBoNho = token.trim()
}

export const xoaMaXacThuc = () => {
  maXacThucTrongBoNho = ''
}

export const luuPhienXacThuc = ({ user, accessToken, refreshToken }) => {
  luuNguoiDungHienTai(user)
  luuXacThuc(accessToken, refreshToken)
}

export const xoaPhienXacThuc = () => {
  xoaMaXacThuc()
  xoaRefreshToken()
  xoaNguoiDungHienTai()
}

export const xoaRefreshToken = () => {}

export const luuXacThuc = (accessToken) => {
  luuMaXacThuc(accessToken)
}
