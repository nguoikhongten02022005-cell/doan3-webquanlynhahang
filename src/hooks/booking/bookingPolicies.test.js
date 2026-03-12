import test from 'node:test'
import assert from 'node:assert/strict'
import {
  INTERNAL_BOOKING_CREATE_STATUSES,
  canManuallyTransitionBooking,
  validateAssignedTables,
} from './bookingPolicies.js'

const sampleTables = [
  {
    id: 'VIP-01',
    code: 'VIP-01',
    areaId: 'PHONG_VIP',
    capacity: 4,
    status: 'AVAILABLE',
    activeBookingId: null,
  },
  {
    id: 'VIP-02',
    code: 'VIP-02',
    areaId: 'PHONG_VIP',
    capacity: 2,
    status: 'DIRTY',
    activeBookingId: null,
  },
  {
    id: 'SC-01',
    code: 'SC-01',
    areaId: 'SANH_CHINH',
    capacity: 6,
    status: 'AVAILABLE',
    activeBookingId: null,
  },
]

test('INTERNAL_BOOKING_CREATE_STATUSES only allows configured initial statuses', () => {
  assert.equal(INTERNAL_BOOKING_CREATE_STATUSES.has('CHO_XAC_NHAN'), true)
  assert.equal(INTERNAL_BOOKING_CREATE_STATUSES.has('DA_XAC_NHAN'), true)
  assert.equal(INTERNAL_BOOKING_CREATE_STATUSES.has('CAN_GOI_LAI'), true)
  assert.equal(INTERNAL_BOOKING_CREATE_STATUSES.has('DA_CHECK_IN'), false)
  assert.equal(INTERNAL_BOOKING_CREATE_STATUSES.has('DA_HOAN_THANH'), false)
})

test('validateAssignedTables accepts matching area and sufficient combined capacity', () => {
  const result = validateAssignedTables({
    assignedTableIds: ['VIP-01'],
    tables: sampleTables,
    guestCount: 4,
    preferredArea: 'PHONG_VIP',
    bookingId: 99,
  })

  assert.deepEqual(result, { success: true })
})

test('validateAssignedTables rejects dirty or wrong-area table assignments', () => {
  const dirtyResult = validateAssignedTables({
    assignedTableIds: ['VIP-02'],
    tables: sampleTables,
    guestCount: 2,
    preferredArea: 'PHONG_VIP',
    bookingId: 99,
  })

  assert.equal(dirtyResult.success, false)
  assert.match(dirtyResult.error, /dọn bàn/i)

  const wrongAreaResult = validateAssignedTables({
    assignedTableIds: ['SC-01'],
    tables: sampleTables,
    guestCount: 4,
    preferredArea: 'PHONG_VIP',
    bookingId: 99,
  })

  assert.equal(wrongAreaResult.success, false)
  assert.match(wrongAreaResult.error, /không khớp khu vực/i)
})

test('canManuallyTransitionBooking only allows valid transitions and blocks check-in without tables', () => {
  const confirmedBooking = {
    status: 'DA_XAC_NHAN',
    assignedTableIds: ['VIP-01'],
  }
  const unassignedBooking = {
    status: 'DA_XAC_NHAN',
    assignedTableIds: [],
  }

  assert.equal(canManuallyTransitionBooking(confirmedBooking, 'DA_CHECK_IN'), true)
  assert.equal(canManuallyTransitionBooking(confirmedBooking, 'DA_HOAN_THANH'), false)
  assert.equal(canManuallyTransitionBooking(unassignedBooking, 'DA_CHECK_IN'), false)
})
