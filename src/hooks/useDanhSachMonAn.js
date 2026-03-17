import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DANH_SACH_MON as DANH_SACH_MON_MO_PHONG } from '../data/duLieuThucDon'
import { chuanHoaDanhSachMonThucDon } from '../services/mappers/anhXaThucDon'
import { khoaQuery } from '../services/queries/khoaQuery'
import { taiDanhSachMonAn, taoTuyChonQueryDanhSachMonAn } from '../services/queries/truyVanMonAn'

const DANH_SACH_MON_DU_PHONG = chuanHoaDanhSachMonThucDon(DANH_SACH_MON_MO_PHONG)

export const useDanhSachMonAn = () => {
  const queryClient = useQueryClient()

  const truyVanDanhSachMon = useQuery({
    ...taoTuyChonQueryDanhSachMonAn(),
    placeholderData: DANH_SACH_MON_DU_PHONG,
    retry: 1,
  })

  const taiLaiDanhSachMon = useCallback(async () => {
    try {
      const ketQua = await queryClient.fetchQuery({
        queryKey: khoaQuery.danhSachMonAn(),
        queryFn: taiDanhSachMonAn,
      })

      return ketQua
    } catch {
      await queryClient.invalidateQueries({ queryKey: khoaQuery.danhSachMonAn() })
      return [...DANH_SACH_MON_DU_PHONG]
    }
  }, [queryClient])

  const danhSachMon = truyVanDanhSachMon.data ?? DANH_SACH_MON_DU_PHONG
  const thongDiepLoi = truyVanDanhSachMon.error?.message || ''

  return {
    dishes: danhSachMon,
    danhSachMon,
    loading: truyVanDanhSachMon.isLoading,
    dangTai: truyVanDanhSachMon.isLoading,
    error: thongDiepLoi,
    loiTaiMon: thongDiepLoi,
    reloadDishes: taiLaiDanhSachMon,
    taiLaiDanhSachMon,
  }
}
