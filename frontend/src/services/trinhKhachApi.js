import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { layMaXacThuc, xoaPhienXacThuc } from './dichVuXacThuc'
import { layMucLuuTru } from './dichVuLuuTru'

const DUONG_DAN_DANG_XUAT_XAC_THUC = '/auth/logout'

const DANH_SACH_DUONG_DAN_CONG_KHAI = ['/auth/login', '/auth/internal-login', '/auth/register', '/thuc-don', '/ma-giam-gia/validate']

const docCoSuDungMayChuTuEnv = () => {
  const giaTri = String(import.meta.env.VITE_USE_BACKEND ?? '').trim().toLowerCase()

  if (!giaTri) {
    return false
  }

  return giaTri === 'true' || giaTri === '1' || giaTri === 'yes' || giaTri === 'on'
}

export const coSuDungMayChu = () => docCoSuDungMayChuTuEnv()

export const layUrlGocApi = () => {
  const urlGocDaCauHinh = String(import.meta.env.VITE_API_BASE_URL ?? '').trim()

  if (urlGocDaCauHinh) {
    return urlGocDaCauHinh
  }

  throw new Error('Thiếu VITE_API_BASE_URL trong file .env khi frontend bật backend mode.')
}

const layDauTrangXacThuc = () => {
  const maXacThuc = layMucLuuTru(STORAGE_KEYS.MA_XAC_THUC)

  if (!maXacThuc) {
    return {}
  }

  return {
    Authorization: `Bearer ${maXacThuc}`,
  }
}

const laDuongDanCongKhai = (duongDan) => DANH_SACH_DUONG_DAN_CONG_KHAI.some((muc) => duongDan === muc || duongDan.startsWith(`${muc}/`))

const laPhanHoiBao = (phanHoi) => (
  Boolean(phanHoi)
  && typeof phanHoi === 'object'
  && !Array.isArray(phanHoi)
  && ('success' in phanHoi || 'data' in phanHoi || 'message' in phanHoi || 'meta' in phanHoi)
)

export const layDuLieu = (phanHoi) => (laPhanHoiBao(phanHoi) ? (phanHoi.data ?? null) : (phanHoi ?? null))

export const layThongDiep = (phanHoi) => {
  if (!laPhanHoiBao(phanHoi)) {
    return ''
  }

  return typeof phanHoi.message === 'string' ? phanHoi.message : ''
}

export const layMeta = (phanHoi) => (laPhanHoiBao(phanHoi) ? (phanHoi.meta ?? null) : null)

export const tachPhanHoiApi = (phanHoi) => ({
  duLieu: layDuLieu(phanHoi),
  thongDiep: layThongDiep(phanHoi),
  meta: layMeta(phanHoi),
})

const phanTichDuLieuPhanHoi = async (phanHoi) => {
  if (phanHoi.status === 204) {
    return null
  }

  return phanHoi.json().catch(() => null)
}

const taoLoiTuPhanHoiApi = (phanHoi, duLieu) => {
  const loi = new Error(duLieu?.message || 'Yêu cầu tới máy chủ không thành công.')
  loi.status = phanHoi.status
  loi.details = duLieu?.details
  return loi
}

const guiYeuCauTho = async (duongDan, tuyChon = {}) => {
  const {
    headers: dauTrangTuyChinh = {},
    body,
    includeAuthDauTrang = true,
    ...cacTuyChonConLai
  } = tuyChon

  const canDatNoiDungJson = body !== undefined && !(body instanceof FormData)
  const coMaXacThuc = Boolean(layMucLuuTru(STORAGE_KEYS.MA_XAC_THUC))
  const dauTrang = {
    ...((includeAuthDauTrang && (coMaXacThuc || !laDuongDanCongKhai(duongDan))) ? layDauTrangXacThuc() : {}),
    ...(canDatNoiDungJson ? { 'Content-Type': 'application/json' } : {}),
    ...dauTrangTuyChinh,
  }

  const phanHoi = await fetch(`${layUrlGocApi()}${duongDan}`, {
    credentials: 'include',
    headers: dauTrang,
    body,
    ...cacTuyChonConLai,
  })

  const duLieu = await phanTichDuLieuPhanHoi(phanHoi)

  return {
    phanHoi,
    duLieu,
  }
}

const coTheThuLamMoiPhien = (duongDan, tuyChon) => {
  if (!coSuDungMayChu()) {
    return false
  }

  if (tuyChon?.skipAuthRefresh) {
    return false
  }

  return duongDan !== DUONG_DAN_DANG_XUAT_XAC_THUC
}

const guiYeuCau = async (duongDan, tuyChon = {}) => {
  const { phanHoi, duLieu } = await guiYeuCauTho(duongDan, tuyChon)

  if (phanHoi.ok) {
    return duLieu
  }

  if (phanHoi.status === 401 && coTheThuLamMoiPhien(duongDan, tuyChon) && layMaXacThuc()) {
    xoaPhienXacThuc()
  }

  throw taoLoiTuPhanHoiApi(phanHoi, duLieu)
}

export const trinhKhachApi = {
  get: (duongDan, tuyChon = {}) => guiYeuCau(duongDan, tuyChon),
  post: (duongDan, noiDung, tuyChon = {}) => guiYeuCau(duongDan, { method: 'POST', body: noiDung instanceof FormData ? noiDung : JSON.stringify(noiDung), ...tuyChon }),
  put: (duongDan, noiDung, tuyChon = {}) => guiYeuCau(duongDan, { method: 'PUT', body: noiDung instanceof FormData ? noiDung : JSON.stringify(noiDung), ...tuyChon }),
  patch: (duongDan, noiDung, tuyChon = {}) => guiYeuCau(duongDan, { method: 'PATCH', body: noiDung instanceof FormData ? noiDung : JSON.stringify(noiDung), ...tuyChon }),
  delete: (duongDan, tuyChon = {}) => guiYeuCau(duongDan, { method: 'DELETE', ...tuyChon }),
}
