import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import {
  taoPhanHoiOffline,
  layDanhSachBanOffline,
  capNhatTrangThaiBanOffline,
  laySoBanMoiOffline,
  capNhatHeThongOffline,
  taoThongTinQrBanOffline,
} from '../offline/dichVuOfflineStore'

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
  if (!coSuDungMayChu()) {
    const duLieu = layDanhSachBanOffline().map((ban) => ({
      maBan: ban.code,
      MaBan: ban.code,
      tenBan: ban.name,
      TenBan: ban.name,
      soBan: Number(ban.tableNumber || 0),
      SoBan: Number(ban.tableNumber || 0),
      soChoNgoi: Number(ban.capacity || 0),
      SoChoNgoi: Number(ban.capacity || 0),
      khuVuc: ban.rawAreaText || ban.areaId || '',
      KhuVuc: ban.rawAreaText || ban.areaId || '',
      viTri: ban.rawAreaText || ban.areaId || '',
      ViTri: ban.rawAreaText || ban.areaId || '',
      ghiChu: ban.note || '',
      GhiChu: ban.note || '',
      trangThai: ban.status,
      TrangThai: ban.status,
    }))

    return {
      ...tachPhanHoiApi(taoPhanHoiOffline(duLieu, 'Lay danh sach ban thanh cong')),
      duLieu: duLieu.map(chuanHoaBanAn).filter(Boolean),
    }
  }

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

export const capNhatTrangThaiBanApi = async (id, status) => {
  if (!coSuDungMayChu()) {
    capNhatTrangThaiBanOffline(id, mapTrangThaiBanApi(status))
    return tachPhanHoiApi(taoPhanHoiOffline(null, 'Cap nhat trang thai ban thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.patch(`/ban/${id}/status`, { trangThai: mapTrangThaiBanApi(status) }))
}

export const taoBanApi = async (payload) => {
  if (!coSuDungMayChu()) {
    const maBan = String(payload.maBan || `B${String(laySoBanMoiOffline()).padStart(3, '0')}`).trim()
    const soBan = Number(payload.soBan || String(payload.tenBan || '').replace(/\D/g, '') || laySoBanMoiOffline())

    capNhatHeThongOffline((draft) => {
      draft.ban.push({
        id: maBan,
        code: maBan,
        name: payload.tenBan || `Bàn ${soBan}`,
        tableNumber: soBan,
        capacity: Number(payload.soChoNgoi || 0),
        areaId: suyRaKhuVucTuViTri(payload.khuVuc || payload.viTri || ''),
        rawAreaText: payload.khuVuc || payload.viTri || '',
        note: payload.ghiChu || '',
        status: 'TRONG',
      })
    })

    return tachPhanHoiApi(taoPhanHoiOffline({ maBan }, 'Tao ban thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.post('/ban', payload))
}

export const capNhatBanApi = async (maBan, payload) => {
  if (!coSuDungMayChu()) {
    capNhatHeThongOffline((draft) => {
      const ban = draft.ban.find((item) => String(item.code || item.id) === String(maBan || ''))
      if (!ban) {
        throw new Error('Không tìm thấy bàn.')
      }

      ban.name = payload.tenBan || ban.name
      ban.tableNumber = Number(payload.soBan || ban.tableNumber || 0)
      ban.capacity = Number(payload.soChoNgoi || ban.capacity || 0)
      ban.rawAreaText = payload.khuVuc || payload.viTri || ban.rawAreaText || ''
      ban.areaId = suyRaKhuVucTuViTri(ban.rawAreaText)
      ban.note = payload.ghiChu || ''
    })

    return tachPhanHoiApi(taoPhanHoiOffline({ maBan }, 'Cap nhat ban thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.put(`/ban/${maBan}`, payload))
}

export const xoaBanApi = async (maBan) => {
  if (!coSuDungMayChu()) {
    capNhatHeThongOffline((draft) => {
      draft.ban = draft.ban.filter((item) => String(item.code || item.id) !== String(maBan || ''))
    })

    return tachPhanHoiApi(taoPhanHoiOffline(null, 'Xoa ban thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.delete(`/ban/${maBan}`))
}

export const layQrBanApi = async (maBan) => {
  if (!coSuDungMayChu()) {
    return tachPhanHoiApi(taoPhanHoiOffline(taoThongTinQrBanOffline(maBan), 'Lay QR ban thanh cong'))
  }

  return tachPhanHoiApi(await trinhKhachApi.get(`/ban/${maBan}/qr`))
}
