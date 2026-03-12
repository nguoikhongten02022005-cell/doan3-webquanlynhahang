import { parsePriceToNumber } from '../utils/price'

export const MENU_DISHES_CHANGED_EVENT = 'menu:dishes-changed'
export const MENU_DISHES_CONFLICT_ERROR = 'MENU_DISHES_CONFLICT_ERROR'

export const getMenuDishes = () => []
export const saveMenuDishes = (dishes) => dishes
export const createMenuDish = (payload) => payload
export const updateMenuDish = (_id, payload) => payload
export const deleteMenuDish = () => true
export const formatPrice = (price) => `${parsePriceToNumber(price).toLocaleString('vi-VN')}đ`
