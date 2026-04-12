import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layThucDonTheoBanApi = async (maBan) => tachPhanHoiApi(await trinhKhachApi.get(`/ban/${maBan}/thuc-don`))
export const guiOrderTaiBanApi = async (maBan, danhSachMon) => tachPhanHoiApi(await trinhKhachApi.post(`/ban/${maBan}/order`, { danhSachMon }))
export const layOrderDangMoTaiBanApi = async (maBan) => tachPhanHoiApi(await trinhKhachApi.get(`/ban/${maBan}/order`))
export const guiYeuCauThanhToanTaiBanApi = async (maBan) => tachPhanHoiApi(await trinhKhachApi.post(`/ban/${maBan}/yeu-cau-thanh-toan`, {}))
export const xacNhanThanhToanTaiBanApi = async (maBan) => tachPhanHoiApi(await trinhKhachApi.post(`/ban/${maBan}/xac-nhan-thanh-toan`, {}))
