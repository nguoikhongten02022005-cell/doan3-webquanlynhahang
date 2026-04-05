import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { layThongTinToiApi, dangNhapApi, dangKyApi, dangNhapNoiBoApi, dangXuatApi, capNhatHoSoApi, doiMatKhauApi } from '../services/api/apiXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'
import {
  VAI_TRO_XAC_THUC,
  SU_KIEN_THAY_DOI_NGUOI_DUNG_XAC_THUC,
  xoaPhienXacThuc,
  layMaXacThuc,
  layNguoiDungHienTai,
  luuPhienXacThuc,
  luuNguoiDungHienTai,
} from '../services/dichVuXacThuc'
import {
  TAI_KHOAN_KHACH_HANG_DEMO,
  laMaXacThucDemo,
  laThongTinDangNhapKhachDemo,
  timTaiKhoanNoiBoDemo,
} from '../constants/xacThucDemo'

const layNguoiDungTuDuLieuAuth = (duLieu) => duLieu?.currentUser || duLieu?.user || duLieu || null
const layAccessTokenTuDuLieuAuth = (duLieu) => duLieu?.AccessToken || duLieu?.accessToken || ''

const XacThucContext = createContext(null)

function useXacThucState() {
  const [nguoiDungHienTai, setNguoiDungHienTai] = useState(() => layNguoiDungHienTai())
  const [dangKhoiTaoXacThuc, setIsAuthBootstrapping] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const duongDanHienTai = window.location.pathname || '/'
      const laKhuVucCongKhai = duongDanHienTai === '/' || duongDanHienTai === '/thuc-don' || duongDanHienTai === '/gioi-thieu'
      const maXacThuc = layMaXacThuc()

      if (laKhuVucCongKhai && !maXacThuc) {
        setNguoiDungHienTai(null)
        setIsAuthBootstrapping(false)
        return undefined
      }
    }

    const dongBoNguoiDungHienTai = () => {
      setNguoiDungHienTai(layNguoiDungHienTai())
    }

    const dongBoNguoiDungTuBackend = async () => {
      setIsAuthBootstrapping(true)

      if (!coSuDungMayChu()) {
        dongBoNguoiDungHienTai()
        setIsAuthBootstrapping(false)
        return
      }

      const maXacThuc = layMaXacThuc()

      if (!maXacThuc) {
        setNguoiDungHienTai(null)
        setIsAuthBootstrapping(false)
        return
      }

      if (laMaXacThucDemo(maXacThuc)) {
        dongBoNguoiDungHienTai()
        setIsAuthBootstrapping(false)
        return
      }

      try {
        const { duLieu } = await layThongTinToiApi()
        const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)

        if (nguoiDung) {
          luuNguoiDungHienTai(nguoiDung)
          setNguoiDungHienTai(layNguoiDungHienTai())
        } else {
          xoaPhienXacThuc()
          setNguoiDungHienTai(null)
        }
      } catch {
        xoaPhienXacThuc()
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
    window.addEventListener(SU_KIEN_THAY_DOI_NGUOI_DUNG_XAC_THUC, dongBoNguoiDungHienTai)
    dongBoNguoiDungTuBackend()

    return () => {
      window.removeEventListener('storage', xuLyStorage)
      window.removeEventListener(SU_KIEN_THAY_DOI_NGUOI_DUNG_XAC_THUC, dongBoNguoiDungHienTai)
    }
  }, [])

  const dangNhapBangApi = useCallback(async (hamDangNhap, email, matKhau, thongDiepLoiMacDinh) => {
    if (!coSuDungMayChu()) {
      return {
        success: false,
        error: 'Ứng dụng hiện được cấu hình không dùng backend.',
      }
    }

    try {
      const { duLieu } = await hamDangNhap(email, matKhau)
      const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)
      const accessToken = layAccessTokenTuDuLieuAuth(duLieu)

      if (!nguoiDung || !accessToken) {
        xoaPhienXacThuc()
        return {
          success: false,
          error: thongDiepLoiMacDinh,
        }
      }

      luuPhienXacThuc({
        user: nguoiDung,
        accessToken,
      })

      const nguoiDungDaLuu = layNguoiDungHienTai()
      setNguoiDungHienTai(nguoiDungDaLuu || nguoiDung)

      return {
        success: true,
        user: nguoiDungDaLuu || nguoiDung,
      }
    } catch (error) {
      xoaPhienXacThuc()
      return {
        success: false,
        error: error?.message || thongDiepLoiMacDinh,
      }
    }
  }, [])

  const dangNhap = useCallback(async (identifier, password) => {
    if (coSuDungMayChu()) {
      return dangNhapBangApi(
        dangNhapApi,
          identifier,
          password,
        'Đăng nhập thất bại.',
      )
    }

    if (laThongTinDangNhapKhachDemo(identifier, password)) {
      luuPhienXacThuc({
        user: TAI_KHOAN_KHACH_HANG_DEMO.user,
        accessToken: TAI_KHOAN_KHACH_HANG_DEMO.accessToken,
      })
      setNguoiDungHienTai(TAI_KHOAN_KHACH_HANG_DEMO.user)

      return {
        success: true,
        user: TAI_KHOAN_KHACH_HANG_DEMO.user,
      }
    }

    return {
      success: false,
      error: 'Vui lòng dùng tài khoản demo để minh họa đăng nhập khách hàng.',
    }
  }, [dangNhapBangApi])

  const dangNhapNoiBo = useCallback(async (identifier, password) => {
    if (coSuDungMayChu()) {
      return dangNhapBangApi(
        dangNhapNoiBoApi,
          identifier,
          password,
        'Đăng nhập nội bộ thất bại.',
      )
    }

    const taiKhoanDemo = timTaiKhoanNoiBoDemo(identifier, password)

    if (taiKhoanDemo) {
      luuPhienXacThuc({
        user: taiKhoanDemo.user,
        accessToken: taiKhoanDemo.accessToken,
      })
      setNguoiDungHienTai(taiKhoanDemo.user)

      return {
        success: true,
        user: taiKhoanDemo.user,
      }
    }

    return {
      success: false,
      error: 'Sai tài khoản demo nội bộ. Hãy dùng tài khoản admin hoặc nhân viên được hiển thị trên form đăng nhập.',
    }
  }, [dangNhapBangApi])

  const dangKy = useCallback(async (payload) => {
    if (coSuDungMayChu()) {
      try {
        const { duLieu } = await dangKyApi(payload)
        const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)
        const accessToken = layAccessTokenTuDuLieuAuth(duLieu)

        if (!nguoiDung || !accessToken) {
          xoaPhienXacThuc()
          return {
            success: false,
            error: 'Đăng ký thất bại.',
          }
        }

        luuPhienXacThuc({
          user: nguoiDung,
          accessToken,
        })

        const nguoiDungDaLuu = layNguoiDungHienTai()
        setNguoiDungHienTai(nguoiDungDaLuu || nguoiDung)

        return {
          success: true,
          user: nguoiDungDaLuu || nguoiDung,
        }
      } catch (error) {
        xoaPhienXacThuc()
        return {
          success: false,
          error: error?.message || 'Đăng ký thất bại.',
        }
      }
    }

    return {
      success: false,
      error: 'Đăng ký khách hàng đã được tắt trong chế độ demo.',
    }
  }, [])

  const dangXuat = useCallback(async () => {
    const maXacThuc = layMaXacThuc()

    if (coSuDungMayChu() && !laMaXacThucDemo(maXacThuc)) {
      try {
        await dangXuatApi()
      } catch {
        // no-op
      }
    }

    xoaPhienXacThuc()
    setNguoiDungHienTai(null)
  }, [])

  const capNhatHoSo = useCallback(async (payload) => {
    try {
      const { duLieu } = await capNhatHoSoApi(payload)
      if (!duLieu) {
        return { success: false, error: 'Cập nhật hồ sơ thất bại.' }
      }

      const nguoiDungDangLuu = layNguoiDungHienTai()
      luuNguoiDungHienTai({
        ...nguoiDungDangLuu,
        ...duLieu,
      })

      const nguoiDungDaCapNhat = layNguoiDungHienTai()
      setNguoiDungHienTai(nguoiDungDaCapNhat)

      return { success: true, user: nguoiDungDaCapNhat }
    } catch (error) {
      return { success: false, error: error?.message || 'Cập nhật hồ sơ thất bại.' }
    }
  }, [])

  const capNhatMatKhau = useCallback(async (payload) => {
    try {
      await doiMatKhauApi(payload)
      return { success: true }
    } catch (error) {
      return { success: false, error: error?.message || 'Đổi mật khẩu thất bại.' }
    }
  }, [])

  const vaiTro = nguoiDungHienTai?.role ?? VAI_TRO_XAC_THUC.KHACH_HANG
  const laAdmin = vaiTro === VAI_TRO_XAC_THUC.QUAN_TRI
  const laNhanVien = vaiTro === VAI_TRO_XAC_THUC.NHAN_VIEN
  const coTheVaoNoiBo = laAdmin || laNhanVien

  return useMemo(() => ({
    nguoiDungHienTai,
    vaiTro,
    laAdmin,
    laNhanVien,
    coTheVaoNoiBo,
    daDangNhap: Boolean(nguoiDungHienTai),
    dangKhoiTaoXacThuc: dangKhoiTaoXacThuc,
    dangNhap,
    dangNhapNoiBo,
    dangKy,
    dangXuat,
    capNhatHoSo,
    capNhatMatKhau,
  }), [
    nguoiDungHienTai,
    vaiTro,
    laAdmin,
    laNhanVien,
    coTheVaoNoiBo,
    dangKhoiTaoXacThuc,
    dangNhap,
    dangNhapNoiBo,
    dangKy,
    dangXuat,
    capNhatHoSo,
    capNhatMatKhau,
  ])
}

export function XacThucProvider({ children }) {
  const giaTriXacThuc = useXacThucState()

  return createElement(XacThucContext.Provider, { value: giaTriXacThuc }, children)
}

export const useXacThuc = () => {
  const context = useContext(XacThucContext)

  if (!context) {
    throw new Error('useXacThuc must be used within XacThucProvider')
  }

  return context
}
