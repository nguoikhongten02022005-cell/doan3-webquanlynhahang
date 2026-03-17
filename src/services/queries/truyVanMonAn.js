import { layDanhSachMonApi } from '../api/apiThucDon'
import { chuanHoaDanhSachMonThucDon } from '../mappers/anhXaThucDon'
import { khoaQuery } from './khoaQuery'

export const taiDanhSachMonAn = async () => {
  const { duLieu } = await layDanhSachMonApi()
  return chuanHoaDanhSachMonThucDon(duLieu)
}

export const taoTuyChonQueryDanhSachMonAn = () => ({
  queryKey: khoaQuery.danhSachMonAn(),
  queryFn: taiDanhSachMonAn,
})
