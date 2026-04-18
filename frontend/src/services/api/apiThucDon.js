import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import {
  taoPhanHoiOffline,
  layDanhSachMonOffline,
  capNhatHeThongOffline,
} from '../offline/dichVuOfflineStore'

const chuanHoaUrlAnhMon = (duongDanAnh) => {
  const urlAnh = String(duongDanAnh || '').trim()
  if (!urlAnh) return ''
  if (urlAnh.startsWith('http://') || urlAnh.startsWith('https://') || urlAnh.startsWith('data:')) return urlAnh

  const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim()
  if (!apiBaseUrl) return urlAnh

  const originApi = new URL(apiBaseUrl).origin
  return urlAnh.startsWith('/') ? `${originApi}${urlAnh}` : `${originApi}/${urlAnh}`
}

export const uploadAnhMonApi = async (tapTin) => {
  if (!coSuDungMayChu()) {
    const url = typeof window !== 'undefined' && tapTin ? URL.createObjectURL(tapTin) : ''
    const phanHoi = tachPhanHoiApi(taoPhanHoiOffline({ url }, 'Tai anh mon thanh cong'))
    return {
      ...phanHoi,
      duLieu: {
        ...phanHoi.duLieu,
        url: chuanHoaUrlAnhMon(phanHoi.duLieu?.url),
      },
    }
  }

  const formData = new FormData()
  formData.append('file', tapTin)
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.post('/thuc-don/upload/anh', formData))
  return {
    ...phanHoi,
    duLieu: {
      ...phanHoi.duLieu,
      url: chuanHoaUrlAnhMon(phanHoi.duLieu?.url),
    },
  }
}

const chuanHoaMon = (mon) => {
  if (!mon || typeof mon !== 'object') return null
  return {
    ...mon,
    maMon: mon.maMon || mon.MaMon,
    tenMon: mon.tenMon || mon.TenMon,
    gia: Number(mon.gia ?? mon.Gia ?? 0),
    danhMuc: mon.maDanhMuc || mon.MaDanhMuc || mon.danhMuc || '',
    moTa: mon.moTa || mon.MoTa || '',
    hinhAnh: chuanHoaUrlAnhMon(mon.hinhAnh || mon.HinhAnh || ''),
    thoiGianChuanBi: Number(mon.thoiGianChuanBi ?? mon.ThoiGianChuanBi ?? 0),
    trangThai: mon.trangThai || mon.TrangThai || '',
  }
}

export const layDanhSachMonApi = async () => {
  if (!coSuDungMayChu()) {
    const duLieu = layDanhSachMonOffline().map(chuanHoaMon).filter(Boolean)
    return { ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay danh sach mon thanh cong')), duLieu }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/thuc-don'))
  return { ...phanHoi, duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaMon).filter(Boolean) : [] }
}

export const taoMonApi = async (payload) => {
  if (!coSuDungMayChu()) {
    let duLieu = null
    capNhatHeThongOffline((draft) => {
      const maMon = payload.maMon || payload.id || `M${String(draft.thucDon.length + 1).padStart(3, '0')}`
      duLieu = {
        maMon,
        MaMon: maMon,
        maDanhMuc: payload.maDanhMuc || payload.danhMuc || '',
        MaDanhMuc: payload.maDanhMuc || payload.danhMuc || '',
        tenMon: payload.tenMon || payload.name || '',
        TenMon: payload.tenMon || payload.name || '',
        moTa: payload.moTa || payload.description || '',
        MoTa: payload.moTa || payload.description || '',
        gia: Number(payload.gia || payload.price || 0),
        Gia: Number(payload.gia || payload.price || 0),
        hinhAnh: payload.hinhAnh || payload.image || '',
        HinhAnh: payload.hinhAnh || payload.image || '',
        thoiGianChuanBi: Number(payload.thoiGianChuanBi || payload.prepTime || 0),
        ThoiGianChuanBi: Number(payload.thoiGianChuanBi || payload.prepTime || 0),
        trangThai: 'Available',
        TrangThai: 'Available',
      }
      draft.thucDon.push(duLieu)
    })

    return tachPhanHoiApi(taoPhanHoiOffline(chuanHoaMon(duLieu), 'Tao mon thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.post('/thuc-don', {
    maMon: payload.maMon || payload.id,
    maDanhMuc: payload.maDanhMuc || payload.danhMuc || '',
    tenMon: payload.tenMon || payload.name || '',
    moTa: payload.moTa || payload.description || '',
    gia: Number(payload.gia || payload.price || 0),
    hinhAnh: payload.hinhAnh || payload.image || '',
    thoiGianChuanBi: Number(payload.thoiGianChuanBi || payload.prepTime || 0),
  }))
}

export const capNhatMonApi = async (maMon, payload) => {
  if (!coSuDungMayChu()) {
    let duLieu = null
    capNhatHeThongOffline((draft) => {
      const mon = draft.thucDon.find((item) => String(item.maMon || item.MaMon) === String(maMon || ''))
      if (!mon) {
        throw new Error('Không tìm thấy món ăn.')
      }

      mon.maDanhMuc = payload.maDanhMuc || payload.danhMuc || mon.maDanhMuc
      mon.MaDanhMuc = mon.maDanhMuc
      mon.tenMon = payload.tenMon || payload.name || mon.tenMon
      mon.TenMon = mon.tenMon
      mon.moTa = payload.moTa || payload.description || mon.moTa
      mon.MoTa = mon.moTa
      mon.gia = Number(payload.gia || payload.price || mon.gia || 0)
      mon.Gia = mon.gia
      mon.hinhAnh = payload.hinhAnh || payload.image || mon.hinhAnh || ''
      mon.HinhAnh = mon.hinhAnh
      mon.thoiGianChuanBi = Number(payload.thoiGianChuanBi || payload.prepTime || mon.thoiGianChuanBi || 0)
      mon.ThoiGianChuanBi = mon.thoiGianChuanBi
      mon.trangThai = payload.trangThai || (payload.isVisible === false ? 'Unavailable' : 'Available')
      mon.TrangThai = mon.trangThai
      duLieu = mon
    })

    return tachPhanHoiApi(taoPhanHoiOffline(chuanHoaMon(duLieu), 'Cap nhat mon thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.put(`/thuc-don/${maMon}`, {
    maDanhMuc: payload.maDanhMuc || payload.danhMuc || '',
    tenMon: payload.tenMon || payload.name || '',
    moTa: payload.moTa || payload.description || '',
    gia: Number(payload.gia || payload.price || 0),
    hinhAnh: payload.hinhAnh || payload.image || '',
    thoiGianChuanBi: Number(payload.thoiGianChuanBi || payload.prepTime || 0),
    trangThai: payload.trangThai || (payload.isVisible === false ? 'Unavailable' : 'Available'),
  }))
}

export const xoaMonApi = async (maMon) => {
  if (!coSuDungMayChu()) {
    capNhatHeThongOffline((draft) => {
      draft.thucDon = draft.thucDon.filter((item) => String(item.maMon || item.MaMon) !== String(maMon || ''))
    })
    return tachPhanHoiApi(taoPhanHoiOffline({}, 'Xoa mon thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.delete(`/thuc-don/${maMon}`))
}
