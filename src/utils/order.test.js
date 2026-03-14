import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildCreateOrderPayload,
  getInvalidOrderItems,
  getOrderStatusLabel,
  getOrderStatusTone,
  getOrderTimelineStep,
  getPaymentMethodLabel,
  isCancelledOrderStatus,
  mapCartItemToOrderItem,
  normalizeMenuItemId,
  normalizePaymentMethod,
} from './order.js'

test('mapCartItemToOrderItem maps cart item to server DTO shape without legacy fields', () => {
  const result = mapCartItemToOrderItem({
    id: '12',
    quantity: 2,
    selectedSize: 'l',
    selectedToppings: ['Trân châu', '  Kem cheese '],
    specialNote: ' ít đá ',
    variantKey: '12__L__Kem cheese|Trân châu__ít đá',
    subtotal: 999,
    total: 1234,
  })

  assert.deepEqual(result, {
    menuItemId: 12,
    quantity: 2,
    selectedSize: 'L',
    selectedToppings: ['Trân châu', 'Kem cheese'],
    specialNote: 'ít đá',
    variantKey: '12__L__Kem cheese|Trân châu__ít đá',
  })

  assert.equal('subtotal' in result, false)
  assert.equal('total' in result, false)
})

test('buildCreateOrderPayload only includes canonical fields accepted by server', () => {
  const payload = buildCreateOrderPayload({
    cartItems: [
      {
        id: 5,
        quantity: 1,
        selectedSize: 'M',
        selectedToppings: ['Bò viên'],
        specialNote: 'không hành',
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

  assert.deepEqual(payload, {
    items: [
      {
        menuItemId: 5,
        quantity: 1,
        selectedSize: 'M',
        selectedToppings: ['Bò viên'],
        specialNote: 'không hành',
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

test('order status helpers map canonical enums directly', () => {
  assert.equal(getOrderStatusLabel('MOI_TAO'), 'Mới tạo')
  assert.equal(getOrderStatusTone('DANG_CHUAN_BI'), 'warning')
  assert.equal(getOrderTimelineStep('DANG_PHUC_VU'), 4)
  assert.equal(getOrderTimelineStep('DA_HUY'), 0)
  assert.equal(isCancelledOrderStatus('DA_HUY'), true)
  assert.equal(isCancelledOrderStatus('DA_HOAN_THANH'), false)
})

test('payment method helpers normalize canonical values', () => {
  const payload = buildCreateOrderPayload({
    cartItems: [],
    voucherCode: '',
    customer: {},
    note: '',
    tableNumber: '',
    paymentMethod: 'banking',
  })

  assert.equal(payload.paymentMethod, 'CHUYEN_KHOAN')
  assert.equal(normalizePaymentMethod('card'), 'THE')
  assert.equal(getPaymentMethodLabel('THE'), 'Thẻ')
})

test('order helper flags invalid cart items before submit', () => {
  assert.equal(normalizeMenuItemId('12'), 12)
  assert.equal(normalizeMenuItemId('abc'), undefined)

  const invalidItems = getInvalidOrderItems([
    { id: 1, quantity: 1 },
    { id: 'abc', quantity: 2 },
    { menuItemId: null, quantity: 1 },
  ])

  assert.equal(invalidItems.length, 2)
  assert.deepEqual(invalidItems[0], { id: 'abc', quantity: 2 })
  assert.deepEqual(invalidItems[1], { menuItemId: null, quantity: 1 })
})
