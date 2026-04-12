import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import './styles/tong-hop-giao-dien.css'
import TuyenDuongBaoVe from './components/TuyenDuongBaoVe'
import BoCucChinh from './layouts/BoCucChinh'
import NoiBoLayout from './layouts/NoiBoLayout'
import GioiThieuPage from './pages/GioiThieuPage'
import DatBanPage from './pages/DatBanPage'
import GioHangPage from './pages/GioHangPage'
import ThanhToanPage from './pages/ThanhToanPage'
import TrangChuPage from './pages/TrangChuPage'
import DangNhapNoiBoPage from './pages/DangNhapNoiBoPage'
import DangNhapPage from './pages/DangNhapPage'
import ThucDonPage from './pages/ThucDonPage'
import MangVePage from './pages/MangVePage'
import MangVeThucDonPage from './pages/MangVeThucDonPage'
import MangVeGioHangPage from './pages/MangVeGioHangPage'
import MangVeThanhToanPage from './pages/MangVeThanhToanPage'
import MangVeTheoDoiDonPage from './pages/MangVeTheoDoiDonPage'
import BanGoiMonPage from './pages/BanGoiMonPage'
import HoSoPage from './pages/HoSoPage'
import DangKyPage from './pages/DangKyPage'
import DanhGiaPage from './pages/DanhGiaPage'
import NoiBoDashboardPage from './pages/noiBo/NoiBoDashboardPage'
import NoiBoDatBanPage from './pages/noiBo/NoiBoDatBanPage'
import NoiBoDanhGiaPage from './pages/noiBo/NoiBoDanhGiaPage'
import NoiBoDonMangVePage from './pages/noiBo/NoiBoDonMangVePage'
import NoiBoQuanLyBanPage from './pages/noiBo/NoiBoQuanLyBanPage'
import NoiBoSoDoBanPage from './pages/noiBo/NoiBoSoDoBanPage'
import NoiBoThucDonPage from './pages/noiBo/NoiBoThucDonPage'
import NoiBoDonHangPage from './pages/noiBo/NoiBoDonHangPage'
import NoiBoNhanVienPage from './pages/noiBo/NoiBoNhanVienPage'
import NoiBoThongKePage from './pages/noiBo/NoiBoThongKePage'

function ChuyenHuongTuDuongDanCu() {
  const location = useLocation()
  const duongDanNoiBo = location.pathname.replace(/^\/admin/, '/noi-bo') || '/noi-bo/dashboard'
  return <Navigate to={duongDanNoiBo} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BoCucChinh />}>
          <Route path="/dat-ban" element={<DatBanPage />} />
          <Route path="/" element={<TrangChuPage />} />
          <Route path="/thuc-don" element={<ThucDonPage />} />
          <Route path="/gioi-thieu" element={<GioiThieuPage />} />
          <Route path="/gio-hang" element={<GioHangPage />} />
          <Route path="/thanh-toan" element={<ThanhToanPage />} />
          <Route path="/ho-so" element={<HoSoPage />} />
          <Route path="/profile" element={<Navigate to="/ho-so" replace />} />
          <Route path="/danh-gia" element={<DanhGiaPage />} />
          <Route path="/dang-nhap" element={<DangNhapPage />} />
          <Route path="/dang-ky" element={<DangKyPage />} />
          <Route path="/mang-ve" element={<MangVePage />} />
          <Route path="/ban/:maBan" element={<BanGoiMonPage />} />
          <Route path="/ban/:maBan/goi-mon" element={<BanGoiMonPage />} />
          <Route path="/mang-ve/thuc-don" element={<MangVeThucDonPage />} />
          <Route element={<TuyenDuongBaoVe loginPath="/dang-nhap" chiCanDangNhap />}>
            <Route path="/mang-ve/gio-hang" element={<MangVeGioHangPage />} />
            <Route path="/mang-ve/thanh-toan" element={<MangVeThanhToanPage />} />
            <Route path="/mang-ve/don-hang/:id" element={<MangVeTheoDoiDonPage />} />
          </Route>
        </Route>

        <Route path="/noi-bo/dang-nhap" element={<DangNhapNoiBoPage />} />
        <Route
          path="/noi-bo"
          element={(
            <TuyenDuongBaoVe loginPath="/noi-bo/dang-nhap">
              <NoiBoLayout />
            </TuyenDuongBaoVe>
          )}
        >
          <Route index element={<Navigate to="/noi-bo/dashboard" replace />} />
          <Route path="bang-dieu-khien" element={<Navigate to="/noi-bo/dashboard" replace />} />
          <Route path="dashboard" element={<NoiBoDashboardPage />} />
          <Route path="dat-ban" element={<NoiBoDatBanPage />} />
          <Route path="danh-gia" element={<NoiBoDanhGiaPage />} />
          <Route path="don-mang-ve" element={<NoiBoDonMangVePage />} />
          <Route path="so-do-ban" element={<NoiBoSoDoBanPage />} />
          <Route path="don-hang" element={<NoiBoDonHangPage />} />
          <Route
            element={(
              <TuyenDuongBaoVe
                loginPath="/noi-bo/dang-nhap"
                redirectUnauthorizedTo="/noi-bo/dashboard"
                yeuCauQuanLy
              />
            )}
          >
            <Route path="quan-ly-ban" element={<NoiBoQuanLyBanPage />} />
            <Route path="thuc-don" element={<NoiBoThucDonPage />} />
            <Route path="thong-ke" element={<NoiBoThongKePage />} />
            <Route path="nhan-vien" element={<NoiBoNhanVienPage />} />
          </Route>
        </Route>

        <Route path="/admin/dang-nhap" element={<Navigate to="/noi-bo/dang-nhap" replace />} />
        <Route path="/admin" element={<Navigate to="/noi-bo/dashboard" replace />} />
        <Route path="/admin/*" element={<ChuyenHuongTuDuongDanCu />} />
        <Route path="/bang-dieu-khien-host" element={<Navigate to="/noi-bo/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
