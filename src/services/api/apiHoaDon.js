import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layDanhSachHoaDonApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/hoa-don'))
export const layHoaDonTheoMaApi = async (maHoaDon) => tachPhanHoiApi(await trinhKhachApi.get(`/hoa-don/${maHoaDon}`))
export const taoHoaDonApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/hoa-don', payload))
