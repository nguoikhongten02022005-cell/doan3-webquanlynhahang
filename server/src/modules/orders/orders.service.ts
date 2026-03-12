import type { AuthUser } from '../../common/auth.js'
import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'
import { taoMaDonHang } from './tao-ma-don-hang.js'
import {
  PHI_DICH_VU_MAC_DINH,
  PHUONG_THUC_THANH_TOAN_MAC_DINH,
  TRANG_THAI_DON_HANG_MAC_DINH,
  TRANG_THAI_THANH_TOAN_MAC_DINH,
} from './order-constants.js'

const getVoucherDiscount = (voucher: {
  discountType: 'FIXED' | 'PERCENTAGE'
  discountValue: { toNumber(): number }
  maxDiscountAmount: { toNumber(): number } | null
}, subtotal: number) => {
  const rawValue = voucher.discountValue.toNumber()

  if (voucher.discountType === 'FIXED') {
    return rawValue
  }

  const percentageDiscount = subtotal * (rawValue / 100)
  const maxDiscount = voucher.maxDiscountAmount?.toNumber() ?? percentageDiscount
  return Math.min(percentageDiscount, maxDiscount)
}

const chuanHoaEmail = (value?: string | null) => String(value || '').trim().toLowerCase()

const laNhanSuNoiBo = (nguoiDung?: AuthUser | null) => nguoiDung?.role === 'admin' || nguoiDung?.role === 'staff'

const laChuSoHuuDonHang = (order: { userId: number | null, userEmail: string }, nguoiDung: AuthUser) => {
  if (order.userId && order.userId === nguoiDung.id) {
    return true
  }

  return chuanHoaEmail(order.userEmail) === chuanHoaEmail(nguoiDung.email)
}

export const listOrders = () => prisma.order.findMany({
  include: { items: true },
  orderBy: { id: 'desc' },
})

export const listMyOrders = (nguoiDung: AuthUser) => prisma.order.findMany({
  where: {
    OR: [
      { userId: nguoiDung.id },
      { userEmail: chuanHoaEmail(nguoiDung.email) },
    ],
  },
  include: { items: true },
  orderBy: { id: 'desc' },
})

export const getOrderById = async (id: number, nguoiDung: AuthUser) => {
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })

  if (!order) {
    throw new HttpError(404, 'Không tìm thấy đơn hàng.')
  }

  if (!laNhanSuNoiBo(nguoiDung) && !laChuSoHuuDonHang(order, nguoiDung)) {
    throw new HttpError(403, 'Bạn không có quyền truy cập đơn hàng này.')
  }

  return order
}

export const createOrder = async (payload: {
  items: Array<{
    menuItemId?: number
    quantity: number
    selectedSize: string
    selectedToppings: string[]
    specialNote: string
    variantKey: string
  }>
  voucherCode: string
  customer: {
    fullName: string
    phone: string
    email: string
    address: string
  }
  userEmail: string
  note: string
  tableNumber: string
  paymentMethod: 'TIEN_MAT' | 'CHUYEN_KHOAN' | 'THE'
}) => {
  const userEmailDaChuanHoa = chuanHoaEmail(payload.userEmail)
  const emailKhachHangDaChuanHoa = chuanHoaEmail(payload.customer.email)

  return prisma.$transaction(async (tx) => {
    const nguoiDung = userEmailDaChuanHoa
      ? await tx.user.findFirst({ where: { email: userEmailDaChuanHoa } })
      : null

    const menuItemIds = payload.items
      .map((item) => item.menuItemId)
      .filter((value): value is number => Number.isInteger(value))

    const menuItems = menuItemIds.length
      ? await tx.menuItem.findMany({ where: { id: { in: menuItemIds } } })
      : []

    const menuItemLookup = new Map(menuItems.map((item) => [item.id, item]))

    if (menuItems.length !== menuItemIds.length) {
      throw new HttpError(400, 'Có món không tồn tại hoặc đã bị thay đổi.')
    }

    const unavailableItem = payload.items.find((item) => {
      if (!item.menuItemId) {
        return true
      }

      const menuItem = menuItemLookup.get(item.menuItemId)
      return !menuItem || !menuItem.isAvailable
    })

    if (unavailableItem) {
      throw new HttpError(400, 'Có món hiện không còn phục vụ hoặc không hợp lệ.')
    }

    const itemsSubtotal = payload.items.reduce((sum, item) => {
      const menuItem = menuItemLookup.get(item.menuItemId!)
      return sum + (menuItem!.price.toNumber() * item.quantity)
    }, 0)

    let voucher = null
    let discountAmount = 0

    if (payload.voucherCode.trim()) {
      voucher = await tx.voucher.findFirst({
        where: {
          code: payload.voucherCode.trim().toUpperCase(),
          isActive: true,
          OR: [
            { startsAt: null },
            { startsAt: { lte: new Date() } },
          ],
          AND: [
            {
              OR: [
                { endsAt: null },
                { endsAt: { gte: new Date() } },
              ],
            },
          ],
        },
      })

      if (!voucher) {
        throw new HttpError(400, 'Mã giảm giá không hợp lệ.')
      }

      if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
        throw new HttpError(400, 'Mã giảm giá đã hết lượt sử dụng.')
      }

      if (itemsSubtotal < voucher.minOrderAmount.toNumber()) {
        throw new HttpError(400, 'Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã giảm giá.')
      }

      discountAmount = Math.min(getVoucherDiscount(voucher, itemsSubtotal), itemsSubtotal)
    }

    const serviceFee = PHI_DICH_VU_MAC_DINH
    const total = Math.max(itemsSubtotal + serviceFee - discountAmount, 0)

    const order = await tx.order.create({
      data: {
        maDonHang: taoMaDonHang(),
        subtotal: itemsSubtotal,
        serviceFee,
        discountAmount,
        voucherCode: voucher?.code ?? '',
        total,
        status: TRANG_THAI_DON_HANG_MAC_DINH,
        paymentStatus: TRANG_THAI_THANH_TOAN_MAC_DINH,
        note: payload.note,
        tableNumber: payload.tableNumber,
        paymentMethod: payload.paymentMethod ?? PHUONG_THUC_THANH_TOAN_MAC_DINH,
        userEmail: userEmailDaChuanHoa,
        customerFullName: payload.customer.fullName,
        customerPhone: payload.customer.phone,
        customerEmail: emailKhachHangDaChuanHoa,
        customerAddress: payload.customer.address,
        customerSnapshot: {
          ...payload.customer,
          email: emailKhachHangDaChuanHoa,
        },
        userId: nguoiDung?.id,
        items: {
          create: payload.items.map((item) => {
            const menuItem = menuItemLookup.get(item.menuItemId!)
            const unitPrice = menuItem!.price.toNumber()
            return {
              menuItemId: menuItem!.id,
              name: menuItem!.name,
              price: unitPrice,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedToppings: item.selectedToppings,
              specialNote: item.specialNote,
              variantKey: item.variantKey,
              itemSnapshot: {
                ...item,
                menuItemId: menuItem!.id,
                price: unitPrice,
                name: menuItem!.name,
              },
            }
          }),
        },
      },
      include: { items: true },
    })

    if (voucher) {
      await tx.voucher.update({
        where: { id: voucher.id },
        data: { usedCount: { increment: 1 } },
      })
    }

    return order
  })
}

export const updateOrderStatus = async (id: number, status: 'MOI_TAO' | 'DA_XAC_NHAN' | 'DANG_CHUAN_BI' | 'DANG_PHUC_VU' | 'DA_HOAN_THANH' | 'DA_HUY') => {
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
