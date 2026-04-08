const layGiaTri = (nguon, ...khoa) => {
  for (const key of khoa) {
    if (nguon?.[key] !== undefined && nguon?.[key] !== null) {
      return nguon[key]
    }
  }
  return undefined
}

export const chuanHoaMucGioHang = (nguon = {}) => ({
  maMon: String(layGiaTri(nguon, 'maMon', 'MaMon', 'menuItemId', 'id') || '').trim(),
  tenMon: String(layGiaTri(nguon, 'tenMon', 'TenMon', 'name') || '').trim(),
  donGia: Number(layGiaTri(nguon, 'donGia', 'DonGia', 'price') || 0),
  soLuong: Number(layGiaTri(nguon, 'soLuong', 'SoLuong', 'quantity') || 0),
  ghiChu: String(layGiaTri(nguon, 'ghiChu', 'GhiChu', 'note') || '').trim(),
  hinhAnh: String(layGiaTri(nguon, 'hinhAnh', 'HinhAnh', 'image', 'thumbnail') || '').trim(),
})

export const chuanHoaDanhSachMucGioHang = (danhSach = []) => Array.isArray(danhSach)
  ? danhSach.map(chuanHoaMucGioHang).filter((item) => item.maMon && item.soLuong > 0)
  : []
