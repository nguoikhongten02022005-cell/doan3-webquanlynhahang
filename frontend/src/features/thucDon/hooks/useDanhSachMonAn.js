import { useCallback, useEffect, useState } from 'react'
import { layDanhSachMonApi } from '../../../services/api/apiThucDon'
import { chuanHoaDanhSachMonThucDon } from '../../../services/mappers/anhXaThucDon'

export const useDanhSachMonAn = () => {
  const [danhSachMon, setDanhSachMon] = useState([])
  const [daTaiLanDau, setDaTaiLanDau] = useState(false)
  const [loiTaiMon, setLoiTaiMon] = useState('')

  const taiLaiDanhSachMon = useCallback(async () => {
    try {
      const { duLieu } = await layDanhSachMonApi()
      const monAn = chuanHoaDanhSachMonThucDon(duLieu)
      setDanhSachMon(monAn)
      setLoiTaiMon('')
      return monAn
    } catch (error) {
      setDanhSachMon([])
      setLoiTaiMon(error?.message || 'Không thể tải danh sách món ăn từ máy chủ.')
      return []
    } finally {
      setDaTaiLanDau(true)
    }
  }, [])

  useEffect(() => {
    taiLaiDanhSachMon()
  }, [taiLaiDanhSachMon])

  return {
    dishes: danhSachMon,
    danhSachMon,
    daTaiLanDau,
    error: loiTaiMon,
    loiTaiMon,
    reloadDishes: taiLaiDanhSachMon,
    taiLaiDanhSachMon,
  }
}
