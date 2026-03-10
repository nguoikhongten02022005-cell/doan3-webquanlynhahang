import test from 'node:test'
import assert from 'node:assert/strict'

const createLocalStorageMock = (seed = {}) => {
  const store = new Map(Object.entries(seed))

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      store.set(key, String(value))
    },
    removeItem(key) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null
    },
    get length() {
      return store.size
    },
  }
}

const installWindowMock = (seed = {}) => {
  const localStorage = createLocalStorageMock(seed)
  const events = []

  global.window = {
    localStorage,
    dispatchEvent(event) {
      events.push(event)
      return true
    },
  }

  global.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type
      this.detail = init.detail
    }
  }

  return { localStorage, events }
}

test('normalizeBookings keeps booking status as source of truth even when queue status is stale', async () => {
  installWindowMock({
    restaurant_reception_queue: JSON.stringify([
      { bookingCode: 'DB-100001', status: 'CAN_GOI_LAI' },
    ]),
  })

  const { normalizeBookings } = await import('./bookingRepository.js')

  const result = normalizeBookings([
    {
      id: 100001,
      bookingCode: 'DB-100001',
      guests: '2',
      date: '2026-03-11',
      time: '18:00',
      seatingArea: 'KHONG_UU_TIEN',
      status: 'DA_CHECK_IN',
    },
  ])

  assert.equal(result[0].status, 'DA_CHECK_IN')
})

test('syncBookingsToQueue persists updated booking status to bookings and queue', async () => {
  const { events } = installWindowMock({
    restaurant_reception_queue: JSON.stringify([
      {
        bookingCode: 'DB-100002',
        status: 'CAN_GOI_LAI',
        assignedTableIds: [],
      },
    ]),
  })

  const { syncBookingsToQueue, BOOKING_DATA_CHANGED_EVENT } = await import('./bookingRepository.js')

  const bookings = [
    {
      id: 100002,
      bookingCode: 'DB-100002',
      guests: '2',
      date: '2026-03-11',
      time: '18:30',
      seatingArea: 'KHONG_UU_TIEN',
      notes: '',
      name: 'Smoke Test',
      phone: '0901234567',
      email: 'staff@nguyenvi.local',
      status: 'DA_CHECK_IN',
      source: 'web',
      createdAt: '2026-03-10T12:00:00.000Z',
      updatedAt: '2026-03-10T12:30:00.000Z',
      userEmail: 'staff@nguyenvi.local',
      occasion: '',
      confirmationChannel: ['SMS'],
      internalNote: '',
      assignedTableIds: ['SANH_CHINH_01'],
      checkedInAt: '2026-03-10T12:30:00.000Z',
      seatedAt: '',
      completedAt: '',
      cancelledAt: '',
      noShowAt: '',
      createdBy: '',
    },
  ]

  const tables = [
    {
      id: 'SANH_CHINH_01',
      code: 'SC-01',
      name: 'Sảnh chính 01',
      areaId: 'SANH_CHINH',
      capacity: 2,
      status: 'OCCUPIED',
      activeBookingId: 100002,
      activeBookingCode: 'DB-100002',
      occupiedAt: '2026-03-10T12:30:00.000Z',
      releasedAt: '',
      note: '',
      updatedAt: '2026-03-10T12:30:00.000Z',
    },
  ]

  const result = syncBookingsToQueue(bookings, tables)
  const persistedBookings = JSON.parse(window.localStorage.getItem('restaurant_bookings') || '[]')
  const persistedQueue = JSON.parse(window.localStorage.getItem('restaurant_reception_queue') || '[]')

  assert.equal(result[0].status, 'DA_CHECK_IN')
  assert.equal(persistedBookings[0].status, 'DA_CHECK_IN')
  assert.equal(persistedQueue[0].status, 'DA_CHECK_IN')
  assert.deepEqual(persistedQueue[0].assignedTableIds, ['SANH_CHINH_01'])
  assert.equal(events.at(-1)?.type, BOOKING_DATA_CHANGED_EVENT)
})
