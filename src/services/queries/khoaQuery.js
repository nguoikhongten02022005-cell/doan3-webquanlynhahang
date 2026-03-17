export const khoaQuery = {
  danhSachMonAn: () => ['danh-sach-mon-an'],
  noiBo: {
    danhSachDatBan: () => ['noi-bo', 'danh-sach-dat-ban'],
    danhSachDonHang: () => ['noi-bo', 'danh-sach-don-hang'],
    danhSachTaiKhoan: () => ['noi-bo', 'danh-sach-tai-khoan'],
    danhSachBan: () => ['noi-bo', 'danh-sach-ban'],
  },
  hoSo: {
    lichSuDatBan: (idNguoiDung) => ['ho-so', 'lich-su-dat-ban', idNguoiDung || 'vang-khach'],
    lichSuDonHang: (idNguoiDung) => ['ho-so', 'lich-su-don-hang', idNguoiDung || 'vang-khach'],
  },
}
