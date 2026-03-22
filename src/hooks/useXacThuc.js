import { useCallback, useEffect, useState } from 'react'
import { layThongTinToiApi, dangNhapNoiBoApi, dangNhapApi, dangXuatApi, dangKyApi } from '../services/api/apiXacThuc'
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

const layNguoiDungTuDuLieuAuth = (duLieu) => duLieu?.currentUser || duLieu?.user || null
const layAccessTokenTuDuLieuAuth = (duLieu) => duLieu?.accessToken || ''

export const useXacThuc = () => {
  const [nguoiDungHienTai, setNguoiDungHienTai] = useState(() => layNguoiDungHienTai())
  const [dangKhoiTaoXacThuc, setIsAuthBootstrapping] = useState(true)

  useEffect(() => {
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

      if (!layMaXacThuc()) {
        setNguoiDungHienTai(null)
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

  const dangNhapBangApi = useCallback(async (hamDangNhap, identifier, password, thongDiepLoiMacDinh) => {
    if (!coSuDungMayChu()) {
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

      return {
        success: true,
        user: nguoiDung,
      }
    } catch (error) {
      xoaPhienXacThuc()
      return {
        success: false,
        error: error?.message || thongDiepLoiMacDinh,
      }
    }
  }, [])

  const dangNhap = useCallback((identifier, password) => dangNhapBangApi(
    dangNhapApi,
    identifier,
    password,
    'Đăng nhập thất bại.',
  ), [dangNhapBangApi])

  const dangNhapNoiBo = useCallback((identifier, password) => dangNhapBangApi(
    dangNhapNoiBoApi,
    identifier,
    password,
    'Đăng nhập nội bộ thất bại.',
  ), [dangNhapBangApi])

  const dangKy = useCallback(async (payload) => {
    if (!coSuDungMayChu()) {
      return {
        success: false,
        error: 'Ứng dụng hiện được cấu hình không dùng backend.',
      }
    }

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

      return {
        success: true,
        user: nguoiDung,
      }
    } catch (error) {
      xoaPhienXacThuc()
      return {
        success: false,
        error: error?.message || 'Đăng ký thất bại.',
      }
    }
  }, [])

  const dangXuat = useCallback(async () => {
    if (coSuDungMayChu()) {
      try {
        await dangXuatApi()
      } catch {
        // no-op
      }
    }

    xoaPhienXacThuc()
  }, [])

  const vaiTro = nguoiDungHienTai?.role ?? VAI_TRO_XAC_THUC.KHACH_HANG
  const laAdmin = vaiTro === VAI_TRO_XAC_THUC.QUAN_TRI
  const laNhanVien = vaiTro === VAI_TRO_XAC_THUC.NHAN_VIEN
  const coTheVaoNoiBo = laAdmin || laNhanVien

  return {
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
  }
}
