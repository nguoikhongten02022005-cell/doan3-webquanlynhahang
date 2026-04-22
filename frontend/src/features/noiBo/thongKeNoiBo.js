import { DANH_SACH_MON } from '../thucDon/mocks/duLieuThucDon'
import { CAC_DANH_MUC_CHUAN_THUC_DON } from '../thucDon/constants/danhMucThucDon'

const chenSo0 = (giaTri) => String(giaTri).padStart(2, '0')

const chuanHoaChuoi = (giaTri = '') => String(giaTri)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')

const doanTenThuoc = (tenMon = '', danhSachTuKhoa = []) => {
  const tenDaChuanHoa = chuanHoaChuoi(tenMon)
  return danhSachTuKhoa.some((tuKhoa) => tenDaChuanHoa.includes(chuanHoaChuoi(tuKhoa)))
}

const suyRaDanhMucTuTenMon = (tenMon = '') => {
  if (doanTenThuoc(tenMon, ['combo'])) return 'Combo'
  if (doanTenThuoc(tenMon, ['ca phe', 'tra', 'nuoc ep', 'sinh to', 'cam sa', 'dao'])) return 'Đồ Uống'
  if (doanTenThuoc(tenMon, ['kem', 'banh', 'flan', 'tiramisu', 'panna cotta'])) return 'Tráng Miệng'
  if (doanTenThuoc(tenMon, ['goi', 'cha gio', 'salad', 'sup', 'súp', 'khoai'])) return 'Khai Vị'
  return 'Món Chính'
}

const taoMocBatDauNgay = (ngay) => {
  const ngaySaoChep = new Date(ngay)
  ngaySaoChep.setHours(0, 0, 0, 0)
  return ngaySaoChep
}

const laCungNgay = (ngayTrai, ngayPhai) => (
  ngayTrai.getFullYear() === ngayPhai.getFullYear()
  && ngayTrai.getMonth() === ngayPhai.getMonth()
  && ngayTrai.getDate() === ngayPhai.getDate()
)

const phanTichGiaTriNgay = (giaTri) => {
  if (!giaTri) return null
  const ngayDaPhanTich = new Date(giaTri)
  return Number.isNaN(ngayDaPhanTich.getTime()) ? null : ngayDaPhanTich
}

const laDatBanDaHuy = (datBan) => ['DA_HUY', 'Cancelled', 'KHONG_DEN', 'NoShow'].includes(datBan?.status)
const laDatBanHoanThanh = (datBan) => ['DA_HOAN_THANH', 'DA_CHECK_IN', 'Completed'].includes(datBan?.status)
const laDonHangHoanThanh = (donHang) => donHang?.status === 'Paid' || donHang?.status === 'DA_HOAN_THANH'

const locDonHangTheoKhoangThoiGian = (danhSachDonHang, khoangThoiGian) => {
  const hienTai = new Date()
  const dauNgayHomNay = taoMocBatDauNgay(hienTai)

  return danhSachDonHang.filter((donHang) => {
    const ngayDonHang = phanTichGiaTriNgay(donHang?.orderDate)
    if (!ngayDonHang) return false

    if (khoangThoiGian === 'today') return laCungNgay(ngayDonHang, hienTai)
    if (khoangThoiGian === 'last7Days') {
      const mocBatDau = taoMocBatDauNgay(new Date(hienTai.getFullYear(), hienTai.getMonth(), hienTai.getDate() - 6))
      return ngayDonHang >= mocBatDau && ngayDonHang <= hienTai
    }
    if (khoangThoiGian === 'last30Days') {
      const mocBatDau = taoMocBatDauNgay(new Date(hienTai.getFullYear(), hienTai.getMonth(), hienTai.getDate() - 29))
      return ngayDonHang >= mocBatDau && ngayDonHang <= hienTai
    }
    if (khoangThoiGian === 'thisMonth') {
      return ngayDonHang.getFullYear() === hienTai.getFullYear() && ngayDonHang.getMonth() === hienTai.getMonth()
    }

    return ngayDonHang >= dauNgayHomNay
  })
}

const locDatBanTheoKhoangThoiGian = (danhSachDatBan, khoangThoiGian) => {
  const hienTai = new Date()
  return danhSachDatBan.filter((datBan) => {
    const ngayDatBan = phanTichGiaTriNgay(datBan?.date)
    if (!ngayDatBan) return false

    if (khoangThoiGian === 'today') return laCungNgay(ngayDatBan, hienTai)
    if (khoangThoiGian === 'last7Days') {
      const mocBatDau = taoMocBatDauNgay(new Date(hienTai.getFullYear(), hienTai.getMonth(), hienTai.getDate() - 6))
      return ngayDatBan >= mocBatDau && ngayDatBan <= hienTai
    }
    if (khoangThoiGian === 'last30Days') {
      const mocBatDau = taoMocBatDauNgay(new Date(hienTai.getFullYear(), hienTai.getMonth(), hienTai.getDate() - 29))
      return ngayDatBan >= mocBatDau && ngayDatBan <= hienTai
    }
    if (khoangThoiGian === 'thisMonth') {
      return ngayDatBan.getFullYear() === hienTai.getFullYear() && ngayDatBan.getMonth() === hienTai.getMonth()
    }

    return false
  })
}

const taoChuoiDoanhThu = (danhSachDonHang = []) => {
  const homNay = taoMocBatDauNgay(new Date())

  return Array.from({ length: 7 }, (_, chiSo) => {
    const ngay = new Date(homNay)
    ngay.setDate(homNay.getDate() - (6 - chiSo))

    const doanhThuNgay = danhSachDonHang.reduce((tongDoanhThu, donHang) => {
      const ngayDonHang = phanTichGiaTriNgay(donHang?.orderDate)
      if (!ngayDonHang || !laCungNgay(ngayDonHang, ngay)) return tongDoanhThu
      return tongDoanhThu + (Number(donHang?.total) || 0)
    }, 0)

    return {
      label: `${chenSo0(ngay.getDate())}/${chenSo0(ngay.getMonth() + 1)}`,
      revenue: doanhThuNgay,
    }
  })
}

const taoTopMonBanChay = (danhSachDonHang = []) => {
  const banDoMon = new Map()

  danhSachDonHang.forEach((donHang) => {
    ;(donHang?.items || []).forEach((chiTietMon) => {
      const soLuong = Number(chiTietMon?.quantity) || 0
      const donGia = Number(chiTietMon?.price) || 0
      const doanhThu = soLuong * donGia
      const khoaMon = chiTietMon?.menuItemId || chiTietMon?.name || chiTietMon?.id || 'dish'

      if (!banDoMon.has(khoaMon)) {
        banDoMon.set(khoaMon, {
          id: khoaMon,
          name: chiTietMon?.name || 'Món chưa đặt tên',
          quantity: 0,
          revenue: 0,
        })
      }

      const monHienTai = banDoMon.get(khoaMon)
      monHienTai.quantity += soLuong
      monHienTai.revenue += doanhThu
    })
  })

  if (banDoMon.size === 0) {
    return DANH_SACH_MON.slice(0, 5).map((mon, chiSo) => ({
      id: mon.id,
      rank: chiSo + 1,
      name: mon.name,
      quantity: 0,
      revenue: 0,
      percent: 0,
    }))
  }

  const danhSachMonSapXep = [...banDoMon.values()]
    .sort((monTrai, monPhai) => monPhai.revenue - monTrai.revenue || monPhai.quantity - monTrai.quantity)
    .slice(0, 5)
  const tongDoanhThuTop = danhSachMonSapXep.reduce((tongDoanhThu, mon) => tongDoanhThu + mon.revenue, 0)

  return danhSachMonSapXep.map((mon, chiSo) => ({
    ...mon,
    rank: chiSo + 1,
    percent: tongDoanhThuTop > 0 ? Math.round((mon.revenue / tongDoanhThuTop) * 100) : 0,
  }))
}

const taoTyTrongDanhMuc = (danhSachDonHang = []) => {
  const traCuuMonTheoId = new Map(DANH_SACH_MON.map((mon) => [String(mon.id), mon]))
  const traCuuMonTheoTen = new Map(DANH_SACH_MON.map((mon) => [chuanHoaChuoi(mon.name), mon]))
  const doanhThuTheoDanhMuc = new Map(CAC_DANH_MUC_CHUAN_THUC_DON.map((danhMuc) => [danhMuc, 0]))

  danhSachDonHang.forEach((donHang) => {
    ;(donHang?.items || []).forEach((chiTietMon) => {
      const doanhThu = (Number(chiTietMon?.quantity) || 0) * (Number(chiTietMon?.price) || 0)
      const monPhuHop = traCuuMonTheoId.get(String(chiTietMon?.menuItemId || chiTietMon?.id || ''))
        || traCuuMonTheoTen.get(chuanHoaChuoi(chiTietMon?.name || ''))
      const danhMuc = monPhuHop?.category || monPhuHop?.danhMuc || suyRaDanhMucTuTenMon(chiTietMon?.name || '')
      if (!doanhThuTheoDanhMuc.has(danhMuc)) return
      doanhThuTheoDanhMuc.set(danhMuc, doanhThuTheoDanhMuc.get(danhMuc) + doanhThu)
    })
  })

  const tongDoanhThu = [...doanhThuTheoDanhMuc.values()].reduce((tong, giaTri) => tong + giaTri, 0)

  return CAC_DANH_MUC_CHUAN_THUC_DON.map((danhMuc) => ({
    category: danhMuc,
    percent: tongDoanhThu > 0 ? Math.round(((doanhThuTheoDanhMuc.get(danhMuc) || 0) / tongDoanhThu) * 100) : 0,
  }))
}

export const NOI_BO_THONG_KE_KHOANG_THOI_GIAN = Object.freeze([
  { key: 'today', label: 'Hôm nay' },
  { key: 'last7Days', label: '7 ngày' },
  { key: 'last30Days', label: '30 ngày' },
  { key: 'thisMonth', label: 'Tháng này' },
])

export const taoDuLieuThongKeDoanhThu = ({ orders: danhSachDonHangNguon = [], bookings: danhSachDatBanNguon = [], timeRange: khoangThoiGian = 'today' } = {}) => {
  const danhSachDonHangDaLoc = locDonHangTheoKhoangThoiGian(danhSachDonHangNguon, khoangThoiGian)
  const danhSachDatBanDaLoc = locDatBanTheoKhoangThoiGian(danhSachDatBanNguon, khoangThoiGian)
  const tongDoanhThu = danhSachDonHangDaLoc.reduce((tong, donHang) => tong + (Number(donHang?.total) || 0), 0)
  const soDonHoanThanh = danhSachDonHangDaLoc.filter((donHang) => laDonHangHoanThanh(donHang)).length
  const giaTriTrungBinh = danhSachDonHangDaLoc.length > 0 ? Math.round(tongDoanhThu / danhSachDonHangDaLoc.length) : 0
  const revenueSeries = taoChuoiDoanhThu(danhSachDonHangDaLoc)
  const giaTriLonNhat = Math.max(...revenueSeries.map((mucDoanhThu) => mucDoanhThu.revenue), 1)
  const topDishes = taoTopMonBanChay(danhSachDonHangDaLoc)
  const categoryShares = taoTyTrongDanhMuc(danhSachDonHangDaLoc)
  const totalBookings = danhSachDatBanDaLoc.length
  const completedBookings = danhSachDatBanDaLoc.filter(laDatBanHoanThanh).length
  const cancelledBookings = danhSachDatBanDaLoc.filter(laDatBanDaHuy).length

  return {
    overview: {
      revenue: tongDoanhThu,
      completedOrders: soDonHoanThanh,
      averageOrder: giaTriTrungBinh,
      totalBookings,
    },
    revenueSeries,
    topDishes,
    categoryShares,
    peakRevenue: giaTriLonNhat,
    bookingStats: {
      total: totalBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
      cancellationRate: totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0,
    },
  }
}
