const chuanHoaGiaTriTien = (value) => {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

export const dinhDangTienTe = (value) => `${chuanHoaGiaTriTien(value).toLocaleString('vi-VN')}₫`

export const dinhDangTienTeVietNam = (value) => `${chuanHoaGiaTriTien(value).toLocaleString('vi-VN')}đ`
