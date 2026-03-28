import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layDanhSachThanhToanApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/thanh-toan'))
export const taoThanhToanApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/thanh-toan', payload))
