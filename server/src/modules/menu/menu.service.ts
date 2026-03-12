import { prisma } from '../../lib/prisma.js'
import { HttpError } from '../../common/http-error.js'

const parsePriceToNumber = (value: string | number) => {
  if (typeof value === 'number') {
    return value
  }

  const normalized = String(value).replace(/[^\d]/g, '')
  return Number(normalized) || 0
}

const taoSlug = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const taoSlugKhongTrung = async (name: string, idLoaiTru?: number) => {
  const slugGoc = taoSlug(name)
  let slug = slugGoc || 'mon-an'
  let dem = 1

  while (true) {
    const tonTai = await prisma.menuItem.findFirst({
      where: {
        slug,
        ...(idLoaiTru ? { id: { not: idLoaiTru } } : {}),
      },
    })

    if (!tonTai) {
      return slug
    }

    dem += 1
    slug = `${slugGoc || 'mon-an'}-${dem}`
  }
}

export const listMenuItems = () => prisma.menuItem.findMany({ orderBy: { id: 'asc' } })

export const getMenuItemById = async (id: number) => {
  const item = await prisma.menuItem.findUnique({ where: { id } })

  if (!item) {
    throw new HttpError(404, 'Không tìm thấy món ăn.')
  }

  return item
}

export const createMenuItem = async (payload: {
  name: string
  description: string
  price: string | number
  category: string
  badge: string
  tone: string
  image: string
  isAvailable: boolean
}) => prisma.menuItem.create({
  data: {
    name: payload.name,
    slug: await taoSlugKhongTrung(payload.name),
    description: payload.description,
    price: parsePriceToNumber(payload.price),
    category: payload.category,
    badge: payload.badge,
    tone: payload.tone,
    image: payload.image,
    isAvailable: payload.isAvailable,
  },
})

export const updateMenuItem = async (id: number, payload: Partial<{
  name: string
  description: string
  price: string | number
  category: string
  badge: string
  tone: string
  image: string
  isAvailable: boolean
}>) => {
  const item = await prisma.menuItem.findUnique({ where: { id } })

  if (!item) {
    throw new HttpError(404, 'Không tìm thấy món ăn.')
  }

  return prisma.menuItem.update({
    where: { id },
    data: {
      ...(payload.name !== undefined ? { name: payload.name, slug: await taoSlugKhongTrung(payload.name, id) } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.price !== undefined ? { price: parsePriceToNumber(payload.price) } : {}),
      ...(payload.category !== undefined ? { category: payload.category } : {}),
      ...(payload.badge !== undefined ? { badge: payload.badge } : {}),
      ...(payload.tone !== undefined ? { tone: payload.tone } : {}),
      ...(payload.image !== undefined ? { image: payload.image } : {}),
      ...(payload.isAvailable !== undefined ? { isAvailable: payload.isAvailable } : {}),
    },
  })
}

export const deleteMenuItem = async (id: number) => {
  const item = await prisma.menuItem.findUnique({ where: { id } })

  if (!item) {
    throw new HttpError(404, 'Không tìm thấy món ăn.')
  }

  await prisma.menuItem.delete({ where: { id } })
}
