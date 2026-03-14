import { useCallback, useEffect, useState } from 'react'
import { getMeApi, internalLoginApi, loginApi, logoutApi, registerApi } from '../services/api/authApi'
import { shouldUseBackend } from '../services/apiClient'
import {
  AUTH_ROLES,
  AUTH_USER_CHANGED_EVENT,
  clearAuthSession,
  getCurrentUser,
  saveAuthSession,
  saveCurrentUser,
} from '../services/authService'

const layNguoiDungTuDuLieuAuth = (duLieu) => duLieu?.currentUser || duLieu?.user || null
const layAccessTokenTuDuLieuAuth = (duLieu) => duLieu?.accessToken || ''

export const useAuth = () => {
  const [nguoiDungHienTai, setNguoiDungHienTai] = useState(() => getCurrentUser())
  const [isAuthBootstrapping, setIsAuthBootstrapping] = useState(true)

  useEffect(() => {
    const dongBoNguoiDungHienTai = () => {
      setNguoiDungHienTai(getCurrentUser())
    }

    const dongBoNguoiDungTuBackend = async () => {
      setIsAuthBootstrapping(true)

      if (!shouldUseBackend()) {
        dongBoNguoiDungHienTai()
        setIsAuthBootstrapping(false)
        return
      }

      try {
        const { duLieu } = await getMeApi()
        const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)

        if (nguoiDung) {
          saveCurrentUser(nguoiDung)
          setNguoiDungHienTai(getCurrentUser())
        } else {
          clearAuthSession()
          setNguoiDungHienTai(null)
        }
      } catch {
        clearAuthSession()
        setNguoiDungHienTai(null)
      } finally {
        setIsAuthBootstrapping(false)
      }
    }

    const xuLyStorage = (event) => {
      if (event.key && event.key !== 'restaurant_current_user') {
        return
      }

      dongBoNguoiDungHienTai()
    }

    window.addEventListener('storage', xuLyStorage)
    window.addEventListener(AUTH_USER_CHANGED_EVENT, dongBoNguoiDungHienTai)
    dongBoNguoiDungTuBackend()

    return () => {
      window.removeEventListener('storage', xuLyStorage)
      window.removeEventListener(AUTH_USER_CHANGED_EVENT, dongBoNguoiDungHienTai)
    }
  }, [])

  const dangNhapBangApi = useCallback(async (hamDangNhap, identifier, password, thongDiepLoiMacDinh) => {
    if (!shouldUseBackend()) {
      return {
        success: false,
        error: 'Ứng dụng hiện được cấu hình không dùng backend.',
      }
    }

    try {
      const { duLieu } = await hamDangNhap(identifier, password)
      const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)
      const accessToken = layAccessTokenTuDuLieuAuth(duLieu)

      if (!nguoiDung || !accessToken) {
        clearAuthSession()
        return {
          success: false,
          error: thongDiepLoiMacDinh,
        }
      }

      saveAuthSession({
        user: nguoiDung,
        accessToken,
      })

      return {
        success: true,
        user: nguoiDung,
      }
    } catch (error) {
      clearAuthSession()
      return {
        success: false,
        error: error?.message || thongDiepLoiMacDinh,
      }
    }
  }, [])

  const login = useCallback((identifier, password) => dangNhapBangApi(
    loginApi,
    identifier,
    password,
    'Đăng nhập thất bại.',
  ), [dangNhapBangApi])

  const internalLogin = useCallback((identifier, password) => dangNhapBangApi(
    internalLoginApi,
    identifier,
    password,
    'Đăng nhập nội bộ thất bại.',
  ), [dangNhapBangApi])

  const register = useCallback(async (payload) => {
    if (!shouldUseBackend()) {
      return {
        success: false,
        error: 'Ứng dụng hiện được cấu hình không dùng backend.',
      }
    }

    try {
      const { duLieu } = await registerApi(payload)
      const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)
      const accessToken = layAccessTokenTuDuLieuAuth(duLieu)

      if (!nguoiDung || !accessToken) {
        clearAuthSession()
        return {
          success: false,
          error: 'Đăng ký thất bại.',
        }
      }

      saveAuthSession({
        user: nguoiDung,
        accessToken,
      })

      return {
        success: true,
        user: nguoiDung,
      }
    } catch (error) {
      clearAuthSession()
      return {
        success: false,
        error: error?.message || 'Đăng ký thất bại.',
      }
    }
  }, [])

  const logout = useCallback(async () => {
    if (shouldUseBackend()) {
      try {
        await logoutApi()
      } catch {
        // no-op
      }
    }

    clearAuthSession()
  }, [])

  const vaiTro = nguoiDungHienTai?.role ?? AUTH_ROLES.CUSTOMER
  const laAdmin = vaiTro === AUTH_ROLES.ADMIN
  const laNhanVien = vaiTro === AUTH_ROLES.STAFF
  const coTheVaoNoiBo = laAdmin || laNhanVien

  return {
    currentUser: nguoiDungHienTai,
    nguoiDungHienTai,
    role: vaiTro,
    vaiTro,
    isAdmin: laAdmin,
    laAdmin,
    isStaff: laNhanVien,
    laNhanVien,
    canAccessInternal: coTheVaoNoiBo,
    coTheVaoNoiBo,
    isAuthenticated: Boolean(nguoiDungHienTai),
    daDangNhap: Boolean(nguoiDungHienTai),
    isAuthBootstrapping,
    login,
    internalLogin,
    register,
    logout,
  }
}
