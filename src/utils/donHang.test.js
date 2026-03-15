import test from 'node:test'
import assert from 'node:assert/strict'
import {
  taoDuLieuTaoDonHang,
  layMonKhongHopLeTrongDonHang,
  layNhanTrangThaiDonHang,
  laySacThaiDonHang,
  layBuocTienTrinhDonHang,
  layNhanPhuongThucThanhToan,
  laTrangThaiDonHangDaHuy,
  anhXaMonTrongGioThanhMonDonHang,
  chuanHoaIdMonAn,
  chuanHoaPhuongThucThanhToan,
} from './donHang.js'

test('anhXaMonTrongGioThanhMonDonHang anh xa dung cau truc DTO may chu khong kem truong cu', () => {
  const ketQua = anhXaMonTrongGioThanhMonDonHang({
    id: '12',
    quantity: 2,
    kichCoDaChon: 'l',
    toppingDaChon: ['Trân châu', '  Kem cheese '],
    ghiChuRieng: ' ít đá ',
    variantKey: '12__L__Kem cheese|Trân châu__ít đá',
    subtotal: 999,
    total: 1234,
  })

  assert.deepEqual(ketQua, {
    menuItemId: 12,
    quantity: 2,
    kichCoDaChon: 'L',
    toppingDaChon: ['Trân châu', 'Kem cheese'],
    ghiChuRieng: 'ít đá',
    variantKey: '12__L__Kem cheese|Trân châu__ít đá',
  })

  assert.equal('subtotal' in ketQua, false)
  assert.equal('total' in ketQua, false)
})

test('taoDuLieuTaoDonHang chi gom truong chuan duoc may chu chap nhan', () => {
  const duLieuGuiDi = taoDuLieuTaoDonHang({
    cartItems: [
      {
        id: 5,
        quantity: 1,
        kichCoDaChon: 'M',
        toppingDaChon: ['Bò viên'],
        ghiChuRieng: 'không hành',
        variantKey: '5__M__Bò viên__không hành',
      },
    ],
    voucherCode: ' sale50 ',
    customer: {
      fullName: ' Nguyễn Văn A ',
      phone: '0901234567',
      email: ' test@example.com ',
      address: ' 123 Lê Lợi ',
    },
    note: ' giao nhanh ',
    tableNumber: ' A01 ',
    paymentMethod: 'CHUYEN_KHOAN',
  })

  assert.deepEqual(duLieuGuiDi, {
    items: [
      {
        menuItemId: 5,
        quantity: 1,
        kichCoDaChon: 'M',
        toppingDaChon: ['Bò viên'],
        ghiChuRieng: 'không hành',
        variantKey: '5__M__Bò viên__không hành',
      },
    ],
    voucherCode: 'SALE50',
    customer: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'test@example.com',
      address: '123 Lê Lợi',
    },
    note: 'giao nhanh',
    tableNumber: 'A01',
    paymentMethod: 'CHUYEN_KHOAN',
  })
})

test('cac ham trang thai don hang anh xa truc tiep enum chuan', () => {
  assert.equal(layNhanTrangThaiDonHang('MOI_TAO'), 'Mới tạo')
  assert.equal(laySacThaiDonHang('DANG_CHUAN_BI'), 'warning')
  assert.equal(layBuocTienTrinhDonHang('DANG_PHUC_VU'), 4)
  assert.equal(layBuocTienTrinhDonHang('DA_HUY'), 0)
  assert.equal(laTrangThaiDonHangDaHuy('DA_HUY'), true)
  assert.equal(laTrangThaiDonHangDaHuy('DA_HOAN_THANH'), false)
})

test('cac ham phuong thuc thanh toan chuan hoa gia tri chuan', () => {
  const duLieuGuiDi = taoDuLieuTaoDonHang({
    cartItems: [],
    voucherCode: '',
    customer: {},
    note: '',
    tableNumber: '',
    paymentMethod: 'banking',
  })

  assert.equal(duLieuGuiDi.paymentMethod, 'CHUYEN_KHOAN')
  assert.equal(chuanHoaPhuongThucThanhToan('card'), 'THE')
  assert.equal(layNhanPhuongThucThanhToan('THE'), 'Thẻ')
})

test('ham don hang danh dau mon trong gio khong hop le truoc khi gui', () => {
  assert.equal(chuanHoaIdMonAn('12'), 12)
  assert.equal(chuanHoaIdMonAn('abc'), undefined)

  const invalidItems = layMonKhongHopLeTrongDonHang([
    { id: 1, quantity: 1 },
    { id: 'abc', quantity: 2 },
    { menuItemId: null, quantity: 1 },
  ])

  assert.equal(invalidItems.length, 2)
  assert.deepEqual(invalidItems[0], { id: 'abc', quantity: 2 })
  assert.deepEqual(invalidItems[1], { menuItemId: null, quantity: 1 })
})
