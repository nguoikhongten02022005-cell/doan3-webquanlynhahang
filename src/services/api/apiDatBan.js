import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const sinhMaDatBan = () => `DB_${Date.now()}`

const chuanHoaDatBan = (booking) => {
  if (!booking || typeof booking !== 'object') return null

  return {
    ...booking,
    bookingCode: booking.maDatBan || booking.MaDatBan,
    guests: String(booking.soNguoi ?? booking.SoNguoi ?? ''),
    date: booking.ngayDat || booking.NgayDat,
    time: booking.gioDat || booking.GioDat,
    endTime: booking.gioKetThuc || booking.GioKetThuc || '',
    note: booking.ghiChu || booking.GhiChu || '',
    status: booking.trangThai || booking.TrangThai || '',
    tableCode: booking.maBan || booking.MaBan || '',
    customerCode: booking.maKH || booking.MaKH || '',
    staffCode: booking.maNV || booking.MaNV || '',
    createdAt: booking.ngayTao || booking.NgayTao,
    updatedAt: booking.ngayCapNhat || booking.NgayCapNhat,
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
  ngayDat: payload.ngayDat || payload.date || '',
  gioDat: payload.gioDat || payload.time || '',
  gioKetThuc: payload.gioKetThuc || payload.endTime || null,
  soNguoi: Number(payload.soNguoi || payload.guests || 0),
  ghiChu: payload.ghiChu || payload.notes || '',
})

export const layDanhSachDatBanApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/dat-ban')))
export const layLichSuDatBanApi = async (maKh = 'KH001') => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get(`/dat-ban/khach/${maKh}`)))
export const taoDatBanApi = async (payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/dat-ban', chuanHoaDatBanPayload(payload))))
export const taoDatBanNoiBoApi = async (payload) => taoDatBanApi(payload)
export const capNhatDatBanApi = async (id, payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/status`, { trangThai: payload?.trangThai || payload?.status || 'Confirmed' })))
export const capNhatTrangThaiDatBanApi = async (id, status) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/status`, { trangThai: status })))
export const ganBanChoDatBanApi = async () => ({ duLieu: null, thongDiep: 'Backend moi chua ho tro gan nhieu ban', meta: null })
export const huyDatBanApi = async (id) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/status`, { trangThai: 'Cancelled' })))
