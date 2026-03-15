import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layDanhSachDatBanApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/dat-bans'))
export const layLichSuDatBanApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/dat-bans/history'))
export const taoDatBanApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/dat-bans', payload))
export const taoDatBanNoiBoApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/dat-bans/internal', payload))
export const capNhatDatBanApi = async (id, payload) => tachPhanHoiApi(await trinhKhachApi.patch(`/dat-bans/${id}`, payload))
export const capNhatTrangThaiDatBanApi = async (id, status) => tachPhanHoiApi(await trinhKhachApi.patch(`/dat-bans/${id}/status`, { status }))
export const ganBanChoDatBanApi = async (id, danhSachIdBan) => tachPhanHoiApi(await trinhKhachApi.patch(`/dat-bans/${id}/assign-tables`, { danhSachIdBan }))
export const huyDatBanApi = async (id) => tachPhanHoiApi(await trinhKhachApi.patch(`/dat-bans/${id}/cancel`, {}))
