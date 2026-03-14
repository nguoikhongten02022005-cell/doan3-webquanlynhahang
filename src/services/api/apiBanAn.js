import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layDanhSachBanApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/tables'))
export const capNhatTrangThaiBanApi = async (id, status) => tachPhanHoiApi(await trinhKhachApi.patch(`/tables/${id}/status`, { status }))
