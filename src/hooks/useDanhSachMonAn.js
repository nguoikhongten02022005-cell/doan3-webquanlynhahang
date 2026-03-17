import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DANH_SACH_MON_DU_PHONG } from '../data/duLieuThucDon'
import { chuanHoaDanhSachMonThucDon } from '../services/mappers/anhXaThucDon'
import { khoaQuery } from '../services/queries/khoaQuery'
import { taiDanhSachMonAn, taoTuyChonQueryDanhSachMonAn } from '../services/queries/truyVanMonAn'

const DANH_SACH_MON_MO_PHONG_DA_CHUAN_HOA = chuanHoaDanhSachMonThucDon(DANH_SACH_MON_DU_PHONG)

export const useDanhSachMonAn = () => {
  const queryClient = useQueryClient()

  const truyVanDanhSachMon = useQuery({
    ...taoTuyChonQueryDanhSachMonAn(),
    placeholderData: DANH_SACH_MON_MO_PHONG_DA_CHUAN_HOA,
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
      return [...DANH_SACH_MON_MO_PHONG_DA_CHUAN_HOA]
    }
  }, [queryClient])

  const danhSachMon = truyVanDanhSachMon.data ?? DANH_SACH_MON_MO_PHONG_DA_CHUAN_HOA
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
