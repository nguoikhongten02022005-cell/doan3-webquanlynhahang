import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaMon = (mon) => {
  if (!mon || typeof mon !== 'object') return null
  return {
    ...mon,
    maMon: mon.maMon || mon.MaMon,
    tenMon: mon.tenMon || mon.TenMon,
    gia: Number(mon.gia ?? mon.Gia ?? 0),
    danhMuc: mon.maDanhMuc || mon.MaDanhMuc || mon.danhMuc || '',
    moTa: mon.moTa || mon.MoTa || '',
    hinhAnh: mon.hinhAnh || mon.HinhAnh || '',
    thoiGianChuanBi: Number(mon.thoiGianChuanBi ?? mon.ThoiGianChuanBi ?? 0),
    trangThai: mon.trangThai || mon.TrangThai || '',
  }
}

export const layDanhSachMonApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/thuc-don'))
  return { ...phanHoi, duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaMon).filter(Boolean) : [] }
}

export const taoMonApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/thuc-don', {
  maMon: payload.maMon || payload.id,
  maDanhMuc: payload.maDanhMuc || payload.danhMuc || '',
  tenMon: payload.tenMon || payload.name || '',
  moTa: payload.moTa || payload.description || '',
  gia: Number(payload.gia || payload.price || 0),
  hinhAnh: payload.hinhAnh || payload.image || '',
  thoiGianChuanBi: Number(payload.thoiGianChuanBi || payload.prepTime || 0),
}))

export const capNhatMonApi = async () => ({ duLieu: null, thongDiep: 'Backend chua ho tro cap nhat mon', meta: null })
export const xoaMonApi = async () => ({ duLieu: null, thongDiep: 'Backend chua ho tro xoa mon', meta: null })
