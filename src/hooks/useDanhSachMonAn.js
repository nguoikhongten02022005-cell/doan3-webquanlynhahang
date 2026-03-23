import { useCallback, useEffect, useState } from 'react'
import { DANH_SACH_MON as DANH_SACH_MON_MO_PHONG } from '../data/duLieuThucDon'
import { layDanhSachMonApi } from '../services/api/apiThucDon'
import { chuanHoaDanhSachMonThucDon } from '../services/mappers/anhXaThucDon'

const DANH_SACH_MON_DU_PHONG = chuanHoaDanhSachMonThucDon(DANH_SACH_MON_MO_PHONG)

export const useDanhSachMonAn = () => {
  const [danhSachMon, setDanhSachMon] = useState(DANH_SACH_MON_DU_PHONG)
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
      const danhSachMonDuPhong = [...DANH_SACH_MON_DU_PHONG]
      setDanhSachMon(danhSachMonDuPhong)
      setLoiTaiMon(error?.message || 'Không thể tải danh sách món ăn từ máy chủ.')
      return danhSachMonDuPhong
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
