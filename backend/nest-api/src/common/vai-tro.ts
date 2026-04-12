export const chuanHoaVaiTroNoiBo = (vaiTro: string) => {
  if (vaiTro === 'Admin') return 'Admin'
  if (vaiTro === 'NhanVien') return 'NhanVien'
  return 'KhachHang'
}
