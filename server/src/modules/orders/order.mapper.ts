import type { Order, OrderItem } from '@prisma/client'
import { decimalToNumber, toIsoString } from '../../common/serializers.js'

type OrderWithItems = Order & { items?: OrderItem[] }

const parseJsonArray = (value: unknown) => (Array.isArray(value) ? value.map((item) => String(item)) : [])

export const mapOrder = (order: OrderWithItems) => ({
  id: order.id,
  maDonHang: order.maDonHang,
  subtotal: decimalToNumber(order.subtotal),
  serviceFee: decimalToNumber(order.serviceFee),
  discountAmount: decimalToNumber(order.discountAmount),
  voucherCode: order.voucherCode,
  total: decimalToNumber(order.total),
  orderDate: toIsoString(order.orderDate),
  status: order.status,
  paymentStatus: order.paymentStatus,
  note: order.note,
  tableNumber: order.tableNumber,
  paymentMethod: order.paymentMethod,
  userEmail: order.userEmail,
  customer: {
    fullName: order.customerFullName,
    phone: order.customerPhone,
    email: order.customerEmail,
    address: order.customerAddress,
  },
  items: Array.isArray(order.items)
    ? order.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.name,
        price: decimalToNumber(item.price),
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedToppings: parseJsonArray(item.selectedToppings),
        specialNote: item.specialNote,
        variantKey: item.variantKey,
      }))
    : [],
})
