// TODO: Replace these profile history mocks with real profile APIs when backend endpoints are available.

export const BOOKINGS_HO_SO_MOCK = [
  {
    bookingCode: '#NV20250325001',
    date: '2026-03-25',
    time: '18:00',
    guestCount: 4,
    area: 'Sảnh chính',
    statusLabel: 'Đã xác nhận',
    statusTone: 'success',
    rawStatus: 'DA_XAC_NHAN',
  },
  {
    bookingCode: '#NV20250320002',
    date: '2026-03-20',
    time: '11:00',
    guestCount: 2,
    area: 'Ngoài trời',
    statusLabel: 'Hoàn thành',
    statusTone: 'neutral',
    rawStatus: 'DA_HOAN_THANH',
  },
  {
    bookingCode: '#NV20250315003',
    date: '2026-03-15',
    time: '17:00',
    guestCount: 6,
    area: 'Phòng VIP',
    statusLabel: 'Đã hủy',
    statusTone: 'danger',
    rawStatus: 'DA_HUY',
  },
]

// TODO: Replace these profile order mocks with the real order history API response.
export const DON_HANG_HO_SO_MOCK = [
  {
    orderCode: '#DH20250325001',
    date: '2026-03-25',
    time: '19:30',
    itemCount: 3,
    total: 875000,
    statusLabel: 'Hoàn thành',
    statusTone: 'neutral',
    rawStatus: 'DA_HOAN_THANH',
    items: [
      { id: 'dh1-item1', name: 'Bò lúc lắc khoai tây', quantity: 1, price: 365000 },
      { id: 'dh1-item2', name: 'Salad cá hồi sốt cam', quantity: 1, price: 210000 },
      { id: 'dh1-item3', name: 'Trà vải hoa hồng', quantity: 1, price: 300000 },
    ],
  },
  {
    orderCode: '#DH20250320002',
    date: '2026-03-20',
    time: '12:00',
    itemCount: 2,
    total: 460000,
    statusLabel: 'Đang xử lý',
    statusTone: 'warning',
    rawStatus: 'DANG_XU_LY',
    items: [
      { id: 'dh2-item1', name: 'Mì Ý bò bằm sốt cà', quantity: 1, price: 240000 },
      { id: 'dh2-item2', name: 'Nước ép cam tươi', quantity: 1, price: 220000 },
    ],
  },
]
