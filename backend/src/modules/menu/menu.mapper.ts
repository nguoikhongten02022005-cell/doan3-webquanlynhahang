import type { MenuItem } from '@prisma/client'
import { formatPriceVnd } from '../../common/serializers.js'

export const mapMenuItem = (item: MenuItem) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: formatPriceVnd(item.price),
  category: item.category,
  badge: item.badge,
  tone: item.tone,
  image: item.image,
})
