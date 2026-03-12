import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma.js'
import { phanHoiThanhCong } from '../../common/phan-hoi.js'

export const getDashboardStats = async (_req: Request, res: Response) => {
  const [users, orders, bookings, tables] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.booking.groupBy({ by: ['status'], _count: { status: true } }),
    prisma.table.groupBy({ by: ['status'], _count: { status: true } }),
  ])

  const bookingStats = bookings.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.status] = item._count.status
    return accumulator
  }, {})

  const tableStats = tables.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item.status] = item._count.status
    return accumulator
  }, {})

  return phanHoiThanhCong(res, {
    message: 'Lấy số liệu dashboard thành công.',
    data: {
      users: { total: users },
      orders: { total: orders },
      bookings: {
        total: Object.values(bookingStats).reduce((sum, value) => sum + value, 0),
        pending: (bookingStats.YEU_CAU_DAT_BAN ?? 0) + (bookingStats.CHO_XAC_NHAN ?? 0) + (bookingStats.CAN_GOI_LAI ?? 0),
        confirmed: (bookingStats.DA_XAC_NHAN ?? 0) + (bookingStats.DA_GHI_NHAN ?? 0) + (bookingStats.GIU_CHO_TAM ?? 0),
        byStatus: bookingStats,
      },
      tables: {
        available: tableStats.AVAILABLE ?? 0,
        held: tableStats.HELD ?? 0,
        occupied: tableStats.OCCUPIED ?? 0,
        dirty: tableStats.DIRTY ?? 0,
        byStatus: tableStats,
      },
    },
  })
}
