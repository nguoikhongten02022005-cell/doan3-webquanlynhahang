import { DANH_SACH_MON } from '../thucDon/mocks/duLieuThucDon'
import { CAC_DANH_MUC_CHUAN_THUC_DON } from '../thucDon/constants/danhMucThucDon'

const pad = (value) => String(value).padStart(2, '0')

const chuanHoaChuoi = (value = '') => String(value)
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

const taoMocBatDauNgay = (date) => {
  const clone = new Date(date)
  clone.setHours(0, 0, 0, 0)
  return clone
}

const laCungNgay = (left, right) => (
  left.getFullYear() === right.getFullYear()
  && left.getMonth() === right.getMonth()
  && left.getDate() === right.getDate()
)

const parseDateValue = (value) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const isBookingCancelled = (booking) => ['DA_HUY', 'Cancelled', 'KHONG_DEN', 'NoShow'].includes(booking?.status)
const isBookingCompleted = (booking) => ['DA_HOAN_THANH', 'DA_CHECK_IN', 'Completed'].includes(booking?.status)
const isOrderCompleted = (order) => order?.status === 'Paid' || order?.status === 'DA_HOAN_THANH'

const filterOrdersByTimeRange = (orders, timeRange) => {
  const now = new Date()
  const startToday = taoMocBatDauNgay(now)

  return orders.filter((order) => {
    const orderDate = parseDateValue(order?.orderDate)
    if (!orderDate) return false

    if (timeRange === 'today') return laCungNgay(orderDate, now)
    if (timeRange === 'last7Days') {
      const rangeStart = taoMocBatDauNgay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6))
      return orderDate >= rangeStart && orderDate <= now
    }
    if (timeRange === 'last30Days') {
      const rangeStart = taoMocBatDauNgay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29))
      return orderDate >= rangeStart && orderDate <= now
    }
    if (timeRange === 'thisMonth') {
      return orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === now.getMonth()
    }

    return orderDate >= startToday
  })
}

const filterBookingsByTimeRange = (bookings, timeRange) => {
  const now = new Date()
  return bookings.filter((booking) => {
    const bookingDate = parseDateValue(booking?.date)
    if (!bookingDate) return false

    if (timeRange === 'today') return laCungNgay(bookingDate, now)
    if (timeRange === 'last7Days') {
      const rangeStart = taoMocBatDauNgay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6))
      return bookingDate >= rangeStart && bookingDate <= now
    }
    if (timeRange === 'last30Days') {
      const rangeStart = taoMocBatDauNgay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29))
      return bookingDate >= rangeStart && bookingDate <= now
    }
    if (timeRange === 'thisMonth') {
      return bookingDate.getFullYear() === now.getFullYear() && bookingDate.getMonth() === now.getMonth()
    }

    return false
  })
}

const buildRevenueSeries = (orders = []) => {
  const today = taoMocBatDauNgay(new Date())

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today)
    day.setDate(today.getDate() - (6 - index))

    const revenueFromOrders = orders.reduce((sum, order) => {
      const orderDate = parseDateValue(order?.orderDate)
      if (!orderDate || !laCungNgay(orderDate, day)) return sum
      return sum + (Number(order?.total) || 0)
    }, 0)

    return {
      label: `${pad(day.getDate())}/${pad(day.getMonth() + 1)}`,
      revenue: revenueFromOrders,
    }
  })
}

const buildTopDishes = (orders = []) => {
  const dishMap = new Map()

  orders.forEach((order) => {
    ;(order?.items || []).forEach((item) => {
      const quantity = Number(item?.quantity) || 0
      const price = Number(item?.price) || 0
      const revenue = quantity * price
      const key = item?.menuItemId || item?.name || item?.id || 'dish'

      if (!dishMap.has(key)) {
        dishMap.set(key, {
          id: key,
          name: item?.name || 'Món chưa đặt tên',
          quantity: 0,
          revenue: 0,
        })
      }

      const current = dishMap.get(key)
      current.quantity += quantity
      current.revenue += revenue
    })
  })

  if (dishMap.size === 0) {
    return DANH_SACH_MON.slice(0, 5).map((dish, index) => ({
      id: dish.id,
      rank: index + 1,
      name: dish.name,
      quantity: 0,
      revenue: 0,
      percent: 0,
    }))
  }

  const sorted = [...dishMap.values()].sort((left, right) => right.revenue - left.revenue || right.quantity - left.quantity).slice(0, 5)
  const totalRevenue = sorted.reduce((sum, item) => sum + item.revenue, 0)

  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
    percent: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0,
  }))
}

const buildCategoryShares = (orders = []) => {
  const dishLookup = new Map(DANH_SACH_MON.map((dish) => [String(dish.id), dish]))
  const dishNameLookup = new Map(DANH_SACH_MON.map((dish) => [chuanHoaChuoi(dish.name), dish]))
  const categoryRevenueMap = new Map(CAC_DANH_MUC_CHUAN_THUC_DON.map((category) => [category, 0]))

  orders.forEach((order) => {
    ;(order?.items || []).forEach((item) => {
      const revenue = (Number(item?.quantity) || 0) * (Number(item?.price) || 0)
      const matchedDish = dishLookup.get(String(item?.menuItemId || item?.id || '')) || dishNameLookup.get(chuanHoaChuoi(item?.name || ''))
      const category = matchedDish?.category || matchedDish?.danhMuc || suyRaDanhMucTuTenMon(item?.name || '')
      if (!categoryRevenueMap.has(category)) return
      categoryRevenueMap.set(category, categoryRevenueMap.get(category) + revenue)
    })
  })

  const totalRevenue = [...categoryRevenueMap.values()].reduce((sum, value) => sum + value, 0)

  return CAC_DANH_MUC_CHUAN_THUC_DON.map((category) => ({
    category,
    percent: totalRevenue > 0 ? Math.round(((categoryRevenueMap.get(category) || 0) / totalRevenue) * 100) : 0,
  }))
}

export const NOI_BO_THONG_KE_KHOANG_THOI_GIAN = Object.freeze([
  { key: 'today', label: 'Hôm nay' },
  { key: 'last7Days', label: '7 ngày' },
  { key: 'last30Days', label: '30 ngày' },
  { key: 'thisMonth', label: 'Tháng này' },
])

export const taoDuLieuThongKeDoanhThu = ({ orders = [], bookings = [], timeRange = 'today' } = {}) => {
  const filteredOrders = filterOrdersByTimeRange(orders, timeRange)
  const filteredBookings = filterBookingsByTimeRange(bookings, timeRange)
  const tongDoanhThu = filteredOrders.reduce((sum, order) => sum + (Number(order?.total) || 0), 0)
  const soDonHoanThanh = filteredOrders.filter((order) => isOrderCompleted(order)).length
  const giaTriTrungBinh = filteredOrders.length > 0 ? Math.round(tongDoanhThu / filteredOrders.length) : 0
  const revenueSeries = buildRevenueSeries(filteredOrders)
  const giaTriLonNhat = Math.max(...revenueSeries.map((item) => item.revenue), 1)
  const topDishes = buildTopDishes(filteredOrders)
  const categoryShares = buildCategoryShares(filteredOrders)
  const totalBookings = filteredBookings.length
  const completedBookings = filteredBookings.filter(isBookingCompleted).length
  const cancelledBookings = filteredBookings.filter(isBookingCancelled).length

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
