import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaBanAn = (ban) => {
  if (!ban || typeof ban !== 'object') {
    return null
  }

  return {
    ...ban,
    code: ban.maBan || ban.MaBan,
    name: `Bàn ${ban.soBan ?? ban.SoBan ?? ''}`.trim(),
    tableNumber: Number(ban.soBan ?? ban.SoBan ?? 0),
    capacity: Number(ban.soChoNgoi ?? ban.SoChoNgoi ?? 0),
    areaId: ban.viTri || ban.ViTri || '',
    note: ban.viTri || ban.ViTri || '',
    status: ban.trangThai || ban.TrangThai || '',
  }
}

export const layDanhSachBanApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/ban'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaBanAn).filter(Boolean) : [],
  }
}

export const capNhatTrangThaiBanApi = async (id, status) => tachPhanHoiApi(await trinhKhachApi.patch(`/ban/${id}/status`, { trangThai: status }))
