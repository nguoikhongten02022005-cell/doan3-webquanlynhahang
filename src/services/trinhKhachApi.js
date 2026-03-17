import { STORAGE_KEYS } from '../constants/khoaLuuTru'
import { xoaPhienXacThuc } from './dichVuXacThuc'
import { layMucLuuTru } from './dichVuLuuTru'

const URL_GOC_API_PHAT_TRIEN_MAC_DINH = 'http://localhost:5011/api'
const DUONG_DAN_DANG_XUAT_XAC_THUC = '/auth/logout'
const DANH_SACH_DUONG_DAN_CONG_KHAI = ['/mon-an', '/ma-giam-gia/validate']

export const coSuDungMayChu = () => String(import.meta.env.VITE_USE_BACKEND || 'false').toLowerCase() === 'true'

export const layUrlGocApi = () => {
  const urlGocDaCauHinh = String(import.meta.env.VITE_API_BASE_URL || '').trim()

  if (urlGocDaCauHinh) {
    return urlGocDaCauHinh
  }

  if (import.meta.env.DEV) {
    return URL_GOC_API_PHAT_TRIEN_MAC_DINH
  }

  throw new Error('Thiếu VITE_API_BASE_URL cho frontend đang bật backend mode.')
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
  const loi = new Error(duLieu?.message || 'API request failed')
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

  if (phanHoi.status === 401 && coTheThuLamMoiPhien(duongDan, tuyChon)) {
    xoaPhienXacThuc()
  }

  throw taoLoiTuPhanHoiApi(phanHoi, duLieu)
}

export const trinhKhachApi = {
  get: (duongDan, tuyChon = {}) => guiYeuCau(duongDan, tuyChon),
  post: (duongDan, noiDung, tuyChon = {}) => guiYeuCau(duongDan, { method: 'POST', body: JSON.stringify(noiDung), ...tuyChon }),
  patch: (duongDan, noiDung, tuyChon = {}) => guiYeuCau(duongDan, { method: 'PATCH', body: JSON.stringify(noiDung), ...tuyChon }),
  delete: (duongDan, tuyChon = {}) => guiYeuCau(duongDan, { method: 'DELETE', ...tuyChon }),
}
