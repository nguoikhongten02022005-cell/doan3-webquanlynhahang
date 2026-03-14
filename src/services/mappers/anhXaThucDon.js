import {
  CAC_DANH_MUC_CHUAN_THUC_DON,
  BI_DANH_DANH_MUC_THUC_DON,
  DANH_MUC_MAC_DINH_THUC_DON,
} from '../../constants/danhMucThucDon'
import {
  NHAN_MAC_DINH_THUC_DON,
  SAC_DO_MAC_DINH_THUC_DON,
  ANH_DU_PHONG_THUC_DON,
} from '../../constants/tuyChonThucDon'
import { phanTichGiaThanhSo } from '../../utils/giaTien'
import { dinhDangTienTe } from '../../utils/tienTe'

const FALLBACK_DISH_NAME = 'Món đang cập nhật'
const FALLBACK_DISH_DESCRIPTION = 'Nhà hàng sẽ cập nhật mô tả món ăn sớm nhất.'

const normalizeText = (value) => String(value ?? '').trim()

const slugifyCategory = (value) => normalizeText(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '')

const ensureCategory = (value) => {
  if (CAC_DANH_MUC_CHUAN_THUC_DON.includes(value)) {
    return value
  }

  return DANH_MUC_MAC_DINH_THUC_DON
}

const normalizePriceValue = (rawPrice) => phanTichGiaThanhSo(rawPrice)

const normalizeBadge = (value) => normalizeText(value) || NHAN_MAC_DINH_THUC_DON
const normalizeTone = (value) => normalizeText(value) || SAC_DO_MAC_DINH_THUC_DON
const normalizeImage = (value) => normalizeText(value) || ANH_DU_PHONG_THUC_DON

export const normalizeMenuCategory = (rawCategory) => {
  const normalizedCategory = normalizeText(rawCategory)

  if (CAC_DANH_MUC_CHUAN_THUC_DON.includes(normalizedCategory)) {
    return normalizedCategory
  }

  return BI_DANH_DANH_MUC_THUC_DON[slugifyCategory(normalizedCategory)] || DANH_MUC_MAC_DINH_THUC_DON
}

export const normalizeMenuDish = (rawDish, fallbackIndex = 0) => {
  if (!rawDish || typeof rawDish !== 'object') {
    return {
      id: `fallback-${fallbackIndex}`,
      name: FALLBACK_DISH_NAME,
      description: FALLBACK_DISH_DESCRIPTION,
      price: dinhDangTienTe(0),
      priceValue: 0,
      category: DANH_MUC_MAC_DINH_THUC_DON,
      badge: NHAN_MAC_DINH_THUC_DON,
      tone: SAC_DO_MAC_DINH_THUC_DON,
      image: ANH_DU_PHONG_THUC_DON,
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
    price: dinhDangTienTe(priceValue),
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
        if (firstDish.badge === NHAN_MAC_DINH_THUC_DON) return -1
        if (secondDish.badge === NHAN_MAC_DINH_THUC_DON) return 1
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
    price: dinhDangTienTe(priceValue),
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
  badge: normalizeText(dish?.badge) || NHAN_MAC_DINH_THUC_DON,
  tone: normalizeTone(dish?.tone),
  image: normalizeText(dish?.image),
})
