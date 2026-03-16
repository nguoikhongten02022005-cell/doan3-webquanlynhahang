import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

export const dangNhapApi = async (identifier, password) => tachPhanHoiApi(await trinhKhachApi.post('/auth/login', { identifier, password }))
export const dangNhapNoiBoApi = async (identifier, password) => tachPhanHoiApi(await trinhKhachApi.post('/auth/internal-login', { identifier, password }))
export const dangKyApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/auth/register', payload))
export const layThongTinToiApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/auth/me'))
export const dangXuatApi = async () => tachPhanHoiApi(await trinhKhachApi.post('/auth/logout', {}, { skipAuthRefresh: true }))
export const layDanhSachNguoiDungApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/nguoi-dung'))
