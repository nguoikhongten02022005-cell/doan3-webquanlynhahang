import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layDanhSachMonApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/thuc-don-items'))
export const taoMonApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/thuc-don-items', payload))
export const capNhatMonApi = async (id, payload) => tachPhanHoiApi(await trinhKhachApi.patch(`/thuc-don-items/${id}`, payload))
export const xoaMonApi = async (id) => tachPhanHoiApi(await trinhKhachApi.delete(`/thuc-don-items/${id}`))
