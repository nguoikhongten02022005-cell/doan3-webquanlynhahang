import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  dichThongDiepLoiVoucher,
  getVoucherLoaiMaLabel,
  getVoucherNguonLabel,
  getVoucherTrangThaiBadgeClass,
  getVoucherTrangThaiLabel,
  parseNgayVoucher,
  normalizeVoucherTrangThai,
  normalizeVoucherLoaiMa,
  normalizeVoucherNguon,
  xacDinhTrangThaiVoucher,
} from './voucherTrangThai.js'

const CAC_TRANG_THAI = [
  ['ACTIVE', 'ACTIVE', 'Hoạt động', 'tone-success'],
  ['UPCOMING', 'UPCOMING', 'Chưa hiệu lực', 'tone-warning'],
  ['EXPIRED', 'EXPIRED', 'Hết hạn', 'tone-danger'],
  ['USED_UP', 'USED_UP', 'Hết lượt', 'tone-warning'],
  ['USED', 'USED', 'Đã dùng', 'tone-neutral'],
  ['INACTIVE', 'INACTIVE', 'Tạm tắt', 'tone-neutral'],
  ['DISABLED', 'DISABLED', 'Tạm tắt', 'tone-neutral'],
  ['unknown', 'UNKNOWN', 'Không xác định', 'tone-neutral'],
]

const CAC_LOAI_MA = [
  ['PUBLIC', 'PUBLIC', 'Công khai'],
  ['CUSTOMER', 'CUSTOMER', 'Riêng khách'],
  ['LOYALTY', 'LOYALTY', 'Đổi điểm'],
  ['VIP', 'VIP', 'Thành viên VIP'],
  ['BIRTHDAY', 'BIRTHDAY', 'Sinh nhật'],
  ['Công khai', 'PUBLIC', 'Công khai'],
  ['Đổi điểm', 'LOYALTY', 'Đổi điểm'],
  ['unknown', 'UNKNOWN', 'Không xác định'],
]

const CAC_NGUON = [
  ['DOI_DIEM_TICH_LUY', 'DOI_DIEM_TICH_LUY', 'Đổi điểm tích lũy'],
  ['SEED', 'SEED', 'Dữ liệu mẫu'],
  ['ADMIN', 'ADMIN', 'Tạo thủ công'],
  ['SYSTEM', 'SYSTEM', 'Hệ thống'],
  ['IMPORT', 'IMPORT', 'Nhập dữ liệu'],
  ['NOI_BO', 'ADMIN', 'Tạo thủ công'],
]

CAC_TRANG_THAI.forEach(([ten, maTrangThai, nhanTrangThai, badgeClass]) => {
  test(`voucher ${ten} map sang ${nhanTrangThai}`, () => {
    assert.equal(normalizeVoucherTrangThai(ten), maTrangThai)
    assert.equal(getVoucherTrangThaiLabel(ten), nhanTrangThai)
    assert.equal(getVoucherTrangThaiBadgeClass(ten), badgeClass)
  })
})

CAC_LOAI_MA.forEach(([ten, maLoaiMa, nhanLoaiMa]) => {
  test(`voucher loai ma ${ten} map sang ${nhanLoaiMa}`, () => {
    assert.equal(normalizeVoucherLoaiMa(ten), maLoaiMa)
    assert.equal(getVoucherLoaiMaLabel(ten), nhanLoaiMa)
  })
})

CAC_NGUON.forEach(([ten, maNguon, nhanNguon]) => {
  test(`voucher nguon ${ten} map sang ${nhanNguon}`, () => {
    assert.equal(normalizeVoucherNguon(ten), maNguon)
    assert.equal(getVoucherNguonLabel(ten), nhanNguon)
  })
})

test('voucher null va undefined map sang Khong xac dinh', () => {
  assert.equal(normalizeVoucherTrangThai(null), 'UNKNOWN')
  assert.equal(normalizeVoucherTrangThai(undefined), 'UNKNOWN')
  assert.equal(getVoucherTrangThaiLabel(null), 'Không xác định')
  assert.equal(getVoucherTrangThaiLabel(undefined), 'Không xác định')
  assert.equal(getVoucherTrangThaiBadgeClass(null), 'tone-neutral')
  assert.equal(normalizeVoucherLoaiMa(null), 'UNKNOWN')
  assert.equal(normalizeVoucherLoaiMa(undefined), 'UNKNOWN')
  assert.equal(getVoucherLoaiMaLabel(null), 'Không xác định')
  assert.equal(getVoucherLoaiMaLabel(undefined), 'Không xác định')
  assert.equal(normalizeVoucherNguon(null), 'UNKNOWN')
  assert.equal(normalizeVoucherNguon(undefined), 'UNKNOWN')
  assert.equal(getVoucherNguonLabel(null), '--')
  assert.equal(getVoucherNguonLabel(undefined), '--')
})

test('voucher nguon rong hoac khong xac dinh xu ly dung', () => {
  assert.equal(normalizeVoucherNguon(''), 'UNKNOWN')
  assert.equal(normalizeVoucherNguon('--'), 'UNKNOWN')
  assert.equal(getVoucherNguonLabel(''), '--')
  assert.equal(getVoucherNguonLabel('--'), '--')
  assert.equal(normalizeVoucherNguon('unknown'), 'UNKNOWN')
  assert.equal(getVoucherNguonLabel('unknown'), 'Không xác định')
})

test('voucher object uu tien label backend va runtimeStatus', () => {
  assert.equal(
    normalizeVoucherTrangThai({ runtimeStatus: 'Disabled' }),
    'DISABLED',
  )
  assert.equal(
    getVoucherTrangThaiLabel({
      trangThaiRuntime: 'UPCOMING',
      trangThaiHienThi: 'Chưa hiệu lực',
    }),
    'Chưa hiệu lực',
  )
  assert.equal(
    getVoucherTrangThaiLabel({
      runtimeStatus: 'USED',
      label: 'Used',
    }),
    'Đã dùng',
  )
})

test('voucher loai ma object uu tien label backend', () => {
  assert.equal(
    normalizeVoucherLoaiMa({ loaiMa: 'vip' }),
    'VIP',
  )
  assert.equal(
    getVoucherLoaiMaLabel({
      loaiMaHienThi: 'Đổi điểm',
    }),
    'Đổi điểm',
  )
})

test('voucher status error dich sang tieng Viet', () => {
  assert.equal(
    dichThongDiepLoiVoucher(new Error('Voucher status is EXPIRED')),
    'Mã giảm giá đã hết hạn.',
  )
  assert.equal(
    dichThongDiepLoiVoucher('Voucher status is UPCOMING'),
    'Mã giảm giá chưa có hiệu lực.',
  )
})

test('voucher future chuyen sang UPCOMING', () => {
  const ketQua = xacDinhTrangThaiVoucher(
    {
      ngayBatDau: '2026-05-31',
      ngayKetThuc: '2026-06-30',
      trangThai: 'Active',
    },
    new Date('2026-05-25T09:00:00+07:00'),
  )

  assert.equal(ketQua.maTrangThai, 'UPCOMING')
  assert.equal(ketQua.nhanTrangThai, 'Chưa hiệu lực')
  assert.equal(ketQua.trangThaiHienThi, 'Chưa hiệu lực')
  assert.equal(ketQua.coTheApDung, false)
})

test('voucher het han chuyen sang EXPIRED', () => {
  const ketQua = xacDinhTrangThaiVoucher(
    {
      ngayBatDau: '2026-05-01',
      ngayKetThuc: '2026-05-24',
      trangThai: 'Active',
    },
    new Date('2026-05-25T09:00:00+07:00'),
  )

  assert.equal(ketQua.maTrangThai, 'EXPIRED')
  assert.equal(ketQua.nhanTrangThai, 'Hết hạn')
  assert.equal(ketQua.trangThaiHienThi, 'Hết hạn')
  assert.equal(ketQua.coTheApDung, false)
})

test('voucher het luot chuyen sang USED_UP', () => {
  const ketQua = xacDinhTrangThaiVoucher(
    {
      ngayBatDau: '2026-05-01',
      ngayKetThuc: '2026-06-30',
      soLanToiDa: 1,
      soLanDaDung: 1,
      trangThai: 'Active',
    },
    new Date('2026-05-25T09:00:00+07:00'),
  )

  assert.equal(ketQua.maTrangThai, 'USED_UP')
  assert.equal(ketQua.nhanTrangThai, 'Hết lượt')
  assert.equal(ketQua.trangThaiHienThi, 'Hết lượt')
  assert.equal(ketQua.coTheApDung, false)
})

test('voucher inactive chuyen sang INACTIVE', () => {
  const ketQua = xacDinhTrangThaiVoucher(
    {
      ngayBatDau: '2026-05-01',
      ngayKetThuc: '2026-06-30',
      trangThai: 'Inactive',
    },
    new Date('2026-05-25T09:00:00+07:00'),
  )

  assert.equal(ketQua.maTrangThai, 'INACTIVE')
  assert.equal(ketQua.nhanTrangThai, 'Tạm tắt')
  assert.equal(ketQua.trangThaiHienThi, 'Tạm tắt')
  assert.equal(ketQua.coTheApDung, false)
})

test('ngay ket thuc dung den cuoi ngay Asia/Ho_Chi_Minh', () => {
  const ngayKetThuc = parseNgayVoucher('2026-06-23', true)
  assert.equal(ngayKetThuc.toISOString(), '2026-06-23T16:59:59.999Z')

  const ketQua = xacDinhTrangThaiVoucher(
    {
      ngayBatDau: '2026-06-01',
      ngayKetThuc: '2026-06-23',
      trangThai: 'Active',
    },
    new Date('2026-06-23T22:00:00+07:00'),
  )

  assert.equal(ketQua.maTrangThai, 'ACTIVE')
  assert.equal(ketQua.coTheApDung, true)
})
