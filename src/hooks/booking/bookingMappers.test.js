import test from 'node:test'
import assert from 'node:assert/strict'
import { mapBookingItem, normalizeBooking } from './bookingMappers.js'

test('normalizeBooking keeps canonical booking entity shape', () => {
  const booking = normalizeBooking({
    id: '42',
    bookingCode: 'DB-000042',
    guests: '4',
    date: '2026-03-20',
    time: '19:30',
    seatingArea: 'PHONG_VIP',
    notes: 'Gần cửa sổ',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'a@example.com',
    status: 'DA_XAC_NHAN',
  })

  assert.deepEqual(booking, {
    id: 42,
    bookingCode: 'DB-000042',
    guests: '4',
    date: '2026-03-20',
    time: '19:30',
    seatingArea: 'PHONG_VIP',
    notes: 'Gần cửa sổ',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'a@example.com',
    status: 'DA_XAC_NHAN',
    source: 'web',
    createdAt: '',
    updatedAt: '',
    userEmail: null,
    occasion: '',
    confirmationChannel: [],
    internalNote: '',
    assignedTableIds: [],
    assignedTables: [],
    checkedInAt: '',
    seatedAt: '',
    completedAt: '',
    cancelledAt: '',
    noShowAt: '',
    createdBy: '',
  })
})

test('mapBookingItem returns profile-friendly booking history shape', () => {
  const result = mapBookingItem({
    id: 42,
    bookingCode: 'DB-000042',
    guests: '4',
    date: '2026-03-20',
    time: '19:30',
    seatingArea: 'PHONG_VIP',
    status: 'DA_XAC_NHAN',
  })

  assert.deepEqual(result, {
    bookingId: 42,
    id: 'DB-000042',
    dateTime: '20/03/2026 19:30',
    guests: 4,
    seatingArea: 'Phòng riêng / VIP',
    rawStatus: 'DA_XAC_NHAN',
    status: '🟢 Đã xác nhận',
  })
})
