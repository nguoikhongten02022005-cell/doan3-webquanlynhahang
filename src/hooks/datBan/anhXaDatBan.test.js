import test from 'node:test'
import assert from 'node:assert/strict'
import { anhXaMucDatBan, chuanHoaDatBan } from './anhXaDatBan.js'

test('chuanHoaDatBan giu dung cau truc dat ban chuan', () => {
  const datBan = chuanHoaDatBan({
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

  assert.deepEqual(datBan, {
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

test('anhXaMucDatBan tra ve cau truc lich su dat ban than thien', () => {
  const ketQua = anhXaMucDatBan({
    id: 42,
    bookingCode: 'DB-000042',
    guests: '4',
    date: '2026-03-20',
    time: '19:30',
    seatingArea: 'PHONG_VIP',
    status: 'DA_XAC_NHAN',
  })

  assert.deepEqual(ketQua, {
    bookingId: 42,
    id: 'DB-000042',
    bookingCode: 'DB-000042',
    date: '2026-03-20',
    time: '19:30',
    guestCount: 4,
    area: 'Khu riêng / VIP',
    dateTime: '20/03/2026 19:30',
    guests: 4,
    seatingArea: 'Khu riêng / VIP',
    rawStatus: 'DA_XAC_NHAN',
    status: '🟢 Đã xác nhận',
    statusLabel: 'Đã xác nhận',
    statusTone: 'warning',
  })
})
