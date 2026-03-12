import { useCallback, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { getMenuItemsApi } from '../services/api/menuApi'
import { shouldUseBackend } from '../services/apiClient'
import { MENU_DISHES_CHANGED_EVENT, getMenuDishes } from '../services/menuService'

export const useMenuDishes = () => {
  const useBackend = shouldUseBackend()
  const [dishes, setDishes] = useState([])

  const reloadDishes = useCallback(async () => {
    if (useBackend) {
      const items = await getMenuItemsApi()
      setDishes(Array.isArray(items) ? items : [])
      return items
    }

    const localDishes = getMenuDishes()
    setDishes(localDishes)
    return localDishes
  }, [useBackend])

  useEffect(() => {
    reloadDishes()
  }, [reloadDishes])

  useEffect(() => {
    if (useBackend) {
      return undefined
    }

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
  }, [reloadDishes, useBackend])

  return {
    dishes,
    reloadDishes,
  }
}
