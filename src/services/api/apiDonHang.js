import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layDanhSachDonHangApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/orders'))
export const layDonHangCuaToiApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/orders/me'))
export const taoDonHangApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/orders', payload))
export const capNhatTrangThaiDonHangApi = async (id, status) => tachPhanHoiApi(await trinhKhachApi.patch(`/orders/${id}/status`, { status }))
