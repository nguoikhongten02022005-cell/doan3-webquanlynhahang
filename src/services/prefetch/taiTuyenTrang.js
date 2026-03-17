export const taiTrangChuPage = () => import('../../pages/TrangChuPage')
export const taiThucDonPage = () => import('../../pages/ThucDonPage')
export const taiDatBanPage = () => import('../../pages/DatBanPage')
export const taiGioiThieuPage = () => import('../../pages/GioiThieuPage')
export const taiGioHangPage = () => import('../../pages/GioHangPage')
export const taiThanhToanPage = () => import('../../pages/ThanhToanPage')
export const taiHoSoPage = () => import('../../pages/HoSoPage')
export const taiDangNhapPage = () => import('../../pages/DangNhapPage')
export const taiDangKyPage = () => import('../../pages/DangKyPage')
export const taiDangNhapNoiBoPage = () => import('../../pages/DangNhapNoiBoPage')
export const taiBangDieuKhienNoiBoPage = () => import('../../pages/BangDieuKhienNoiBoPage')

export const prefetchTheoDuongDan = {
  '/': taiTrangChuPage,
  '/thuc-don': taiThucDonPage,
  '/dat-ban': taiDatBanPage,
  '/gioi-thieu': taiGioiThieuPage,
  '/gio-hang': taiGioHangPage,
  '/thanh-toan': taiThanhToanPage,
  '/ho-so': taiHoSoPage,
  '/dang-nhap': taiDangNhapPage,
  '/dang-ky': taiDangKyPage,
  '/noi-bo/dang-nhap': taiDangNhapNoiBoPage,
  '/noi-bo/bang-dieu-khien': taiBangDieuKhienNoiBoPage,
}

export const prefetchTrangTheoDuongDan = (duongDan) => prefetchTheoDuongDan[duongDan]?.()
