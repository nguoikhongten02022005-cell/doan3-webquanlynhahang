import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

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
    bookingCode: booking.maDatBan || booking.MaDatBan,
    guests: String(booking.soNguoi ?? booking.SoNguoi ?? ''),
    date: chuanHoaNgayDat(booking.ngayDat || booking.NgayDat),
    time: booking.gioDat || booking.GioDat,
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

export const layDanhSachDatBanApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/dat-ban')))
export const layLichSuDatBanApi = async (maKh = 'KH001') => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get(`/dat-ban/khach/${maKh}`)))
export const layKhaDungDatBanApi = async ({ ngayDat, gioDat, soNguoi = 0, khuVuc = 'KHONG_UU_TIEN' }) => {
  const thamSo = new URLSearchParams({
    ngayDat: chuanHoaNgayDat(ngayDat),
    gioDat: String(gioDat || '').trim(),
    soNguoi: String(Number(soNguoi || 0)),
    khuVuc: String(khuVuc || 'KHONG_UU_TIEN').trim(),
  })

  return tachPhanHoiApi(await trinhKhachApi.get(`/dat-ban/availability?${thamSo.toString()}`))
}
export const taoDatBanApi = async (payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/dat-ban', chuanHoaDatBanPayload(payload))))
export const taoDatBanNoiBoApi = async (payload) => taoDatBanApi(payload)
export const capNhatDatBanApi = async (id, payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}`, chuanHoaDatBanPayload({ ...payload, maDatBan: id }))))
export const capNhatTrangThaiDatBanApi = async (id, status) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/status`, { trangThai: status })))
export const ganBanChoDatBanApi = async (id, danhSachIdBan = []) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/assign-tables`, { danhSachMaBan: danhSachIdBan })))
export const huyDatBanApi = async (id) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/status`, { trangThai: 'Cancelled' })))
