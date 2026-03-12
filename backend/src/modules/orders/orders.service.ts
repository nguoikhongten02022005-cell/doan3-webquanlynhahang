import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'

export const listOrders = () => prisma.order.findMany({
  include: { items: true },
  orderBy: { id: 'desc' },
})

export const listMyOrders = (userEmail: string) => prisma.order.findMany({
  where: {
    userEmail: String(userEmail || '').trim().toLowerCase(),
  },
  include: { items: true },
  orderBy: { id: 'desc' },
})

export const createOrder = async (payload: {
  items: Array<{
    id?: number
    name: string
    price: number
    quantity: number
    selectedSize: string
    selectedToppings: string[]
    specialNote: string
    variantKey: string
  }>
  subtotal: number
  serviceFee: number
  discountAmount: number
  voucherCode: string
  total: number
  status: string
  customer: {
    fullName: string
    phone: string
    email: string
    address: string
  }
  userEmail: string
  note: string
  tableNumber: string
  paymentMethod: string
}) => {
  const normalizedUserEmail = payload.userEmail.trim().toLowerCase()
  const user = normalizedUserEmail
    ? await prisma.user.findFirst({ where: { email: normalizedUserEmail } })
    : null

  return prisma.order.create({
    data: {
      subtotal: payload.subtotal,
      serviceFee: payload.serviceFee,
      discountAmount: payload.discountAmount,
      voucherCode: payload.voucherCode,
      total: payload.total,
      status: payload.status,
      note: payload.note,
      tableNumber: payload.tableNumber,
      paymentMethod: payload.paymentMethod,
      userEmail: normalizedUserEmail,
      customerFullName: payload.customer.fullName,
      customerPhone: payload.customer.phone,
      customerEmail: payload.customer.email.trim().toLowerCase(),
      customerAddress: payload.customer.address,
      customerSnapshot: payload.customer,
      userId: user?.id,
      items: {
        create: payload.items.map((item) => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedToppings: item.selectedToppings,
          specialNote: item.specialNote,
          variantKey: item.variantKey,
          itemSnapshot: item,
        })),
      },
    },
    include: { items: true },
  })
}

export const updateOrderStatus = async (id: number, status: string) => {
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })

  if (!order) {
    throw new HttpError(404, 'Không tìm thấy đơn hàng.')
  }

  return prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  })
}
