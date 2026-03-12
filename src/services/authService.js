import { STORAGE_KEYS } from '../constants/storageKeys'
import { getStorageItem, getStorageJSON, removeStorageItem, setStorageItem, setStorageJSON } from './storageService'

export const AUTH_USER_CHANGED_EVENT = 'auth:user-changed'
export const AUTH_ROLES = Object.freeze({
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
})

const phatSuKienThayDoiNguoiDung = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(AUTH_USER_CHANGED_EVENT))
}

const chuanHoaVaiTro = (vaiTro) => {
  if (vaiTro === AUTH_ROLES.ADMIN) return AUTH_ROLES.ADMIN
  if (vaiTro === AUTH_ROLES.STAFF) return AUTH_ROLES.STAFF
  return AUTH_ROLES.CUSTOMER
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

export const getCurrentUser = () => chuanHoaNguoiDungHienTai(getStorageJSON(STORAGE_KEYS.CURRENT_USER, null))

export const saveCurrentUser = (nguoiDung) => {
  const nguoiDungHienTai = chuanHoaNguoiDungHienTai(nguoiDung)

  if (!nguoiDungHienTai) {
    return
  }

  setStorageJSON(STORAGE_KEYS.CURRENT_USER, nguoiDungHienTai)
  phatSuKienThayDoiNguoiDung()
}

export const clearCurrentUser = () => {
  removeStorageItem(STORAGE_KEYS.CURRENT_USER)
  phatSuKienThayDoiNguoiDung()
}

export const getAuthToken = () => {
  const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN)
  return typeof token === 'string' && token.trim() ? token : ''
}

export const saveAuthToken = (token) => {
  if (!token || typeof token !== 'string') {
    return
  }

  setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

export const clearAuthToken = () => {
  removeStorageItem(STORAGE_KEYS.AUTH_TOKEN)
}

export const saveAuthSession = ({ user, accessToken }) => {
  saveCurrentUser(user)
  saveAuthToken(accessToken)
}

export const clearAuthSession = () => {
  clearAuthToken()
  clearCurrentUser()
}
