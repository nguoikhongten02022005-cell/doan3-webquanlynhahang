import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi';

export const layDoanhThuNgayApi = (tuNgay, denNgay) =>
  trinhKhachApi.get('/thong-ke/doanh-thu', { params: { tuNgay, denNgay } }).then(tachPhanHoiApi);

export const layMonBanChayApi = (limit = 10) =>
  trinhKhachApi.get('/thong-ke/mon-ban-chay', { params: { limit } }).then(tachPhanHoiApi);

export const layTinhTrangBanApi = () =>
  trinhKhachApi.get('/thong-ke/tinh-trang-ban').then(tachPhanHoiApi);

export const layTongQuanApi = () =>
  trinhKhachApi.get('/thong-ke/tong-quan').then(tachPhanHoiApi);

export const layDoanhThuThangApi = (nam) =>
  trinhKhachApi.get('/thong-ke/doanh-thu-thang', { params: { nam } }).then(tachPhanHoiApi);