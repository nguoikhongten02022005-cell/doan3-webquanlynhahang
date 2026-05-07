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

export const laDatBanVip = (datBan) => datBan.seatingArea === 'PHONG_VIP'
const laTrangThaiChoXuLy = (trangThai) => CAC_TRANG_THAI_DAT_BAN_CHO_XAC_NHAN.has(trangThai) || trangThai === 'Pending'
const laTrangThaiDaXacNhan = (trangThai) => CAC_TRANG_THAI_DAT_BAN_DA_XAC_NHAN.has(trangThai) || trangThai === 'Confirmed'

export const canXacNhanThuCong = (datBan) => laTrangThaiChoXuLy(datBan.status) || laDatBanVip(datBan)

export const layGhiChuUuTienDatBan = (datBan) => {
  if (laDatBanVip(datBan)) return 'Ưu tiên xác nhận thủ công do yêu cầu VIP hoặc khu riêng.'
  if (datBan.status === 'CAN_GOI_LAI') return 'Cần gọi lại để chốt tình trạng chỗ trống hoặc điều kiện phục vụ.'
  if (!Array.isArray(datBan.danhSachMaBanDaGan) || datBan.danhSachMaBanDaGan.length === 0) return 'Booking chưa được gán bàn cụ thể.'
  if (datBan.seatingArea === 'BAN_CONG') return 'Kiểm tra thời tiết trước khi chốt vị trí ban công.'
  return ''
}

const CAC_TRANG_THAI_DAT_BAN_KET_THUC = new Set([
  'DA_HOAN_THANH',
  'DA_HUY',
  'KHONG_DEN',
  'TU_CHOI_HET_CHO',
])

export const daGanBan = (datBan) => Array.isArray(datBan?.danhSachMaBanDaGan) && datBan?.danhSachMaBanDaGan.length > 0
export const laDatBanDaCheckIn = (datBan) => datBan.status === 'DA_CHECK_IN' || datBan.status === 'DA_XEP_BAN'
export const laTrangThaiDatBanKetThuc = (datBan) => CAC_TRANG_THAI_DAT_BAN_KET_THUC.has(datBan?.status)

export const coTheGanBanChoDatBan = (datBan) => !laTrangThaiDatBanKetThuc(datBan)
export const coTheCheckInDatBan = (datBan) => daGanBan(datBan) && !laDatBanDaCheckIn(datBan) && !laTrangThaiDatBanKetThuc(datBan)
export const coTheHoanThanhDatBan = (datBan) => datBan?.status === 'DA_CHECK_IN' || datBan?.status === 'DA_XEP_BAN'
export const coTheDanhDauKhongDen = (datBan) => !laDatBanDaCheckIn(datBan) && !laTrangThaiDatBanKetThuc(datBan)

export const phanTichNgayGioDatBan = (ngay, gio) => {
  if (!ngay) return null

  const gioDaChuanHoa = gio && /^\d{2}:\d{2}$/.test(gio) ? `${gio}:00` : gio || '00:00:00'
  const ngayDaPhanTich = new Date(`${ngay}T${gioDaChuanHoa}`)

  return Number.isNaN(ngayDaPhanTich.getTime()) ? null : ngayDaPhanTich
}

export const laCungNgayLich = (ngayTrai, ngayPhai) => (
  ngayTrai.getFullYear() === ngayPhai.getFullYear()
  && ngayTrai.getMonth() === ngayPhai.getMonth()
  && ngayTrai.getDate() === ngayPhai.getDate()
)

export const khopBoLocNgay = (datBan, boLocNgay, hienTai) => {
  if (boLocNgay === 'all') return true

  const ngayDatBan = phanTichNgayGioDatBan(datBan.date, datBan.time)
  if (!ngayDatBan) return false

  if (boLocNgay === 'today') {
    return laCungNgayLich(ngayDatBan, hienTai)
  }

  if (boLocNgay === 'tomorrow') {
    const ngayMai = new Date(hienTai)
    ngayMai.setDate(hienTai.getDate() + 1)
    return laCungNgayLich(ngayDatBan, ngayMai)
  }

  if (boLocNgay === 'last7Days') {
    const ngayBatDau = new Date(hienTai)
    ngayBatDau.setDate(hienTai.getDate() - 6)
    return ngayDatBan >= ngayBatDau && laCungNgayLich(ngayDatBan, hienTai)
  }

  if (boLocNgay === 'last30Days') {
    const ngayBatDau = new Date(hienTai)
    ngayBatDau.setDate(hienTai.getDate() - 29)
    return ngayDatBan >= ngayBatDau && laCungNgayLich(ngayDatBan, hienTai)
  }

  return true
}

export const khopBoLocCa = (datBan, boLocCa) => {
  if (boLocCa === 'all') return true

  const [gio] = String(datBan.time || '').split(':')
  const gioSo = Number(gio)

  if (Number.isNaN(gioSo)) return false
  if (boLocCa === 'lunch') return gioSo < 16
  if (boLocCa === 'dinner') return gioSo >= 16

  return true
}

export const khopTimKiemDatBan = (datBan, tuKhoaTimKiem) => {
  const tuKhoaDaChuanHoa = String(tuKhoaTimKiem || '').trim().toLowerCase()
  if (!tuKhoaDaChuanHoa) return true

  return [
    datBan.bookingCode,
    datBan.name,
    datBan.phone,
    datBan.email,
  ].some((giaTri) => String(giaTri || '').toLowerCase().includes(tuKhoaDaChuanHoa))
}

export const layTomTatDonHang = (danhSachDonHang) => ({
  total: danhSachDonHang.length,
  pending: danhSachDonHang.filter((donHang) => laySacThaiDonHang(donHang?.status) === 'warning').length,
  revenue: danhSachDonHang.reduce((tong, donHang) => tong + (Number(donHang?.total) || 0), 0),
})

export const layTomTatBan = (danhSachBan) => {
  const boDemTheoKhuVuc = danhSachBan.reduce((boDem, banAn) => {
    const khuVuc = banAn.areaId || 'KHONG_UU_TIEN'

    if (!boDem[khuVuc]) {
      boDem[khuVuc] = {
        id: khuVuc,
        name: banAn.rawAreaText || khuVuc,
        total: 0,
        occupied: 0,
        dirty: 0,
        held: 0,
      }
    }

    boDem[khuVuc].total += 1

    if (banAn.status === TRANG_THAI_BAN.DANG_SU_DUNG) {
      boDem[khuVuc].occupied += 1
    }

    if (banAn.status === TRANG_THAI_BAN.GIU_CHO) {
      boDem[khuVuc].held += 1
    }

    if (banAn.status === TRANG_THAI_BAN.BAN) {
      boDem[khuVuc].dirty += 1
    }

    return boDem
  }, {})

  const danhSachKhuVucTongHop = Object.values(boDemTheoKhuVuc).map((khuVuc) => {
    const soBanKhongKhaDung = khuVuc.occupied + khuVuc.held + khuVuc.dirty
    const available = Math.max(khuVuc.total - soBanKhongKhaDung, 0)

    return {
      ...khuVuc,
      available,
      occupancyRate: khuVuc.total > 0 ? soBanKhongKhaDung / khuVuc.total : 0,
    }
  })

  if (danhSachKhuVucTongHop.length > 0) {
    return danhSachKhuVucTongHop
  }

  return CAC_KHU_VUC_BAN.map((khuVuc) => ({
    ...khuVuc,
    occupied: 0,
    held: 0,
    dirty: 0,
    available: khuVuc.total,
    occupancyRate: 0,
  }))
}

export const layTomTatTonKhoBan = (danhSachBan) => ({
  total: danhSachBan.length,
  available: danhSachBan.filter((banAn) => banAn.status === TRANG_THAI_BAN.TRONG).length,
  held: danhSachBan.filter((banAn) => banAn.status === TRANG_THAI_BAN.GIU_CHO).length,
  occupied: danhSachBan.filter((banAn) => banAn.status === TRANG_THAI_BAN.DANG_SU_DUNG).length,
  dirty: danhSachBan.filter((banAn) => banAn.status === TRANG_THAI_BAN.BAN).length,
})

export const layTomTatTaiKhoan = (danhSachTaiKhoan) => ({
  total: danhSachTaiKhoan.length,
  quanLy: danhSachTaiKhoan.filter((taiKhoan) => taiKhoan.role === 'admin').length,
  nhanVien: danhSachTaiKhoan.filter((taiKhoan) => taiKhoan.role === 'staff').length,
  khachHang: danhSachTaiKhoan.filter((taiKhoan) => taiKhoan.role === 'customer').length,
})

export const layNhanBoLocTongQuan = (boLocNgay, boLocCa) => {
  const nhanNgay = CAC_BO_LOC_NGAY.find((muc) => muc.key === boLocNgay)?.label || 'Toàn bộ ngày'
  const nhanCa = CAC_BO_LOC_CA.find((muc) => muc.key === boLocCa)?.label || 'Mọi ca'
  return `${nhanNgay} · ${nhanCa}`
}

export const laDatBanDaHoanThanh = (datBan) => datBan.status === 'DA_HOAN_THANH'
export const laDatBanSapDienRa = (datBan, hienTai) => {
  const thoiDiemDatBan = phanTichNgayGioDatBan(datBan.date, datBan.time)
  if (!thoiDiemDatBan) return false

  const chenhLech = thoiDiemDatBan.getTime() - hienTai.getTime()
  return chenhLech >= 0 && chenhLech <= 2 * 60 * 60 * 1000
}

export const layDatBanChuaGanBan = (danhSachDatBan) => danhSachDatBan.filter((datBan) => {
  if (!CAC_TRANG_THAI_DAT_BAN_DANG_HOAT_DONG.has(datBan.status)) {
    return false
  }

  return !Array.isArray(datBan.danhSachMaBanDaGan) || datBan.danhSachMaBanDaGan.length === 0
})

export const layDoUuTienDatBan = (datBan, hienTai) => {
  const thoiDiemDatBan = phanTichNgayGioDatBan(datBan.date, datBan.time)
  const chenhLech = thoiDiemDatBan ? thoiDiemDatBan.getTime() - hienTai.getTime() : Number.POSITIVE_INFINITY
  const datBanDaDuocGan = Array.isArray(datBan.danhSachMaBanDaGan) && datBan.danhSachMaBanDaGan.length > 0

  if (canXacNhanThuCong(datBan)) return 0
  if (!datBanDaDuocGan && laTrangThaiDaXacNhan(datBan.status)) return 1
  if (chenhLech >= 0 && chenhLech <= 2 * 60 * 60 * 1000) return 2
  if (laDatBanDaCheckIn(datBan)) return 3
  if (laTrangThaiDaXacNhan(datBan.status)) return 4
  return 5
}

export const sapXepDatBanChoVanHanh = (danhSachDatBan, hienTai) => [...danhSachDatBan].sort((datBanTrai, datBanPhai) => {
  const doUuTienTrai = layDoUuTienDatBan(datBanTrai, hienTai)
  const doUuTienPhai = layDoUuTienDatBan(datBanPhai, hienTai)

  if (doUuTienTrai !== doUuTienPhai) {
    return doUuTienTrai - doUuTienPhai
  }

  const thoiGianTrai = phanTichNgayGioDatBan(datBanTrai.date, datBanTrai.time)?.getTime() || Number.POSITIVE_INFINITY
  const thoiGianPhai = phanTichNgayGioDatBan(datBanPhai.date, datBanPhai.time)?.getTime() || Number.POSITIVE_INFINITY

  if (thoiGianTrai !== thoiGianPhai) {
    return thoiGianTrai - thoiGianPhai
  }

  return (Number(datBanPhai.id) || 0) - (Number(datBanTrai.id) || 0)
})

export const sapXepDonHangChoVanHanh = (danhSachDonHang) => [...danhSachDonHang].sort((donHangTrai, donHangPhai) => {
  const sacThaiTrai = laySacThaiDonHang(donHangTrai.status)
  const sacThaiPhai = laySacThaiDonHang(donHangPhai.status)
  const thuHangSacThai = { warning: 0, neutral: 1, success: 2, danger: 3 }

  if (thuHangSacThai[sacThaiTrai] !== thuHangSacThai[sacThaiPhai]) {
    return thuHangSacThai[sacThaiTrai] - thuHangSacThai[sacThaiPhai]
  }

  return (Number(donHangPhai.id) || 0) - (Number(donHangTrai.id) || 0)
})
