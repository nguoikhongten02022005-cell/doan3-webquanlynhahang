import { TRANG_THAI_BAN } from '../../services/dichVuBanAn.js'
import {
  CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG,
  CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN,
  CAC_BO_LOC_NGAY,
  CAC_TRANG_THAI_DAT_BAN_CHO_XAC_NHAN,
  CAC_BO_LOC_CA,
  CAC_KHU_VUC_BAN,
} from './hangSo'
import { laySacThaiDonHang } from './dinhDang'

export const laDatBanVip = (booking) => booking.seatingArea === 'PHONG_VIP'
const laTrangThaiChoXuLy = (trangThai) => CAC_TRANG_THAI_DAT_BAN_CHO_XAC_NHAN.has(trangThai) || trangThai === 'Pending'
const laTrangThaiDaXacNhan = (trangThai) => CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN.has(trangThai) || trangThai === 'Confirmed'

export const canXacNhanThuCong = (booking) => laTrangThaiChoXuLy(booking.status) || laDatBanVip(booking)

export const layGhiChuUuTienDatBan = (booking) => {
  if (laDatBanVip(booking)) return 'Ưu tiên xác nhận thủ công do yêu cầu VIP hoặc khu riêng.'
  if (booking.status === 'CAN_GOI_LAI') return 'Cần gọi lại để chốt tình trạng chỗ trống hoặc điều kiện phục vụ.'
  if (!Array.isArray(booking.assignedTableIds) || booking.assignedTableIds.length === 0) return 'Booking chưa được gán bàn cụ thể.'
  if (booking.seatingArea === 'BAN_CONG') return 'Kiểm tra thời tiết trước khi chốt vị trí ban công.'
  return ''
}

const CAC_TRANG_THAI_DAT_BAN_KET_THUC = new Set([
  'DA_HOAN_THANH',
  'DA_HUY',
  'KHONG_DEN',
  'TU_CHOI_HET_CHO',
])

export const daGanBan = (booking) => Array.isArray(booking?.assignedTableIds) && booking.assignedTableIds.length > 0
export const laDatBanDaCheckIn = (booking) => booking.status === 'DA_CHECK_IN' || booking.status === 'DA_XEP_BAN'
export const laTrangThaiDatBanKetThuc = (booking) => CAC_TRANG_THAI_DAT_BAN_KET_THUC.has(booking?.status)

export const coTheGanBanChoDatBan = (booking) => !laTrangThaiDatBanKetThuc(booking)
export const coTheCheckInDatBan = (booking) => daGanBan(booking) && !laDatBanDaCheckIn(booking) && !laTrangThaiDatBanKetThuc(booking)
export const coTheHoanThanhDatBan = (booking) => booking?.status === 'DA_CHECK_IN' || booking?.status === 'DA_XEP_BAN'
export const coTheDanhDauKhongDen = (booking) => !laDatBanDaCheckIn(booking) && !laTrangThaiDatBanKetThuc(booking)

export const phanTichNgayGioDatBan = (date, time) => {
  if (!date) return null

  const gioDaChuanHoa = time && /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time || '00:00:00'
  const ngayDaPhanTich = new Date(`${date}T${gioDaChuanHoa}`)

  return Number.isNaN(ngayDaPhanTich.getTime()) ? null : ngayDaPhanTich
}

const laCungNgayLich = (left, right) => (
  left.getFullYear() === right.getFullYear()
  && left.getMonth() === right.getMonth()
  && left.getDate() === right.getDate()
)

export const khopBoLocNgay = (booking, dayFilter, now) => {
  if (dayFilter === 'all') return true

  const ngayDatBan = phanTichNgayGioDatBan(booking.date, booking.time)
  if (!ngayDatBan) return false

  if (dayFilter === 'today') {
    return laCungNgayLich(ngayDatBan, now)
  }

  if (dayFilter === 'tomorrow') {
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    return laCungNgayLich(ngayDatBan, tomorrow)
  }

  return true
}

export const khopBoLocCa = (booking, shiftFilter) => {
  if (shiftFilter === 'all') return true

  const [hour] = String(booking.time || '').split(':')
  const gioSo = Number(hour)

  if (Number.isNaN(gioSo)) return false
  if (shiftFilter === 'lunch') return gioSo < 16
  if (shiftFilter === 'dinner') return gioSo >= 16

  return true
}

export const khopTimKiemDatBan = (booking, searchQuery) => {
  const tuKhoaDaChuanHoa = String(searchQuery || '').trim().toLowerCase()
  if (!tuKhoaDaChuanHoa) return true

  return [
    booking.bookingCode,
    booking.name,
    booking.phone,
    booking.email,
  ].some((value) => String(value || '').toLowerCase().includes(tuKhoaDaChuanHoa))
}

export const layTomTatDonHang = (orders) => ({
  total: orders.length,
  pending: orders.filter((order) => laySacThaiDonHang(order?.status) === 'warning').length,
  revenue: orders.reduce((sum, order) => sum + (Number(order?.total) || 0), 0),
})

export const layTomTatBan = (tables) => {
  const thongKe = tables.reduce((boDem, table) => {
    const khuVuc = table.areaId || 'KHONG_UU_TIEN'

    if (!boDem[khuVuc]) {
      boDem[khuVuc] = {
        id: khuVuc,
        name: table.rawAreaText || khuVuc,
        total: 0,
        occupied: 0,
        dirty: 0,
        held: 0,
      }
    }

    boDem[khuVuc].total += 1

    if (table.status === TRANG_THAI_BAN.DANG_SU_DUNG) {
      boDem[khuVuc].occupied += 1
    }

    if (table.status === TRANG_THAI_BAN.GIU_CHO) {
      boDem[khuVuc].held += 1
    }

    if (table.status === TRANG_THAI_BAN.BAN) {
      boDem[khuVuc].dirty += 1
    }

    return boDem
  }, {})

  const khuVucDong = Object.values(thongKe).map((khuVuc) => {
    const khongKhaDung = khuVuc.occupied + khuVuc.held + khuVuc.dirty
    const available = Math.max(khuVuc.total - khongKhaDung, 0)

    return {
      ...khuVuc,
      available,
      occupancyRate: khuVuc.total > 0 ? khongKhaDung / khuVuc.total : 0,
    }
  })

  if (khuVucDong.length > 0) {
    return khuVucDong
  }

  return CAC_KHU_VUC_BAN.map((area) => ({
    ...area,
    occupied: 0,
    held: 0,
    dirty: 0,
    available: area.total,
    occupancyRate: 0,
  }))
}

export const layTomTatTonKhoBan = (tables) => ({
  total: tables.length,
  available: tables.filter((table) => table.status === TRANG_THAI_BAN.TRONG).length,
  held: tables.filter((table) => table.status === TRANG_THAI_BAN.GIU_CHO).length,
  occupied: tables.filter((table) => table.status === TRANG_THAI_BAN.DANG_SU_DUNG).length,
  dirty: tables.filter((table) => table.status === TRANG_THAI_BAN.BAN).length,
})

export const layTomTatTaiKhoan = (accounts) => ({
  total: accounts.length,
  admins: accounts.filter((account) => account.role === 'admin').length,
  staffs: accounts.filter((account) => account.role === 'staff').length,
  customers: accounts.filter((account) => account.role === 'customer').length,
})

export const layNhanPhamViTongQuan = (dayFilter, shiftFilter) => {
  const dayLabel = CAC_BO_LOC_NGAY.find((item) => item.key === dayFilter)?.label || 'Toàn bộ ngày'
  const shiftLabel = CAC_BO_LOC_CA.find((item) => item.key === shiftFilter)?.label || 'Mọi ca'
  return `${dayLabel} · ${shiftLabel}`
}

export const laDatBanDaHoanThanh = (booking) => booking.status === 'DA_HOAN_THANH'
export const laDatBanSapDienRa = (booking, now) => {
  const thoiDiemDatBan = phanTichNgayGioDatBan(booking.date, booking.time)
  if (!thoiDiemDatBan) return false

  const chenhLech = thoiDiemDatBan.getTime() - now.getTime()
  return chenhLech >= 0 && chenhLech <= 2 * 60 * 60 * 1000
}

export const layDatBanChuaGanBan = (bookings) => bookings.filter((booking) => {
  if (!CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG.has(booking.status)) {
    return false
  }

  return !Array.isArray(booking.assignedTableIds) || booking.assignedTableIds.length === 0
})

export const layDoUuTienDatBan = (booking, now) => {
  const thoiDiemDatBan = phanTichNgayGioDatBan(booking.date, booking.time)
  const chenhLech = thoiDiemDatBan ? thoiDiemDatBan.getTime() - now.getTime() : Number.POSITIVE_INFINITY
  const datBanDaGanBan = Array.isArray(booking.assignedTableIds) && booking.assignedTableIds.length > 0

  if (canXacNhanThuCong(booking)) return 0
  if (!datBanDaGanBan && laTrangThaiDaXacNhan(booking.status)) return 1
  if (chenhLech >= 0 && chenhLech <= 2 * 60 * 60 * 1000) return 2
  if (laDatBanDaCheckIn(booking)) return 3
  if (laTrangThaiDaXacNhan(booking.status)) return 4
  return 5
}

export const sapXepDatBanChoVanHanh = (bookings, now) => [...bookings].sort((left, right) => {
  const doUuTienTrai = layDoUuTienDatBan(left, now)
  const doUuTienPhai = layDoUuTienDatBan(right, now)

  if (doUuTienTrai !== doUuTienPhai) {
    return doUuTienTrai - doUuTienPhai
  }

  const thoiGianTrai = phanTichNgayGioDatBan(left.date, left.time)?.getTime() || Number.POSITIVE_INFINITY
  const thoiGianPhai = phanTichNgayGioDatBan(right.date, right.time)?.getTime() || Number.POSITIVE_INFINITY

  if (thoiGianTrai !== thoiGianPhai) {
    return thoiGianTrai - thoiGianPhai
  }

  return (Number(right.id) || 0) - (Number(left.id) || 0)
})

export const sapXepDonHangChoVanHanh = (orders) => [...orders].sort((left, right) => {
  const sacThaiTrai = laySacThaiDonHang(left.status)
  const sacThaiPhai = laySacThaiDonHang(right.status)
  const thuHangSacThai = { warning: 0, neutral: 1, success: 2, danger: 3 }

  if (thuHangSacThai[sacThaiTrai] !== thuHangSacThai[sacThaiPhai]) {
    return thuHangSacThai[sacThaiTrai] - thuHangSacThai[sacThaiPhai]
  }

  return (Number(right.id) || 0) - (Number(left.id) || 0)
})
