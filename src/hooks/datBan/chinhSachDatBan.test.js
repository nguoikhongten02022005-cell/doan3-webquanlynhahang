import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO,
  coTheChuyenTrangThaiDatBanThuCong,
  kiemTraBanDaGan,
} from './chinhSachDatBan.js'

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

test('CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO chi cho phep trang thai khoi tao da cau hinh', () => {
  assert.equal(CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO.has('CHO_XAC_NHAN'), true)
  assert.equal(CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO.has('DA_XAC_NHAN'), true)
  assert.equal(CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO.has('CAN_GOI_LAI'), true)
  assert.equal(CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO.has('DA_CHECK_IN'), false)
  assert.equal(CAC_TRANG_THAI_TAO_DAT_BAN_NOI_BO.has('DA_HOAN_THANH'), false)
})

test('kiemTraBanDaGan chap nhan khu vuc khop va du suc chua tong hop', () => {
  const ketQua = kiemTraBanDaGan({
    assignedTableIds: ['VIP-01'],
    tables: sampleTables,
    soLuongKhach: 4,
    preferredArea: 'PHONG_VIP',
    bookingId: 99,
  })

  assert.deepEqual(ketQua, { success: true })
})

test('kiemTraBanDaGan tu choi ban dang ban hoac sai khu vuc', () => {
  const dirtyResult = kiemTraBanDaGan({
    assignedTableIds: ['VIP-02'],
    tables: sampleTables,
    soLuongKhach: 2,
    preferredArea: 'PHONG_VIP',
    bookingId: 99,
  })

  assert.equal(dirtyResult.success, false)
  assert.match(dirtyResult.error, /dọn bàn/i)

  const wrongAreaResult = kiemTraBanDaGan({
    assignedTableIds: ['SC-01'],
    tables: sampleTables,
    soLuongKhach: 4,
    preferredArea: 'PHONG_VIP',
    bookingId: 99,
  })

  assert.equal(wrongAreaResult.success, false)
  assert.match(wrongAreaResult.error, /không khớp khu vực/i)
})

test('coTheChuyenTrangThaiDatBanThuCong chi cho phep chuyen hop le va chan check in khi chua co ban', () => {
  const confirmedBooking = {
    status: 'DA_XAC_NHAN',
    assignedTableIds: ['VIP-01'],
  }
  const unassignedBooking = {
    status: 'DA_XAC_NHAN',
    assignedTableIds: [],
  }

  assert.equal(coTheChuyenTrangThaiDatBanThuCong(confirmedBooking, 'DA_CHECK_IN'), true)
  assert.equal(coTheChuyenTrangThaiDatBanThuCong(confirmedBooking, 'DA_HOAN_THANH'), false)
  assert.equal(coTheChuyenTrangThaiDatBanThuCong(unassignedBooking, 'DA_CHECK_IN'), false)
})
