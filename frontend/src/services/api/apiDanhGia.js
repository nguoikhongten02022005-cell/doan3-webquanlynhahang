import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import {
  taoPhanHoiOffline,
  layDanhSachDanhGiaOffline,
  taoHoacCapNhatDanhGiaOffline,
  timDanhGiaOfflineTheoMa,
} from '../offline/dichVuOfflineStore'

const chuanHoaDanhGia = (review) => {
  if (!review || typeof review !== 'object') return null
  const hinhAnhGoc = review.hinhAnh || review.HinhAnh || review.images || review.Images || []
  const hinhAnh = Array.isArray(hinhAnhGoc)
    ? hinhAnhGoc.filter(Boolean).map((item) => String(item))
    : (() => {
        const chuoi = String(hinhAnhGoc || '').trim()
        if (!chuoi) return []
        try {
          const phanTich = JSON.parse(chuoi)
          return Array.isArray(phanTich) ? phanTich.filter(Boolean).map((item) => String(item)) : [chuoi]
        } catch {
          return [chuoi]
        }
      })()

  return {
    ...review,
    maDanhGia: review.maDanhGia || review.MaDanhGia || '',
    maKH: review.maKH || review.MaKH || '',
    maDonHang: review.maDonHang || review.MaDonHang || '',
    tenKhachHang: review.tenKhachHang || review.TenKhachHang || '',
    email: review.email || review.Email || '',
    soSao: Number(review.soSao ?? review.SoSao ?? 0),
    noiDung: review.noiDung || review.NoiDung || '',
    phanHoi: review.phanHoi || review.PhanHoi || '',
    hinhAnh,
    soLuotHuuIch: Number(review.soLuotHuuIch ?? review.SoLuotHuuIch ?? 0),
    trangThai: review.trangThai || review.TrangThai || '',
    ngayDanhGia: review.ngayDanhGia || review.NgayDanhGia || '',
  }
}

export const layDanhSachDanhGiaApi = async () => {
  if (!coSuDungMayChu()) {
    const duLieu = layDanhSachDanhGiaOffline().map(chuanHoaDanhGia).filter(Boolean)
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay danh sach danh gia thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/danh-gia'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDanhGia).filter(Boolean) : [],
  }
}

export const taoDanhGiaApi = async (payload) => {
  if (!coSuDungMayChu()) {
    return tachPhanHoiApi(taoPhanHoiOffline(taoHoacCapNhatDanhGiaOffline(payload), 'Tao danh gia thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.post('/danh-gia', payload))
}

export const duyetDanhGiaApi = async (maDanhGia, payload) => {
  if (!coSuDungMayChu()) {
    const duLieu = taoHoacCapNhatDanhGiaOffline({
      ...(timDanhGiaOfflineTheoMa(maDanhGia) || {}),
      trangThai: payload.trangThai,
      phanHoi: payload.phanHoi || '',
    }, { maDanhGia })

    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Duyet danh gia thanh cong')),
      duLieu: chuanHoaDanhGia(duLieu),
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.patch(`/danh-gia/${maDanhGia}/duyet`, payload))
  return {
    ...phanHoi,
    duLieu: chuanHoaDanhGia(phanHoi.duLieu),
  }
}
