import { STORAGE_KEYS } from '../constants/storageKeys'
import { MENU_CATEGORIES, MENU_DISHES } from '../data/menuData'
import { parsePriceToNumber } from '../utils/price'
import { getStorageItem, getStorageJSON, setStorageItem, setStorageJSON } from './storageService'

export const MENU_DISHES_CHANGED_EVENT = 'menu:dishes-changed'
export const MENU_DISHES_CONFLICT_ERROR = 'MENU_DISHES_CONFLICT_ERROR'

const DEFAULT_BADGE = 'Mới'
const DEFAULT_TONE = 'tone-amber'
const VALID_CATEGORIES = MENU_CATEGORIES.filter((category) => category !== 'Tất cả')
const VALID_CATEGORY_SET = new Set(VALID_CATEGORIES)

const formatPrice = (price) => `${parsePriceToNumber(price).toLocaleString('vi-VN')}đ`

const normalizeMenuDish = (dish, fallbackId = null) => {
  if (!dish || typeof dish !== 'object') {
    return null
  }

  const normalizedId = Number.parseInt(dish.id ?? fallbackId, 10)
  const normalizedName = String(dish.name ?? '').trim()
  const normalizedDescription = String(dish.description ?? '').trim()
  const normalizedCategory = String(dish.category ?? '').trim()
  const normalizedPriceValue = parsePriceToNumber(dish.price)

  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    return null
  }

  if (!normalizedName || !normalizedDescription || !VALID_CATEGORY_SET.has(normalizedCategory) || normalizedPriceValue <= 0) {
    return null
  }

  return {
    id: normalizedId,
    name: normalizedName,
    description: normalizedDescription,
    price: formatPrice(dish.price),
    category: normalizedCategory,
    badge: String(dish.badge ?? DEFAULT_BADGE).trim() || DEFAULT_BADGE,
    tone: String(dish.tone ?? DEFAULT_TONE).trim() || DEFAULT_TONE,
    image: String(dish.image ?? '').trim(),
  }
}

const normalizeMenuDishes = (dishes) => {
  if (!Array.isArray(dishes)) {
    return null
  }

  const seenIds = new Set()

  return dishes
    .map((dish, index) => normalizeMenuDish(dish, index + 1))
    .filter((dish) => {
      if (!dish || seenIds.has(dish.id)) {
        return false
      }

      seenIds.add(dish.id)
      return true
    })
    .sort((firstDish, secondDish) => firstDish.id - secondDish.id)
}

const DEFAULT_MENU_DISHES = normalizeMenuDishes(MENU_DISHES) ?? []

const cloneDefaultMenuDishes = () => DEFAULT_MENU_DISHES.map((dish) => ({ ...dish }))

const dispatchMenuDishesChanged = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(MENU_DISHES_CHANGED_EVENT))
}

const getStoredMenuDishes = () => {
  const storedDishes = getStorageJSON(STORAGE_KEYS.MENU_DISHES, null)

  if (storedDishes === null) {
    return cloneDefaultMenuDishes()
  }

  const normalizedStoredDishes = normalizeMenuDishes(storedDishes)

  if (!normalizedStoredDishes) {
    return cloneDefaultMenuDishes()
  }

  if (storedDishes.length > 0 && normalizedStoredDishes.length === 0) {
    return cloneDefaultMenuDishes()
  }

  return normalizedStoredDishes
}

const getNextDishId = (dishes) => dishes.reduce((maxId, dish) => Math.max(maxId, dish.id), 0) + 1

const getMenuDishesRevision = () => {
  const revision = Number.parseInt(getStorageItem(STORAGE_KEYS.MENU_DISHES_REVISION) ?? '0', 10)
  return Number.isInteger(revision) && revision >= 0 ? revision : 0
}

const bumpMenuDishesRevision = () => {
  const nextRevision = getMenuDishesRevision() + 1
  setStorageItem(STORAGE_KEYS.MENU_DISHES_REVISION, String(nextRevision))
  return nextRevision
}

const createMenuConflictError = () => {
  const error = new Error('Menu dishes changed before this action could be saved.')
  error.code = MENU_DISHES_CONFLICT_ERROR
  return error
}

export const getMenuDishes = () => getStoredMenuDishes()

export const saveMenuDishes = (dishes, options = {}) => {
  const normalizedDishes = normalizeMenuDishes(dishes)

  if (!normalizedDishes) {
    return null
  }

  const currentRevision = getMenuDishesRevision()
  const expectedRevision = options.expectedRevision ?? currentRevision

  if (expectedRevision !== currentRevision) {
    throw createMenuConflictError()
  }

  setStorageJSON(STORAGE_KEYS.MENU_DISHES, normalizedDishes)
  bumpMenuDishesRevision()
  dispatchMenuDishesChanged()
  return normalizedDishes
}

export const createMenuDish = (payload) => {
  const currentDishes = getMenuDishes()
  const revision = getMenuDishesRevision()
  const newDish = normalizeMenuDish({ ...payload, id: getNextDishId(currentDishes) })

  if (!newDish) {
    return null
  }

  saveMenuDishes([...currentDishes, newDish], { expectedRevision: revision })
  return newDish
}

export const updateMenuDish = (id, payload) => {
  const normalizedId = Number.parseInt(id, 10)
  const currentDishes = getMenuDishes()
  const revision = getMenuDishesRevision()
  const dishIndex = currentDishes.findIndex((dish) => dish.id === normalizedId)

  if (dishIndex === -1) {
    return null
  }

  const updatedDish = normalizeMenuDish({
    ...currentDishes[dishIndex],
    ...payload,
    id: currentDishes[dishIndex].id,
  })

  if (!updatedDish) {
    return null
  }

  const nextDishes = [...currentDishes]
  nextDishes[dishIndex] = updatedDish
  saveMenuDishes(nextDishes, { expectedRevision: revision })
  return updatedDish
}

export const deleteMenuDish = (id) => {
  const normalizedId = Number.parseInt(id, 10)
  const currentDishes = getMenuDishes()
  const revision = getMenuDishesRevision()
  const nextDishes = currentDishes.filter((dish) => dish.id !== normalizedId)

  if (nextDishes.length === currentDishes.length) {
    return false
  }

  saveMenuDishes(nextDishes, { expectedRevision: revision })
  return true
}
