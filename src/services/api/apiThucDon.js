import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layDanhSachMonApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/mon-an'))
export const taoMonApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/mon-an', payload))
export const capNhatMonApi = async (id, payload) => tachPhanHoiApi(await trinhKhachApi.patch(`/mon-an/${id}`, payload))
export const xoaMonApi = async (id) => tachPhanHoiApi(await trinhKhachApi.delete(`/mon-an/${id}`))
