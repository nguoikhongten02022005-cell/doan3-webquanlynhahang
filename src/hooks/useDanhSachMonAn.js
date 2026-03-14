import { useCallback, useEffect, useState } from 'react'
import { MENU_DISHES as MENU_DISHES_MOCK } from '../data/duLieuThucDon'
import { layDanhSachMonApi } from '../services/api/apiThucDon'
import { normalizeMenuDishes } from '../services/mappers/anhXaThucDon'

const FALLBACK_DISHES = normalizeMenuDishes(MENU_DISHES_MOCK)

export const useDanhSachMonAn = () => {
  const [danhSachMon, setDanhSachMon] = useState([])
  const [dangTai, setDangTai] = useState(true)
  const [loiTaiMon, setLoiTaiMon] = useState('')

  const taiLaiDanhSachMon = useCallback(async () => {
    setDangTai(true)
    setLoiTaiMon('')

    try {
      const { duLieu } = await layDanhSachMonApi()
      const monAn = normalizeMenuDishes(duLieu)
      setDanhSachMon(monAn)
      return monAn
    } catch (error) {
      const fallbackDishes = [...FALLBACK_DISHES]
      setDanhSachMon(fallbackDishes)
      setLoiTaiMon(error?.message || 'Không thể tải danh sách món ăn từ máy chủ.')
      return fallbackDishes
    } finally {
      setDangTai(false)
    }
  }, [])

  useEffect(() => {
    taiLaiDanhSachMon()
  }, [taiLaiDanhSachMon])

  return {
    dishes: danhSachMon,
    danhSachMon,
    loading: dangTai,
    dangTai,
    error: loiTaiMon,
    loiTaiMon,
    reloadDishes: taiLaiDanhSachMon,
    taiLaiDanhSachMon,
  }
}
