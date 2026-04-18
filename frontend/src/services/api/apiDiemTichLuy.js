import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import { layNguoiDungHienTai } from '../dichVuXacThuc'
import {
  taoPhanHoiOffline,
  layTongQuanDiemTheoKhachHangOffline,
  layLichSuDiemTheoKhachHangOffline,
} from '../offline/dichVuOfflineStore'

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
  if (!coSuDungMayChu()) {
    const maKH = layNguoiDungHienTai()?.maKH || ''
    const duLieu = chuanHoaTongQuanDiemTichLuy(layTongQuanDiemTheoKhachHangOffline(maKH))
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay tong quan diem thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/diem-tich-luy/me'))
  return {
    ...phanHoi,
    duLieu: chuanHoaTongQuanDiemTichLuy(phanHoi.duLieu),
  }
}

export const layLichSuDiemTichLuyApi = async () => {
  if (!coSuDungMayChu()) {
    const maKH = layNguoiDungHienTai()?.maKH || ''
    const duLieu = layLichSuDiemTheoKhachHangOffline(maKH).map(chuanHoaGiaoDichDiem).filter(Boolean)
    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay lich su diem thanh cong')),
      duLieu,
    }
  }

  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/diem-tich-luy/me/history'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaGiaoDichDiem).filter(Boolean) : [],
  }
}
