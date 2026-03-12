import { useCallback, useEffect, useState } from 'react'
import { getMenuItemsApi } from '../services/api/menuApi'

export const useMenuDishes = () => {
  const [danhSachMon, setDanhSachMon] = useState([])

  const taiLaiDanhSachMon = useCallback(async () => {
    const items = await getMenuItemsApi()
    const monAn = Array.isArray(items) ? items : []
    setDanhSachMon(monAn)
    return monAn
  }, [])

  useEffect(() => {
    taiLaiDanhSachMon()
  }, [taiLaiDanhSachMon])

  return {
    dishes: danhSachMon,
    danhSachMon,
    reloadDishes: taiLaiDanhSachMon,
    taiLaiDanhSachMon,
  }
}
