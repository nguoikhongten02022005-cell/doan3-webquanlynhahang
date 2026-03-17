import { layDonHangCuaToiApi } from '../api/apiDonHang'
import { khoaQuery } from './khoaQuery'

export const taiLichSuDatBanHoSo = async (layLichSuDatBan) => {
  const ketQua = await layLichSuDatBan()
  return Array.isArray(ketQua) ? ketQua : []
}

export const taiLichSuDonHangHoSo = async () => {
  const ketQua = await layDonHangCuaToiApi()
  return Array.isArray(ketQua?.duLieu) ? ketQua.duLieu : []
}

export const taoTuyChonQueryLichSuDatBanHoSo = (idNguoiDung, layLichSuDatBan, coNguoiDungHienTai) => ({
  queryKey: khoaQuery.hoSo.lichSuDatBan(idNguoiDung),
  enabled: Boolean(coNguoiDungHienTai),
  queryFn: () => taiLichSuDatBanHoSo(layLichSuDatBan),
})

export const taoTuyChonQueryLichSuDonHangHoSo = (idNguoiDung, coNguoiDungHienTai) => ({
  queryKey: khoaQuery.hoSo.lichSuDonHang(idNguoiDung),
  enabled: Boolean(coNguoiDungHienTai),
  queryFn: taiLichSuDonHangHoSo,
})
