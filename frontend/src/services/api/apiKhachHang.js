import { trinhKhachApi, coSuDungMayChu } from '../trinhKhachApi'

const BASE = '/khach-hang'

async function goiAPI(hienThi) {
  return trinhKhachApi.get(BASE + hienThi)
}

export async function layDanhSachKhachHang({
  tuKhoa = '',
  phanLoai = 'tat-ca',
  sapXep = 'ngay-tao',
  thuTu = 'desc',
  trang = 1,
  soLuong = 10,
} = {}) {
  if (!coSuDungMayChu()) {
    return { data: [], pagination: { tong: 0 } }
  }

  const params = new URLSearchParams()
  if (tuKhoa) params.append('tuKhoa', tuKhoa)
  if (phanLoai && phanLoai !== 'tat-ca') params.append('phanLoai', phanLoai)
  if (sapXep) params.append('sapXep', sapXep)
  if (thuTu) params.append('thuTu', thuTu)
  params.append('trang', String(trang))
  params.append('soLuong', String(soLuong))
  return trinhKhachApi.get(`${BASE}?${params.toString()}`)
}

export async function layChiTietKhachHang(maKH) {
  if (!coSuDungMayChu()) {
    return { data: null }
  }
  return trinhKhachApi.get(`${BASE}/${maKH}`)
}

export async function taoKhachHang(duLieu) {
  return trinhKhachApi.post(BASE, duLieu)
}

export async function capNhatKhachHang(maKH, duLieu) {
  return trinhKhachApi.put(`${BASE}/${maKH}`, duLieu)
}

export async function xoaKhachHang(maKH) {
  return trinhKhachApi.delete(`${BASE}/${maKH}`)
}

export async function capNhatDiemKhachHang(maKH, { soDiem, moTa }) {
  if (!coSuDungMayChu()) {
    return { data: null }
  }
  return trinhKhachApi.patch(`${BASE}/${maKH}/diem`, { soDiem, moTa })
}

export async function layLichSuKhachHang(maKH) {
  if (!coSuDungMayChu()) {
    return { data: { datBan: [], donHang: [] } }
  }
  return trinhKhachApi.get(`${BASE}/${maKH}/lich-su`)
}