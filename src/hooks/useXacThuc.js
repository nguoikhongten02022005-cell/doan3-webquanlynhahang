import { useCallback, useEffect } from 'react'
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
import { useXacThucStore } from '../stores/xacThucStore'

const layNguoiDungTuDuLieuAuth = (duLieu) => duLieu?.currentUser || duLieu?.user || null
const layAccessTokenTuDuLieuAuth = (duLieu) => duLieu?.accessToken || ''

export const useXacThuc = () => {
  const nguoiDungHienTai = useXacThucStore((trangThai) => trangThai.nguoiDungHienTai)
  const dangKhoiTaoXacThuc = useXacThucStore((trangThai) => trangThai.dangKhoiTaoXacThuc)
  const datNguoiDungHienTai = useXacThucStore((trangThai) => trangThai.datNguoiDungHienTai)
  const datDangKhoiTaoXacThuc = useXacThucStore((trangThai) => trangThai.datDangKhoiTaoXacThuc)
  const xoaPhienHienTai = useXacThucStore((trangThai) => trangThai.xoaPhienHienTai)

  useEffect(() => {
    const dongBoNguoiDungHienTai = () => {
      datNguoiDungHienTai(layNguoiDungHienTai())
    }

    const dongBoNguoiDungTuBackend = async () => {
      datDangKhoiTaoXacThuc(true)

      if (!coSuDungMayChu()) {
        dongBoNguoiDungHienTai()
        datDangKhoiTaoXacThuc(false)
        return
      }

      if (!layMaXacThuc()) {
        datNguoiDungHienTai(null)
        datDangKhoiTaoXacThuc(false)
        return
      }

      try {
        const { duLieu } = await layThongTinToiApi()
        const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)

        if (nguoiDung) {
          luuNguoiDungHienTai(nguoiDung)
          datNguoiDungHienTai(layNguoiDungHienTai())
        } else {
          xoaPhienXacThuc()
          xoaPhienHienTai()
        }
      } catch {
        xoaPhienXacThuc()
        xoaPhienHienTai()
      } finally {
        datDangKhoiTaoXacThuc(false)
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
  }, [datDangKhoiTaoXacThuc, datNguoiDungHienTai, xoaPhienHienTai])

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
        xoaPhienHienTai()
        return {
          success: false,
          error: thongDiepLoiMacDinh,
        }
      }

      luuPhienXacThuc({
        user: nguoiDung,
        accessToken,
      })
      datNguoiDungHienTai(layNguoiDungHienTai())

      return {
        success: true,
        user: nguoiDung,
      }
    } catch (error) {
      xoaPhienXacThuc()
      xoaPhienHienTai()
      return {
        success: false,
        error: error?.message || thongDiepLoiMacDinh,
      }
    }
  }, [datNguoiDungHienTai, xoaPhienHienTai])

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
        xoaPhienHienTai()
        return {
          success: false,
          error: 'Đăng ký thất bại.',
        }
      }

      luuPhienXacThuc({
        user: nguoiDung,
        accessToken,
      })
      datNguoiDungHienTai(layNguoiDungHienTai())

      return {
        success: true,
        user: nguoiDung,
      }
    } catch (error) {
      xoaPhienXacThuc()
      xoaPhienHienTai()
      return {
        success: false,
        error: error?.message || 'Đăng ký thất bại.',
      }
    }
  }, [datNguoiDungHienTai, xoaPhienHienTai])

  const dangXuat = useCallback(async () => {
    if (coSuDungMayChu()) {
      try {
        await dangXuatApi()
      } catch {
        // no-op
      }
    }

    xoaPhienXacThuc()
    xoaPhienHienTai()
  }, [xoaPhienHienTai])

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
