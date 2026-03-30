import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const suyRaKhuVucTuViTri = (viTri = '') => {
  const giaTri = String(viTri).toLowerCase()

  if (giaTri.includes('vip') || giaTri.includes('riêng') || giaTri.includes('rieng')) {
    return 'PHONG_VIP'
  }

  if (giaTri.includes('ngoài') || giaTri.includes('ngoai') || giaTri.includes('ban công') || giaTri.includes('ban cong')) {
    return 'BAN_CONG'
  }

  return 'SANH_CHINH'
}

const chuanHoaTrangThaiBan = (trangThai = '') => {
  if (trangThai === 'TRONG' || trangThai === 'Available') return 'TRONG'
  if (trangThai === 'CO_KHACH' || trangThai === 'Occupied') return 'CO_KHACH'
  if (trangThai === 'CHO_THANH_TOAN' || trangThai === 'Reserved') return 'CHO_THANH_TOAN'
  return trangThai || 'TRONG'
}

const chuanHoaBanAn = (ban) => {
  if (!ban || typeof ban !== 'object') {
    return null
  }

  return {
    ...ban,
    code: ban.maBan || ban.MaBan,
    name: ban.tenBan || ban.TenBan || `Bàn ${ban.soBan ?? ban.SoBan ?? ''}`.trim(),
    tableNumber: Number(ban.soBan ?? ban.SoBan ?? 0),
    capacity: Number(ban.soChoNgoi ?? ban.SoChoNgoi ?? 0),
    areaId: suyRaKhuVucTuViTri(ban.khuVuc || ban.KhuVuc || ban.viTri || ban.ViTri || ''),
    rawAreaText: ban.khuVuc || ban.KhuVuc || ban.viTri || ban.ViTri || '',
    note: ban.ghiChu || ban.GhiChu || '',
    status: chuanHoaTrangThaiBan(ban.trangThai || ban.TrangThai || ''),
  }
}

export const layDanhSachBanApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/ban'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaBanAn).filter(Boolean) : [],
  }
}

const mapTrangThaiBanApi = (status) => {
  if (status === 'TRONG') return 'TRONG'
  if (status === 'CO_KHACH') return 'CO_KHACH'
  if (status === 'CHO_THANH_TOAN') return 'CHO_THANH_TOAN'
  return status
}

export const capNhatTrangThaiBanApi = async (id, status) => tachPhanHoiApi(await trinhKhachApi.patch(`/ban/${id}/status`, { trangThai: mapTrangThaiBanApi(status) }))
export const taoBanApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/ban', payload))
export const capNhatBanApi = async (maBan, payload) => tachPhanHoiApi(await trinhKhachApi.put(`/ban/${maBan}`, payload))
export const xoaBanApi = async (maBan) => tachPhanHoiApi(await trinhKhachApi.delete(`/ban/${maBan}`))
export const layQrBanApi = async (maBan) => tachPhanHoiApi(await trinhKhachApi.get(`/ban/${maBan}/qr`))
