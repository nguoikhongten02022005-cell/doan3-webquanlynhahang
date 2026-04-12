import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaTongQuanDiemTichLuy = (duLieu) => ({
  maKH: String(duLieu?.maKH || duLieu?.MaKH || ''),
  tongDiem: Number(duLieu?.tongDiem || duLieu?.TongDiem || 0),
  diemCoTheDoi: Number(duLieu?.diemCoTheDoi || duLieu?.DiemCoTheDoi || 0),
  tiLeQuyDoi: Number(duLieu?.tiLeQuyDoi || duLieu?.TiLeQuyDoi || 0),
})

const chuanHoaGiaoDichDiem = (giaoDich) => {
  if (!giaoDich || typeof giaoDich !== 'object') return null

  return {
    maGiaoDichDiem: String(giaoDich.maGiaoDichDiem || giaoDich.MaGiaoDichDiem || ''),
    maKH: String(giaoDich.maKH || giaoDich.MaKH || ''),
    maDonHang: String(giaoDich.maDonHang || giaoDich.MaDonHang || ''),
    loaiBienDong: String(giaoDich.loaiBienDong || giaoDich.LoaiBienDong || ''),
    soDiem: Number(giaoDich.soDiem || giaoDich.SoDiem || 0),
    soDiemTruoc: Number(giaoDich.soDiemTruoc || giaoDich.SoDiemTruoc || 0),
    soDiemSau: Number(giaoDich.soDiemSau || giaoDich.SoDiemSau || 0),
    moTa: String(giaoDich.moTa || giaoDich.MoTa || ''),
    ngayTao: giaoDich.ngayTao || giaoDich.NgayTao || '',
  }
}

export const layTongQuanDiemTichLuyApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/loyalty/me'))
  return {
    ...phanHoi,
    duLieu: chuanHoaTongQuanDiemTichLuy(phanHoi.duLieu),
  }
}

export const layLichSuDiemTichLuyApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/loyalty/me/history'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaGiaoDichDiem).filter(Boolean) : [],
  }
}
