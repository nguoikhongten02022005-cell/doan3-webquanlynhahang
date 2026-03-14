import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const layPhieuGiamGiaTheoMaApi = async (code) => tachPhanHoiApi(await trinhKhachApi.get(`/vouchers/${encodeURIComponent(code)}`))
export const kiemTraPhieuGiamGiaApi = async (code, orderAmount = 0) => tachPhanHoiApi(await trinhKhachApi.post('/vouchers/validate', { code, orderAmount }))
