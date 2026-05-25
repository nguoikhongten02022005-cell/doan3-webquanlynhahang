import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  layThongTinToiApi,
  dangNhapApi,
  dangKyApi,
  dangNhapNoiBoApi,
  dangXuatApi,
  capNhatHoSoApi,
  doiMatKhauApi,
  chuanHoaNguoiDungApi,
} from '../services/api/apiXacThuc'
import { coSuDungMayChu } from '../services/trinhKhachApi'
import {
  PHAM_VI_XAC_THUC,
  VAI_TRO_XAC_THUC,
  SU_KIEN_THAY_DOI_NGUOI_DUNG_XAC_THUC,
  datPhamViXacThuc,
  xoaPhienXacThuc,
  layNguoiDungHienTai,
  luuPhienXacThuc,
  luuNguoiDungHienTai,
} from '../services/dichVuXacThuc'

const layNguoiDungTuDuLieuAuth = (duLieu) => duLieu?.currentUser || duLieu?.user || duLieu || null
const layAccessTokenTuDuLieuAuth = (duLieu) => duLieu?.AccessToken || duLieu?.accessToken || ''
const layRefreshTokenTuDuLieuAuth = (duLieu) => duLieu?.RefreshToken || duLieu?.refreshToken || ''
const layPhamViTheoDuongDan = () => (typeof window !== 'undefined' && (window.location.pathname || '').startsWith('/noi-bo') ? PHAM_VI_XAC_THUC.NOI_BO : PHAM_VI_XAC_THUC.KHACH_HANG)
const layNguoiDungTheoPhien = () => layNguoiDungHienTai(layPhamViTheoDuongDan())
const coCanKhoiTaoXacThuc = () => true
const taoPayloadCoMaND = (nguoiDung, payload = {}) => ({
  ...payload,
  maND: payload.maND || nguoiDung?.maND || nguoiDung?.id || '',
  id: payload.id || nguoiDung?.id || nguoiDung?.maND || '',
})

const XacThucContext = createContext(null)

const apDungPhienXacThuc = ({ duLieu, thongDiepLoiMacDinh, setNguoiDungHienTai, phamVi }) => {
  const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)
  const accessToken = layAccessTokenTuDuLieuAuth(duLieu)
  const refreshToken = layRefreshTokenTuDuLieuAuth(duLieu)

  if (!nguoiDung || !accessToken) {
    xoaPhienXacThuc(phamVi)
    return {
      success: false,
      error: thongDiepLoiMacDinh,
    }
  }

  luuPhienXacThuc({
    user: nguoiDung,
    accessToken,
    refreshToken,
    phamVi,
  })

  const nguoiDungDaLuu = layNguoiDungHienTai(phamVi)
  setNguoiDungHienTai(nguoiDungDaLuu || nguoiDung)

  return {
    success: true,
    user: nguoiDungDaLuu || nguoiDung,
  }
}

function useXacThucState() {
  const [nguoiDungHienTai, setNguoiDungHienTai] = useState(layNguoiDungTheoPhien)
  const [dangKhoiTaoXacThuc, setIsAuthBootstrapping] = useState(coCanKhoiTaoXacThuc)
  const daKhoiTaoXacThucRef = useRef(false)

  useEffect(() => {
    if (daKhoiTaoXacThucRef.current) {
      return undefined
    }
    daKhoiTaoXacThucRef.current = true

    const phamVi = layPhamViTheoDuongDan()
    datPhamViXacThuc(phamVi)

    if (typeof window !== 'undefined') {
      const duongDanHienTai = window.location.pathname || '/'
      const laKhuVucCongKhai = duongDanHienTai === '/' || duongDanHienTai === '/thuc-don' || duongDanHienTai === '/gioi-thieu'

      if (laKhuVucCongKhai) {
        setNguoiDungHienTai(null)
        setIsAuthBootstrapping(false)
        return undefined
      }
    }

    const dongBoNguoiDungHienTai = () => {
      setNguoiDungHienTai(layNguoiDungTheoPhien())
    }

    const dongBoNguoiDungTuBackend = async () => {
      setIsAuthBootstrapping(true)

      if (!coSuDungMayChu()) {
        dongBoNguoiDungHienTai()
        setIsAuthBootstrapping(false)
        return
      }

      if (!layNguoiDungHienTai(phamVi)?.maND) {
        xoaPhienXacThuc(phamVi)
        setNguoiDungHienTai(null)
        setIsAuthBootstrapping(false)
        return
      }

      try {
        const { duLieu } = await layThongTinToiApi()
        const nguoiDung = layNguoiDungTuDuLieuAuth(duLieu)

        if (nguoiDung) {
          luuNguoiDungHienTai(nguoiDung, phamVi)
          setNguoiDungHienTai(layNguoiDungHienTai(phamVi))
        } else {
          xoaPhienXacThuc(phamVi)
          setNguoiDungHienTai(null)
        }
      } catch {
        xoaPhienXacThuc(phamVi)
        setNguoiDungHienTai(null)
      } finally {
        setIsAuthBootstrapping(false)
      }
    }

    const xuLyStorage = (event) => {
      if (event.key && !event.key.includes('current_user')) {
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

  const dangNhapBangApi = useCallback(async (hamDangNhap, email, matKhau, thongDiepLoiMacDinh, phamVi) => {
    try {
      const { duLieu } = await hamDangNhap(email, matKhau)
      return apDungPhienXacThuc({ duLieu, thongDiepLoiMacDinh, setNguoiDungHienTai, phamVi })
    } catch (error) {
      xoaPhienXacThuc(phamVi)
      return {
        success: false,
        error: error?.message || thongDiepLoiMacDinh,
      }
    }
  }, [])

  const dangNhap = useCallback(async (identifier, password) => {
    return dangNhapBangApi(
      dangNhapApi,
      identifier,
      password,
      'Đăng nhập thất bại.',
      PHAM_VI_XAC_THUC.KHACH_HANG,
    )
  }, [dangNhapBangApi])

  const dangNhapNoiBo = useCallback(async (identifier, password) => {
    return dangNhapBangApi(
      dangNhapNoiBoApi,
      identifier,
      password,
      'Đăng nhập nội bộ thất bại.',
      PHAM_VI_XAC_THUC.NOI_BO,
    )
  }, [dangNhapBangApi])

  const dangKy = useCallback(async (payload) => {
    try {
      const { duLieu } = await dangKyApi(payload)
      return apDungPhienXacThuc({ duLieu, thongDiepLoiMacDinh: 'Đăng ký thất bại.', setNguoiDungHienTai, phamVi: PHAM_VI_XAC_THUC.KHACH_HANG })
    } catch (error) {
      xoaPhienXacThuc(PHAM_VI_XAC_THUC.KHACH_HANG)
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

    xoaPhienXacThuc(layPhamViTheoDuongDan())
    setNguoiDungHienTai(null)
  }, [])

  const capNhatHoSo = useCallback(async (payload) => {
    try {
      const phamVi = layPhamViTheoDuongDan()
      const nguoiDungDangLuu = layNguoiDungHienTai(phamVi)
      const { duLieu } = await capNhatHoSoApi(taoPayloadCoMaND(nguoiDungDangLuu, payload))
      if (!duLieu) {
        return { success: false, error: 'Cập nhật hồ sơ thất bại.' }
      }

      const nguoiDungTuApi = chuanHoaNguoiDungApi(duLieu)
      luuNguoiDungHienTai({
        ...nguoiDungDangLuu,
        ...nguoiDungTuApi,
      }, phamVi)

      const nguoiDungDaCapNhat = layNguoiDungHienTai(phamVi)
      setNguoiDungHienTai(nguoiDungDaCapNhat)

      return { success: true, user: nguoiDungDaCapNhat }
    } catch (error) {
      return { success: false, error: error?.message || 'Cập nhật hồ sơ thất bại.' }
    }
  }, [])

  const capNhatMatKhau = useCallback(async (payload) => {
    try {
      const nguoiDungDangLuu = layNguoiDungHienTai(layPhamViTheoDuongDan())
      await doiMatKhauApi(taoPayloadCoMaND(nguoiDungDangLuu, payload))
      return { success: true }
    } catch (error) {
      return { success: false, error: error?.message || 'Đổi mật khẩu thất bại.' }
    }
  }, [])

  const vaiTro = nguoiDungHienTai?.role ?? VAI_TRO_XAC_THUC.KHACH_HANG
  const laQuanLy = vaiTro === VAI_TRO_XAC_THUC.QUAN_TRI
  const laNhanVien = vaiTro === VAI_TRO_XAC_THUC.NHAN_VIEN
  const coTheVaoNoiBo = laQuanLy || laNhanVien

  return useMemo(() => ({
    nguoiDungHienTai,
    vaiTro,
    laQuanLy,
    laNhanVien,
    coTheVaoNoiBo,
    daDangNhap: Boolean(nguoiDungHienTai),
    dangKhoiTaoXacThuc,
    dangNhap,
    dangNhapNoiBo,
    dangKy,
    dangXuat,
    capNhatHoSo,
    capNhatMatKhau,
  }), [
    nguoiDungHienTai,
    vaiTro,
    laQuanLy,
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
