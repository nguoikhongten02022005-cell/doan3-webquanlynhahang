import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { MENU_DISHES_CHANGED_EVENT, getMenuDishes } from '../services/menuService'

export const useMenuDishes = () => {
  const [dishes, setDishes] = useState(() => getMenuDishes())

  const reloadDishes = useCallback(() => {
    setDishes(getMenuDishes())
  }, [])

  useEffect(() => {
    const handleStorage = (event) => {
      if (!event.key || event.key === STORAGE_KEYS.MENU_DISHES) {
        reloadDishes()
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(MENU_DISHES_CHANGED_EVENT, reloadDishes)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(MENU_DISHES_CHANGED_EVENT, reloadDishes)
    }
  }, [reloadDishes])

  return {
    dishes,
    reloadDishes,
  }
}
