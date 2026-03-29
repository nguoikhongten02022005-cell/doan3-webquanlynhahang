import { trinhKhachApi, tachPhanHoiApi } from '../trinhKhachApi'

const chuanHoaNguoiDung = (nguoiDung) => {
  if (!nguoiDung || typeof nguoiDung !== 'object') return null
  const vaiTroGoc = nguoiDung.vaiTro || nguoiDung.VaiTro || nguoiDung.role || ''
  const vaiTro = vaiTroGoc === 'Admin' ? 'admin' : vaiTroGoc === 'NhanVien' ? 'staff' : 'customer'

  return {
    ...nguoiDung,
    id: nguoiDung.maND || nguoiDung.MaND || nguoiDung.id || null,
    maND: nguoiDung.maND || nguoiDung.MaND || '',
    maKH: nguoiDung.maKH || nguoiDung.MaKH || '',
    fullName: nguoiDung.tenND || nguoiDung.TenND || nguoiDung.fullName || '',
    username: nguoiDung.maND || nguoiDung.MaND || nguoiDung.username || '',
    email: nguoiDung.email || nguoiDung.Email || '',
    phone: nguoiDung.sdt || nguoiDung.SDT || nguoiDung.phone || '',
    role: vaiTro,
    trangThai: nguoiDung.trangThai || nguoiDung.TrangThai || '',
  }
}

export const dangNhapApi = async (email, matKhau) => tachPhanHoiApi(await trinhKhachApi.post('/auth/login', { email, matKhau }))
export const dangNhapNoiBoApi = async (email, matKhau) => tachPhanHoiApi(await trinhKhachApi.post('/auth/internal-login', { email, matKhau }))
export const dangKyApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.post('/auth/register', {
  hoTen: payload.hoTen || payload.fullName || payload.name || '',
  email: payload.email,
  soDienThoai: payload.soDienThoai || payload.phone || '',
  matKhau: payload.matKhau || payload.password,
  xacNhanMatKhau: payload.xacNhanMatKhau || payload.confirmPassword || '',
  diaChi: payload.diaChi || payload.address || '',
}))
export const layThongTinToiApi = async () => tachPhanHoiApi(await trinhKhachApi.get('/auth/me'))
export const dangXuatApi = async () => ({ duLieu: null, thongDiep: 'Dang xuat thanh cong', meta: null })
export const capNhatHoSoApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.put('/auth/profile', {
  hoTen: payload.hoTen || payload.fullName || '',
  email: payload.email || '',
  soDienThoai: payload.soDienThoai || payload.phone || '',
  diaChi: payload.diaChi || payload.address || '',
}))
export const doiMatKhauApi = async (payload) => tachPhanHoiApi(await trinhKhachApi.put('/auth/doi-mat-khau', {
  matKhauHienTai: payload.matKhauHienTai || payload.currentPassword || '',
  matKhauMoi: payload.matKhauMoi || payload.newPassword || '',
  xacNhanMatKhauMoi: payload.xacNhanMatKhauMoi || payload.confirmPassword || '',
}))
export const chuanHoaNguoiDungApi = (nguoiDung) => chuanHoaNguoiDung(nguoiDung)
export const layDanhSachNguoiDungApi = async () => {
  const phanHoi = tachPhanHoiApi(await trinhKhachApi.get('/nguoi-dung'))
  return {
    ...phanHoi,
    duLieu: Array.isArray(phanHoi.duLieu) ? phanHoi.duLieu.map(chuanHoaNguoiDung).filter(Boolean) : [],
  }
}
