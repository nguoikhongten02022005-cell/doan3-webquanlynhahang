import { useCallback, useEffect, useState } from 'react'
import { DANH_SACH_MON as DANH_SACH_MON_MO_PHONG } from '../data/duLieuThucDon'
import { layDanhSachMonApi } from '../services/api/apiThucDon'
import { chuanHoaDanhSachMonThucDon } from '../services/mappers/anhXaThucDon'

const DANH_SACH_MON_DU_PHONG = chuanHoaDanhSachMonThucDon(DANH_SACH_MON_MO_PHONG)

export const useDanhSachMonAn = () => {
  const [danhSachMon, setDanhSachMon] = useState([])
  const [dangTai, setDangTai] = useState(true)
  const [loiTaiMon, setLoiTaiMon] = useState('')

  const taiLaiDanhSachMon = useCallback(async () => {
    setDangTai(true)
    setLoiTaiMon('')

    try {
      const { duLieu } = await layDanhSachMonApi()
      const monAn = chuanHoaDanhSachMonThucDon(duLieu)
      setDanhSachMon(monAn)
      return monAn
    } catch (error) {
      const danhSachMonDuPhong = [...DANH_SACH_MON_DU_PHONG]
      setDanhSachMon(danhSachMonDuPhong)
      setLoiTaiMon(error?.message || 'Không thể tải danh sách món ăn từ máy chủ.')
      return danhSachMonDuPhong
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
