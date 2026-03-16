import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaBanAn = (ban) => {
  if (!ban || typeof ban !== 'object') {
    return null
  }

  return {
    ...ban,
    code: ban.maBan,
    name: ban.tenBan,
    areaId: ban.khuVucId,
    capacity: Number(ban.sucChua) || 0,
    activeBookingId: ban.datBanHienTaiId,
    activeBookingCode: ban.maDatBanHienTai,
    note: ban.ghiChu,
  }
}

export const layDanhSachBanApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/ban-an'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaBanAn).filter(Boolean) : [],
  }
}

export const capNhatTrangThaiBanApi = async (id, status) => tachPhanHoiApi(await trinhKhachApi.patch(`/ban-an/${id}/status`, { trangThai: status }))
