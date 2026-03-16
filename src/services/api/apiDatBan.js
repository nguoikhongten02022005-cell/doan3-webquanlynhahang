import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaDatBanPayload = (payload = {}) => ({
  soKhach: Number(payload.guests || payload.soKhach || 0),
  ngayDat: payload.date || payload.ngayDat || '',
  gioDat: payload.time || payload.gioDat || '',
  khuVucUuTien: payload.seatingArea || payload.khuVucUuTien || 'KHONG_UU_TIEN',
  ghiChu: payload.notes || payload.ghiChu || '',
  tenKhach: payload.name || payload.tenKhach || '',
  soDienThoaiKhach: payload.phone || payload.soDienThoaiKhach || '',
  emailKhach: payload.email || payload.emailKhach || '',
  trangThai: payload.status || payload.trangThai || 'YEU_CAU_DAT_BAN',
  nguonTao: payload.source || payload.nguonTao || 'web',
  emailNguoiDung: payload.userEmail || payload.emailNguoiDung || payload.email || '',
  dipDacBiet: payload.occasion || payload.dipDacBiet || '',
  kenhXacNhan: Array.isArray(payload.confirmationChannel)
    ? payload.confirmationChannel.join(', ')
    : (payload.confirmationChannel || payload.kenhXacNhan || ''),
  ghiChuNoiBo: payload.internalNote || payload.ghiChuNoiBo || '',
  taoBoi: payload.createdBy || payload.taoBoi || 'frontend',
})

const chuanHoaDatBan = (booking) => {
  if (!booking || typeof booking !== 'object') {
    return null
  }

  const area = String(booking.khuVucUuTien || '').trim()
  const rawStatus = String(booking.trangThai || '').trim()

  return {
    ...booking,
    bookingCode: booking.maDatBan,
    guests: String(booking.soKhach ?? ''),
    date: booking.ngayDat,
    time: booking.gioDat,
    seatingArea: area,
    notes: booking.ghiChu,
    name: booking.tenKhach,
    phone: booking.soDienThoaiKhach,
    email: booking.emailKhach,
    status: rawStatus,
    rawStatus,
    source: booking.nguonTao,
    createdAt: booking.taoLuc,
    updatedAt: booking.capNhatLuc,
    userEmail: booking.emailNguoiDung,
    occasion: booking.dipDacBiet,
    confirmationChannel: (() => {
      if (Array.isArray(booking.kenhXacNhan)) return booking.kenhXacNhan
      if (typeof booking.kenhXacNhan === 'string' && booking.kenhXacNhan.trim()) {
        try {
          const parsed = JSON.parse(booking.kenhXacNhan)
          return Array.isArray(parsed) ? parsed : [booking.kenhXacNhan]
        } catch {
          return [booking.kenhXacNhan]
        }
      }
      return []
    })(),
    internalNote: booking.ghiChuNoiBo,
    checkedInAt: booking.checkInLuc,
    seatedAt: booking.xepBanLuc,
    completedAt: booking.hoanThanhLuc,
    cancelledAt: booking.huyLuc,
    noShowAt: booking.vangMatLuc,
    createdBy: booking.taoBoi,
    assignedTableIds: [],
    assignedTables: [],
  }
}

const tachVaChuanHoa = (phanHoi) => ({
  ...phanHoi,
  duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaDatBan).filter(Boolean) : chuanHoaDatBan(phanHoi.duLieu),
})

export const layDanhSachDatBanApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/dat-ban')))
export const layLichSuDatBanApi = async () => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.get('/dat-ban/history')))
export const taoDatBanApi = async (payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/dat-ban', chuanHoaDatBanPayload(payload))))
export const taoDatBanNoiBoApi = async (payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.post('/dat-ban', chuanHoaDatBanPayload(payload))))
export const capNhatDatBanApi = async (id, payload) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}`, chuanHoaDatBanPayload(payload))))
export const capNhatTrangThaiDatBanApi = async (id, status) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/status`, { trangThai: status })))
export const ganBanChoDatBanApi = async (id, danhSachIdBan) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/assign-tables`, { danhSachBanAnId: danhSachIdBan })))
export const huyDatBanApi = async (id) => tachVaChuanHoa(tachPhanHoiApi(await trinhKhachApi.patch(`/dat-ban/${id}/cancel`, {})))
