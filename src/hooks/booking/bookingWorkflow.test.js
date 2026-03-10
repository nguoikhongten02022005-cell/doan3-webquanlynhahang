import test from 'node:test'
import assert from 'node:assert/strict'
import { canCheckInBooking, canCompleteBooking } from './bookingWorkflow.js'

test('canCheckInBooking requires assigned tables before check-in', () => {
  const result = canCheckInBooking({
    id: 1,
    status: 'DA_XAC_NHAN',
    assignedTableIds: [],
  })

  assert.equal(result.success, false)
  assert.match(result.error, /gán bàn trước khi check-in/i)
})

test('canCheckInBooking accepts active booking with assigned tables', () => {
  const result = canCheckInBooking({
    id: 1,
    status: 'DA_XAC_NHAN',
    assignedTableIds: ['VIP-01'],
  })

  assert.deepEqual(result, { success: true })
})

test('canCompleteBooking only allows completion after check-in or seating', () => {
  const beforeCheckIn = canCompleteBooking({
    id: 1,
    status: 'DA_XAC_NHAN',
    assignedTableIds: ['VIP-01'],
  })
  const afterCheckIn = canCompleteBooking({
    id: 1,
    status: 'DA_CHECK_IN',
    assignedTableIds: ['VIP-01'],
  })
  const seated = canCompleteBooking({
    id: 1,
    status: 'DA_XEP_BAN',
    assignedTableIds: ['VIP-01'],
  })

  assert.equal(beforeCheckIn.success, false)
  assert.match(beforeCheckIn.error, /chỉ có thể hoàn thành booking đã check-in hoặc đã vào bàn/i)
  assert.deepEqual(afterCheckIn, { success: true })
  assert.deepEqual(seated, { success: true })
})
