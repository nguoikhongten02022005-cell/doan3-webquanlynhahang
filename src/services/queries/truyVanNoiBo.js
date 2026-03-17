import { layDanhSachNguoiDungApi } from '../api/apiXacThuc'
import { layDanhSachDonHangApi } from '../api/apiDonHang'
import { layDanhSachBanApi } from '../api/apiBanAn'
import { khoaQuery } from './khoaQuery'

export const taiDanhSachDatBanNoiBo = async (layDanhSachDatBanHost) => {
  const ketQua = await layDanhSachDatBanHost()
  return Array.isArray(ketQua) ? ketQua : []
}

export const taiDanhSachDonHangNoiBo = async () => {
  const ketQua = await layDanhSachDonHangApi()
  return Array.isArray(ketQua?.duLieu) ? ketQua.duLieu : []
}

export const taiDanhSachTaiKhoanNoiBo = async () => {
  const ketQua = await layDanhSachNguoiDungApi()
  return Array.isArray(ketQua?.duLieu) ? ketQua.duLieu : []
}

export const taiDanhSachBanNoiBo = async () => {
  const ketQua = await layDanhSachBanApi()
  return Array.isArray(ketQua?.duLieu) ? ketQua.duLieu : []
}

export const taoTuyChonQueryDanhSachDatBanNoiBo = (layDanhSachDatBanHost) => ({
  queryKey: khoaQuery.noiBo.danhSachDatBan(),
  queryFn: () => taiDanhSachDatBanNoiBo(layDanhSachDatBanHost),
})

export const taoTuyChonQueryDanhSachDonHangNoiBo = () => ({
  queryKey: khoaQuery.noiBo.danhSachDonHang(),
  queryFn: taiDanhSachDonHangNoiBo,
})

export const taoTuyChonQueryDanhSachTaiKhoanNoiBo = () => ({
  queryKey: khoaQuery.noiBo.danhSachTaiKhoan(),
  queryFn: taiDanhSachTaiKhoanNoiBo,
})

export const taoTuyChonQueryDanhSachBanNoiBo = () => ({
  queryKey: khoaQuery.noiBo.danhSachBan(),
  queryFn: taiDanhSachBanNoiBo,
})
