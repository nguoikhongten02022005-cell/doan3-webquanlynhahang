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
    areaId: suyRaKhuVucTuViTri(ban.viTri || ban.ViTri || ''),
    rawAreaText: ban.viTri || ban.ViTri || '',
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
