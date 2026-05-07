import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaMaGiamGia = (ma) => {
  if (!ma || typeof ma !== 'object') return null
  return {
    ...ma,
    maCode: ma.maCode || ma.MaCode,
    tenCode: ma.tenCode || ma.TenCode,
    giaTri: Number(ma.giaTri ?? ma.GiaTri ?? 0),
    loaiGiam: ma.loaiGiam || ma.LoaiGiam,
    giaTriToiDa: ma.giaTriToiDa != null ? Number(ma.giaTriToiDa) : null,
    donHangToiThieu: Number(ma.donHangToiThieu ?? ma.DonHangToiThieu ?? 0),
    ngayBatDau: ma.ngayBatDau || ma.NgayBatDau,
    ngayKetThuc: ma.ngayKetThuc || ma.NgayKetThuc,
    soLanToiDa: ma.soLanToiDa != null ? Number(ma.soLanToiDa) : null,
    soLanDaDung: Number(ma.soLanDaDung ?? ma.SoLanDaDung ?? 0),
    trangThai: ma.trangThai || ma.TrangThai || 'Active',
  }
}

export const layDanhSachMaGiamGiaApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/ma-giam-gia'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu)
      ? phanHoi.duLieu.map(chuanHoaMaGiamGia).filter(Boolean)
      : [],
  }
}

export const taoMaGiamGiaApi = async (payload) => {
  return tachPhanHoiApi(
    await trinhKhachApi.post('/ma-giam-gia', {
      maCode: payload.maCode,
      tenCode: payload.tenCode,
      giaTri: Number(payload.giaTri),
      loaiGiam: payload.loaiGiam,
      giaTriToiDa: payload.giaTriToiDa != null && payload.giaTriToiDa !== '' ? Number(payload.giaTriToiDa) : null,
      donHangToiThieu: Number(payload.donHangToiThieu || 0),
      ngayBatDau: payload.ngayBatDau,
      ngayKetThuc: payload.ngayKetThuc,
      soLanToiDa: payload.soLanToiDa != null && payload.soLanToiDa !== '' ? Number(payload.soLanToiDa) : null,
      trangThai: payload.trangThai || 'Active',
    }),
  )
}

export const capNhatMaGiamGiaApi = async (maCode, payload) => {
  return tachPhanHoiApi(
    await trinhKhachApi.put(`/ma-giam-gia/${maCode}`, {
      tenCode: payload.tenCode,
      giaTri: Number(payload.giaTri),
      loaiGiam: payload.loaiGiam,
      giaTriToiDa: payload.giaTriToiDa != null && payload.giaTriToiDa !== '' ? Number(payload.giaTriToiDa) : null,
      donHangToiThieu: Number(payload.donHangToiThieu || 0),
      ngayBatDau: payload.ngayBatDau,
      ngayKetThuc: payload.ngayKetThuc,
      soLanToiDa: payload.soLanToiDa != null && payload.soLanToiDa !== '' ? Number(payload.soLanToiDa) : null,
      trangThai: payload.trangThai,
    }),
  )
}

export const xoaMaGiamGiaApi = async (maCode) => {
  return tachPhanHoiApi(await trinhKhachApi.delete(`/ma-giam-gia/${maCode}`))
}