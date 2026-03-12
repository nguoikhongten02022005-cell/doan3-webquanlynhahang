import { prisma } from '../../lib/prisma.js'

export const getVoucherByCode = (code: string) => prisma.voucher.findFirst({
  where: {
    code: code.toUpperCase(),
    isActive: true,
  },
})
