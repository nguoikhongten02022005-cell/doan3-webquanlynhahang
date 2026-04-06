import { DANH_SACH_MON } from '../../data/duLieuThucDon'
import { CAC_DANH_MUC_CHUAN_THUC_DON } from '../../constants/danhMucThucDon'
import { TAI_KHOAN_NOI_BO_DEMO } from '../../constants/xacThucDemo'
import { TRANG_THAI_BAN } from '../../services/dichVuBanAn'

export const ADMIN_TIME_RANGE_OPTIONS = Object.freeze([
  { key: 'today', label: 'Hôm nay' },
  { key: 'last7Days', label: '7 ngày' },
  { key: 'last30Days', label: '30 ngày' },
  { key: 'thisMonth', label: 'Tháng này' },
])

export const ADMIN_NOTIFICATION_COUNT = 4

export const ADMIN_REVENUE_SERIES = Object.freeze([
  { label: 'T2', revenue: 5200000 },
  { label: 'T3', revenue: 6100000 },
  { label: 'T4', revenue: 4900000 },
  { label: 'T5', revenue: 7200000 },
  { label: 'T6', revenue: 8300000 },
  { label: 'T7', revenue: 9100000 },
  { label: 'CN', revenue: 7600000 },
])

const ADMIN_TABLE_LAYOUT = [
  { areaId: 'SANH_CHINH', total: 12, capacities: [2, 4, 4, 6, 2, 4, 4, 6, 2, 4, 6, 8] },
  { areaId: 'PHONG_VIP', total: 4, capacities: [6, 8, 10, 12] },
  { areaId: 'BAN_CONG', total: 6, capacities: [2, 2, 4, 4, 6, 6] },
  { areaId: 'QUAY_BAR', total: 5, capacities: [2, 2, 2, 2, 4] },
]

const pad = (value) => String(value).padStart(2, '0')
const formatDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`

const SLOT_HOP_LE = [
  '11:00', '12:00', '13:00',
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
]

const chonSlotHopLeGanNhat = (gioHienTai = new Date()) => {
  const now = new Date(gioHienTai)
  now.setSeconds(0, 0)
  const gio = now.getHours()
  const phut = now.getMinutes() >= 30 ? 1 : 0
  // chọn slot sắp tới trong ngày nếu còn, nếu không lấy slot đầu ngày hôm sau
  const slotsToday = SLOT_HOP_LE.filter((slot) => {
    const [h, m] = slot.split(':').map(Number)
    return h > gio || (h === gio && m >= (phut ? 30 : 0))
  })
  const slotChon = slotsToday[0] || SLOT_HOP_LE[0]
  return slotChon
}

const taoMocThoiGianHopLe = (hourOffset) => {
  const base = new Date(Date.now() + hourOffset * 60 * 60 * 1000)
  const slot = chonSlotHopLeGanNhat(base)
  const [h, m] = slot.split(':').map(Number)
  base.setHours(h, m, 0, 0)
  return {
    date: formatDate(base),
    time: formatTime(base),
  }
}

export const taoDuLieuNoiBoDuPhong = () => {
  let sequence = 1

  const tables = ADMIN_TABLE_LAYOUT.flatMap((area) => (
    Array.from({ length: area.total }, (_, index) => ({
      id: `mock-table-${sequence}`,
      code: `T${sequence++}`,
      name: `Bàn ${sequence - 1}`,
      areaId: area.areaId,
      capacity: area.capacities[index] || 4,
      activeBookingId: null,
      activeBookingCode: '',
      note: area.areaId === 'PHONG_VIP' ? 'Ưu tiên khách đặt trước' : '',
      status: TRANG_THAI_BAN.TRONG,
    }))
  ))

  const timBan = (code) => tables.find((table) => table.code === code)
  const slotSoon = taoMocThoiGianHopLe(1)
  const slotConfirmed = taoMocThoiGianHopLe(3)
  const slotServing = taoMocThoiGianHopLe(-1)
  const slotVip = taoMocThoiGianHopLe(5)
  const slotTomorrow = taoMocThoiGianHopLe(26)

  const tableHeld = timBan('T2')
  const tableServing = timBan('T5')
  const tableDirty = timBan('T7')

  if (tableHeld) {
    tableHeld.status = TRANG_THAI_BAN.GIU_CHO
    tableHeld.activeBookingId = 'mock-booking-2'
    tableHeld.activeBookingCode = '#NV002'
  }

  if (tableServing) {
    tableServing.status = TRANG_THAI_BAN.DANG_SU_DUNG
    tableServing.activeBookingId = 'mock-booking-3'
    tableServing.activeBookingCode = '#NV003'
  }

  if (tableDirty) {
    tableDirty.status = TRANG_THAI_BAN.BAN
  }

  const bookings = [
    {
      id: 'mock-booking-1',
      bookingCode: '#NV001',
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'vana@example.com',
      guests: '4',
      date: slotSoon.date,
      time: slotSoon.time,
      seatingArea: 'SANH_CHINH',
      notes: 'Bàn gần cửa sổ',
      internalNote: 'Ưu tiên gọi xác nhận lại.',
      status: 'CHO_XAC_NHAN',
      source: 'web',
      confirmationChannel: ['SMS'],
      assignedTableIds: [],
      assignedTables: [],
    },
    {
      id: 'mock-booking-2',
      bookingCode: '#NV002',
      name: 'Trần Thị B',
      phone: '0902345678',
      email: 'thib@example.com',
      guests: '2',
      date: slotConfirmed.date,
      time: slotConfirmed.time,
      seatingArea: 'SANH_CHINH',
      notes: 'Khách quen',
      internalNote: 'Đã chốt bàn qua điện thoại.',
      status: 'DA_XAC_NHAN',
      source: 'internal',
      confirmationChannel: ['SMS', 'Zalo'],
      assignedTableIds: tableHeld ? [tableHeld.id] : [],
      assignedTables: tableHeld ? [{ id: tableHeld.id, code: tableHeld.code }] : [],
    },
    {
      id: 'mock-booking-3',
      bookingCode: '#NV003',
      name: 'Lê Minh C',
      phone: '0903456789',
      email: 'minhc@example.com',
      guests: '6',
      date: slotServing.date,
      time: slotServing.time,
      seatingArea: 'PHONG_VIP',
      notes: 'Tiếp khách công việc',
      internalNote: 'Đã check-in, ưu tiên yên tĩnh.',
      status: 'DA_CHECK_IN',
      source: 'web',
      confirmationChannel: ['Email'],
      assignedTableIds: tableServing ? [tableServing.id] : [],
      assignedTables: tableServing ? [{ id: tableServing.id, code: tableServing.code }] : [],
    },
    {
      id: 'mock-booking-4',
      bookingCode: '#NV004',
      name: 'Phạm Gia D',
      phone: '0904567890',
      email: 'giad@example.com',
      guests: '8',
      date: slotVip.date,
      time: slotVip.time,
      seatingArea: 'PHONG_VIP',
      notes: 'Yêu cầu set menu trước',
      internalNote: 'Cần quản lý duyệt thủ công.',
      status: 'CAN_GOI_LAI',
      source: 'internal',
      confirmationChannel: ['Phone'],
      assignedTableIds: [],
      assignedTables: [],
    },
    {
      id: 'mock-booking-5',
      bookingCode: '#NV005',
      name: 'Hoàng Anh E',
      phone: '0905678901',
      email: 'anhe@example.com',
      guests: '3',
      date: slotTomorrow.date,
      time: slotTomorrow.time,
      seatingArea: 'BAN_CONG',
      notes: 'Đi cùng trẻ nhỏ',
      internalNote: '',
      status: 'DA_GHI_NHAN',
      source: 'web',
      confirmationChannel: ['SMS'],
      assignedTableIds: [],
      assignedTables: [],
    },
  ]

  const orders = [
    {
      id: 'mock-order-1',
      orderCode: 'DH-20260326001',
      status: 'MOI_TAO',
      orderDate: new Date().toISOString(),
      total: 485000,
      subtotal: 485000,
      discountAmount: 0,
      paymentMethod: 'TienMat',
      note: 'Thêm ít đá cho đồ uống.',
      tableNumber: tableServing?.code || 'T5',
      customer: {
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'vana@example.com',
      },
      items: [
        { id: 'mock-order-1-item-1', name: 'Lẩu bò premium', quantity: 1, price: 325000, size: 'L', note: 'Ít cay' },
        { id: 'mock-order-1-item-2', name: 'Trà đào cam sả', quantity: 2, price: 80000, size: 'M', note: '' },
      ],
    },
    {
      id: 'mock-order-2',
      orderCode: 'DH-20260326002',
      status: 'DANG_CHUAN_BI',
      orderDate: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      total: 920000,
      subtotal: 920000,
      discountAmount: 0,
      paymentMethod: 'CHUYEN_KHOAN',
      note: 'Ưu tiên ra món chính trước.',
      tableNumber: 'T2',
      customer: {
        fullName: 'Trần Thị B',
        phone: '0902345678',
        email: 'thib@example.com',
      },
      items: [
        { id: 'mock-order-2-item-1', name: 'Bít tết bò Úc', quantity: 2, price: 310000, size: 'M', note: 'Chín vừa' },
        { id: 'mock-order-2-item-2', name: 'Salad cá hồi', quantity: 1, price: 180000, size: 'M', note: '' },
        { id: 'mock-order-2-item-3', name: 'Soda yuzu', quantity: 2, price: 60000, size: 'M', note: '' },
      ],
    },
    {
      id: 'mock-order-3',
      orderCode: 'DH-20260326003',
      status: 'DA_HOAN_THANH',
      orderDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      total: 1280000,
      subtotal: 1380000,
      discountAmount: 100000,
      paymentMethod: 'THE',
      note: 'Khách dùng voucher sinh nhật.',
      tableNumber: 'T11',
      customer: {
        fullName: 'Lê Minh C',
        phone: '0903456789',
        email: 'minhc@example.com',
      },
      items: [
        { id: 'mock-order-3-item-1', name: 'Set hải sản nướng', quantity: 1, price: 890000, size: 'L', note: '' },
        { id: 'mock-order-3-item-2', name: 'Rượu vang đỏ house', quantity: 1, price: 390000, size: 'Bottle', note: '' },
      ],
    },
  ]

  const accounts = [
    ...TAI_KHOAN_NOI_BO_DEMO.map((account) => ({
      fullName: account.user.fullName,
      username: account.user.username,
      email: account.user.email,
      phone: account.user.phone,
      role: account.user.role,
    })),
    {
      fullName: 'Thu ngân Demo',
      username: 'thungan',
      email: 'cashier@nguyenvi.vn',
      phone: '0909000003',
      role: 'staff',
    },
  ]

  return {
    bookings,
    orders,
    accounts,
    tables,
  }
}

const parseDateValue = (value) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
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

const isBookingCancelled = (booking) => ['DA_HUY', 'Cancelled', 'KHONG_DEN', 'NoShow'].includes(booking?.status)
const isBookingCompleted = (booking) => ['DA_HOAN_THANH', 'DA_CHECK_IN', 'Completed'].includes(booking?.status)
const isOrderCompleted = (order) => order?.status === 'Paid' || order?.status === 'DA_HOAN_THANH'

const filterOrdersByTimeRange = (orders, timeRange) => {
  const now = new Date()
  const startToday = taoMocBatDauNgay(now)

  return orders.filter((order) => {
    const orderDate = parseDateValue(order?.orderDate)
    if (!orderDate) return false

    if (timeRange === 'today') {
      return laCungNgay(orderDate, now)
    }

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

    if (timeRange === 'today') {
      return laCungNgay(bookingDate, now)
    }

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
  const fallbackSeries = ADMIN_REVENUE_SERIES.map((item) => item.revenue)

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today)
    day.setDate(today.getDate() - (6 - index))

    const revenueFromOrders = orders.reduce((sum, order) => {
      const orderDate = parseDateValue(order?.orderDate)
      if (!orderDate || !laCungNgay(orderDate, day)) return sum
      return sum + (Number(order?.total) || 0)
    }, 0)

    const revenue = revenueFromOrders > 0 ? revenueFromOrders : fallbackSeries[index]

    return {
      label: `${pad(day.getDate())}/${pad(day.getMonth() + 1)}`,
      revenue,
    }
  })
}

const buildTopDishes = (orders = []) => {
  const dishMap = new Map()

  orders.forEach((order) => {
    ;(order?.items || []).forEach((item, index) => {
      const quantity = Number(item?.quantity) || 0
      const price = Number(item?.price) || 0
      const revenue = quantity * price
      const key = item?.id || `${item?.name || 'dish'}-${index}`

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

  const sorted = [...dishMap.values()]
    .sort((left, right) => right.revenue - left.revenue || right.quantity - left.quantity)
    .slice(0, 5)

  const totalRevenue = sorted.reduce((sum, item) => sum + item.revenue, 0)

  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1,
    percent: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0,
  }))
}

const buildCategoryShares = (topDishes = []) => {
  const dishLookup = new Map(DANH_SACH_MON.map((dish) => [String(dish.id), dish]))
  const categoryRevenueMap = new Map(CAC_DANH_MUC_CHUAN_THUC_DON.map((category) => [category, 0]))

  topDishes.forEach((dish) => {
    const matchedDish = dishLookup.get(String(dish.id)) || DANH_SACH_MON.find((item) => item.name === dish.name)
    const category = matchedDish?.category
    if (!categoryRevenueMap.has(category)) return
    categoryRevenueMap.set(category, categoryRevenueMap.get(category) + dish.revenue)
  })

  const totalRevenue = [...categoryRevenueMap.values()].reduce((sum, value) => sum + value, 0)

  return CAC_DANH_MUC_CHUAN_THUC_DON.map((category) => {
    const revenue = categoryRevenueMap.get(category) || 0
    return {
      category,
      percent: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0,
    }
  })
}

export const taoDuLieuThongKeDoanhThu = ({ orders = [], bookings = [], timeRange = 'today' } = {}) => {
  const filteredOrders = filterOrdersByTimeRange(orders, timeRange)
  const filteredBookings = filterBookingsByTimeRange(bookings, timeRange)
  const tongDoanhThu = filteredOrders.reduce((sum, order) => sum + (Number(order?.total) || 0), 0)
  const soDonHoanThanh = filteredOrders.filter((order) => isOrderCompleted(order)).length
  const giaTriTrungBinh = filteredOrders.length > 0 ? Math.round(tongDoanhThu / filteredOrders.length) : 0
  const revenueSeries = buildRevenueSeries(filteredOrders)
  const giaTriLonNhat = Math.max(...revenueSeries.map((item) => item.revenue), 1)
  const topDishes = buildTopDishes(filteredOrders)
  const categoryShares = buildCategoryShares(topDishes)
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
