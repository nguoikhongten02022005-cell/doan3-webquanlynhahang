import { trinhKhachApi, tachPhanHoiApi, coSuDungMayChu } from '../trinhKhachApi'
import {
  taoPhanHoiOffline,
  layDanhSachDatBanOffline,
  layLichSuDatBanTheoKhachHangOffline,
  taoHoacCapNhatDatBanOffline,
  capNhatTrangThaiDatBanOffline,
  ganBanChoDatBanOffline,
  layDanhSachBanOffline,
} from '../offline/dichVuOfflineStore'

const sinhMaDatBan = () => `DB_${Date.now()}`

const chuanHoaNgayDat = (giaTri) => {
  if (!giaTri) return ''

  const chuoiGiaTri = String(giaTri).trim()
  const ketQuaNgayThang = chuoiGiaTri.match(/^(\d{4}-\d{2}-\d{2})/)
  if (ketQuaNgayThang) return ketQuaNgayThang[1]

  return chuoiGiaTri
}

const chuanHoaDatBan = (booking) => {
  if (!booking || typeof booking !== 'object') return null

  const assignedTableIds = Array.isArray(booking.assignedTableIds)
    ? booking.assignedTableIds.map((maBan) => String(maBan || '').trim()).filter(Boolean)
    : (booking.maBan || booking.MaBan ? [String(booking.maBan || booking.MaBan).trim()] : [])

  const assignedTables = Array.isArray(booking.assignedTables)
    ? booking.assignedTables.map((ban) => ({
      id: String(ban?.id || ban?.maBan || ban?.MaBan || ban?.code || '').trim(),
      code: String(ban?.code || ban?.maBan || ban?.MaBan || ban?.id || '').trim(),
      name: String(ban?.name || ban?.tenBan || ban?.TenBan || '').trim(),
    })).filter((ban) => ban.id)
    : assignedTableIds.map((maBan) => ({ id: maBan, code: maBan, name: maBan }))

  return {
    ...booking,
    id: booking.id || booking.bookingId || booking.bookingCode || booking.maDatBan || booking.MaDatBan || '',
    bookingCode: booking.bookingCode || booking.id || booking.bookingId || booking.maDatBan || booking.MaDatBan || '',
    guests: String(booking.soNguoi ?? booking.SoNguoi ?? booking.guestCount ?? booking.guests ?? ''),
    date: chuanHoaNgayDat(booking.ngayDat || booking.NgayDat || booking.date),
    time: booking.gioDat || booking.GioDat || booking.time,
    endTime: booking.gioKetThuc || booking.GioKetThuc || '',
    note: booking.ghiChu || booking.GhiChu || '',
    notes: booking.ghiChu || booking.GhiChu || '',
    name: booking.tenKhachDatBan || booking.TenKhachDatBan || '',
    phone: booking.sdtDatBan || booking.SDTDatBan || '',
    email: booking.emailDatBan || booking.EmailDatBan || '',
    seatingArea: booking.khuVucUuTien || booking.KhuVucUuTien || 'KHONG_UU_TIEN',
    internalNote: booking.ghiChuNoiBo || booking.GhiChuNoiBo || '',
    status: booking.trangThai || booking.TrangThai || '',
    tableCode: booking.maBan || booking.MaBan || '',
    customerCode: booking.maKH || booking.MaKH || '',
    staffCode: booking.maNV || booking.MaNV || '',
    createdAt: booking.ngayTao || booking.NgayTao,
    updatedAt: booking.ngayCapNhat || booking.NgayCapNhat,
    assignedTableIds,
    assignedTables,
  }
}

const tachVaChuanHoa = (phanHoi) => ({
  ...phanHoi,
  duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDatBan).filter(Boolean) : chuanHoaDatBan(phanHoi.duLieu),
})

const chuanHoaDatBanPayload = (payload = {}) => ({
  maDatBan: payload.maDatBan || payload.bookingCode || sinhMaDatBan(),
  maKH: payload.maKH || payload.customerCode || 'KH001',
  maBan: payload.maBan || payload.tableCode || payload.tableNumber || null,
  maNV: payload.maNV || payload.staffCode || 'NV002',
  tenKhachDatBan: payload.tenKhachDatBan || payload.name || '',
  sdtDatBan: payload.sdtDatBan || payload.phone || '',
  emailDatBan: payload.emailDatBan || payload.email || '',
  ngayDat: chuanHoaNgayDat(payload.ngayDat || payload.date || ''),
  gioDat: payload.gioDat || payload.time || '',
  gioKetThuc: payload.gioKetThuc || payload.endTime || null,
  soNguoi: Number(payload.soNguoi || payload.guests || 0),
  ghiChu: payload.ghiChu || payload.notes || '',
  khuVucUuTien: payload.khuVucUuTien || payload.seatingArea || 'KHONG_UU_TIEN',
  ghiChuNoiBo: payload.ghiChuNoiBo || payload.internalNote || '',
})

export const layDanhSachDatBanApi = async () => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(layDanhSachDatBanOffline(), 'Lay danh sach dat ban thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/dat-ban')))
}

export const layLichSuDatBanApi = async (maKh = 'KH001') => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(layLichSuDatBanTheoKhachHangOffline(maKh), 'Lay lich su dat ban thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get(`/dat-ban/khach/${maKh}`)))
}

export const layKhaDungDatBanApi = async ({ ngayDat, gioDat, soNguoi = 0, khuVuc = 'KHONG_UU_TIEN' }) => {
  if (!coSuDungMayChu()) {
    const ngayDaChuanHoa = chuanHoaNgayDat(ngayDat)
    const danhSachBan = layDanhSachBanOffline()
    const danhSachDatBan = layDanhSachDatBanOffline()
    const tongBanPhuHop = danhSachBan.filter((ban) => {
      const khopKhuVuc = khuVuc === 'KHONG_UU_TIEN' || String(ban.areaId || '').trim() === String(khuVuc || '').trim()
      const khopSoNguoi = Number(ban.capacity || 0) >= Number(soNguoi || 0)
      const banTrong = !['CO_KHACH', 'CHO_THANH_TOAN', 'Occupied', 'Reserved'].includes(String(ban.status || '').trim())
      return khopKhuVuc && khopSoNguoi && banTrong
    }).length - danhSachDatBan.filter((booking) => String(booking.date || booking.ngayDat || '') === ngayDaChuanHoa && String(booking.time || booking.gioDat || '') === String(gioDat || '').trim() && !['Cancelled', 'DA_HUY', 'KHONG_DEN'].includes(String(booking.status || booking.trangThai || ''))).length

    const tongPhuHop = Math.max(0, tongBanPhuHop)
    const mucKhaDung = tongPhuHop <= 0 ? 'FULL' : tongPhuHop <= 2 ? 'LIMITED' : 'AVAILABLE'

    return tachPhanHoiApi(taoPhanHoiOffline({
      ngayDat: ngayDaChuanHoa,
      gioDat: String(gioDat || '').trim(),
      tongBanPhuHop: tongPhuHop,
      mucKhaDung,
      isDisabled: tongPhuHop <= 0,
    }, 'Lay kha dung dat ban thanh cong'))
  }

  const thamSo = new URLSearchParams({
    ngayDat: chuanHoaNgayDat(ngayDat),
    gioDat: String(gioDat || '').trim(),
    soNguoi: String(Number(soNguoi || 0)),
    khuVuc: String(khuVuc || 'KHONG_UU_TIEN').trim(),
  })

  return tachPhanHoiApi(await trinhKhachApi.get(`/dat-ban/availability?${thamSo.toString()}`))
}

export const taoDatBanApi = async (payload) => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(taoHoacCapNhatDatBanOffline({ booking: chuanHoaDatBanPayload(payload) }), 'Tao dat ban thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/dat-ban', chuanHoaDatBanPayload(payload))))
}

export const taoDatBanNoiBoApi = async (payload) => taoDatBanApi(payload)

export const capNhatDatBanApi = async (id, payload) => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(taoHoacCapNhatDatBanOffline({ booking: chuanHoaDatBanPayload({ ...payload, maDatBan: id }), maDatBan: id }), 'Cap nhat dat ban thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}`, chuanHoaDatBanPayload({ ...payload, maDatBan: id }))))
}

export const capNhatTrangThaiDatBanApi = async (id, status) => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(capNhatTrangThaiDatBanOffline(id, status), 'Cap nhat trang thai dat ban thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/status`, { trangThai: status })))
}

export const ganBanChoDatBanApi = async (id, danhSachIdBan = []) => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(ganBanChoDatBanOffline(id, danhSachIdBan), 'Gan ban thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/assign-tables`, { danhSachMaBan: danhSachIdBan })))
}

export const huyDatBanApi = async (id) => {
  if (!coSuDungMayChu()) {
    return tachVaChuanHoa(tachPhanHoiApi(taoPhanHoiOffline(capNhatTrangThaiDatBanOffline(id, 'Cancelled'), 'Huy dat ban thanh cong')))
  }

  return tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/status`, { trangThai: 'Cancelled' })))
}
