import {
  MENU_CANONICAL_CATEGORIES,
  MENU_CATEGORY_ALIASES,
  MENU_DEFAULT_CATEGORY,
} from '../../constants/menuCategories'
import {
  MENU_DEFAULT_BADGE,
  MENU_DEFAULT_TONE,
  MENU_FALLBACK_IMAGE,
} from '../../constants/menuOptions'
import { parsePriceToNumber } from '../../utils/price'
import { formatCurrency } from '../../utils/currency'

const FALLBACK_DISH_NAME = 'Món đang cập nhật'
const FALLBACK_DISH_DESCRIPTION = 'Nhà hàng sẽ cập nhật mô tả món ăn sớm nhất.'

const normalizeText = (value) => String(value ?? '').trim()

const slugifyCategory = (value) => normalizeText(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')

const ensureCategory = (value) => {
  if (MENU_CANONICAL_CATEGORIES.includes(value)) {
    return value
  }

  return MENU_DEFAULT_CATEGORY
}

const normalizePriceValue = (rawPrice) => parsePriceToNumber(rawPrice)

const normalizeBadge = (value) => normalizeText(value) || MENU_DEFAULT_BADGE
const normalizeTone = (value) => normalizeText(value) || MENU_DEFAULT_TONE
const normalizeImage = (value) => normalizeText(value) || MENU_FALLBACK_IMAGE

export const normalizeMenuCategory = (rawCategory) => {
  const normalizedCategory = normalizeText(rawCategory)

  if (MENU_CANONICAL_CATEGORIES.includes(normalizedCategory)) {
    return normalizedCategory
  }

  return MENU_CATEGORY_ALIASES[slugifyCategory(normalizedCategory)] || MENU_DEFAULT_CATEGORY
}

export const normalizeMenuDish = (rawDish, fallbackIndex = 0) => {
  if (!rawDish || typeof rawDish !== 'object') {
    return {
      id: `fallback-${fallbackIndex}`,
      name: FALLBACK_DISH_NAME,
      description: FALLBACK_DISH_DESCRIPTION,
      price: formatCurrency(0),
      priceValue: 0,
      category: MENU_DEFAULT_CATEGORY,
      badge: MENU_DEFAULT_BADGE,
      tone: MENU_DEFAULT_TONE,
      image: MENU_FALLBACK_IMAGE,
    }
  }

  const priceValue = normalizePriceValue(rawDish.price)
  const normalizedCategory = normalizeMenuCategory(rawDish.category)
  const normalizedId = rawDish.id ?? rawDish._id ?? rawDish.slug ?? `fallback-${fallbackIndex}`

  return {
    ...rawDish,
    id: normalizedId,
    name: normalizeText(rawDish.name) || FALLBACK_DISH_NAME,
    description: normalizeText(rawDish.description) || FALLBACK_DISH_DESCRIPTION,
    price: formatCurrency(priceValue),
    priceValue,
    category: ensureCategory(normalizedCategory),
    badge: normalizeBadge(rawDish.badge),
    tone: normalizeTone(rawDish.tone),
    image: normalizeImage(rawDish.image),
  }
}

export const normalizeMenuDishes = (list) => {
  if (!Array.isArray(list)) {
    return []
  }

  return list.map((dish, index) => normalizeMenuDish(dish, index))
}

export const getHomeSignatureDishes = (dishes, limit = 8) => {
  if (!Array.isArray(dishes) || dishes.length === 0) {
    return []
  }

  return [...dishes]
    .sort((firstDish, secondDish) => {
      if (firstDish.badge !== secondDish.badge) {
        if (firstDish.badge === MENU_DEFAULT_BADGE) return -1
        if (secondDish.badge === MENU_DEFAULT_BADGE) return 1
      }

      return (Number(secondDish.id) || 0) - (Number(firstDish.id) || 0)
    })
    .slice(0, limit)
}

export const mapDishFormToPayload = (formValues) => {
  const priceValue = normalizePriceValue(formValues?.price)

  return {
    name: normalizeText(formValues?.name),
    description: normalizeText(formValues?.description),
    price: formatCurrency(priceValue),
    category: normalizeMenuCategory(formValues?.category),
    badge: normalizeBadge(formValues?.badge),
    tone: normalizeTone(formValues?.tone),
    image: normalizeImage(formValues?.image),
  }
}

export const mapDishToFormValues = (dish) => ({
  name: normalizeText(dish?.name),
  description: normalizeText(dish?.description),
  price: normalizeText(dish?.price),
  category: normalizeMenuCategory(dish?.category),
  badge: normalizeText(dish?.badge) || MENU_DEFAULT_BADGE,
  tone: normalizeTone(dish?.tone),
  image: normalizeText(dish?.image),
})
