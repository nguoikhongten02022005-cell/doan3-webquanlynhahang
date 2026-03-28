import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaDanhGia = (review) => {
  if (!review || typeof review !== 'object') return null
  return {
    ...review,
    maDanhGia: review.maDanhGia || review.MaDanhGia || '',
    maKH: review.maKH || review.MaKH || '',
    maDonHang: review.maDonHang || review.MaDonHang || '',
    soSao: Number(review.soSao ?? review.SoSao ?? 0),
    noiDung: review.noiDung || review.NoiDung || '',
    phanHoi: review.phanHoi || review.PhanHoi || '',
    trangThai: review.trangThai || review.TrangThai || '',
    ngayDanhGia: review.ngayDanhGia || review.NgayDanhGia || '',
  }
}

export const layDanhSachDanhGiaApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/danh-gia'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDanhGia).filter(Boolean) : [],
  }
}

export const taoDanhGiaApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/danh-gia', payload))
