export const PROFILE_TABS = [
  { key: 'personal', label: 'Thông tin cá nhân' },
  { key: 'orders', label: 'Lịch sử đơn hàng' },
  { key: 'bookings', label: 'Lịch sử đặt bàn' },
]

export const ORDER_TIMELINE_STEPS = ['Mới đặt', 'Bếp làm món', 'Đang giao', 'Hoàn tất']

export const FALLBACK_PROFILE = {
  name: 'Nguyễn Văn Minh',
  email: 'minh.nguyen@example.com',
  phone: '0901 234 567',
}

export const FALLBACK_ORDERS = [
  {
    id: 'DH-1001',
    date: '04/03/2026',
    total: 525000,
    status: 'Đang giao',
  },
  {
    id: 'DH-0995',
    date: '01/03/2026',
    total: 760000,
    status: 'Đã hoàn thành',
  },
  {
    id: 'DH-0988',
    date: '27/02/2026',
    total: 345000,
    status: 'Đang xử lý',
  },
]
