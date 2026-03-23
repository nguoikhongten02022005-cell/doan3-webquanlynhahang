import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './styles/tong-hop-giao-dien.css'
import TuyenDuongBaoVe from './components/TuyenDuongBaoVe'
import BoCucNoiBo from './layouts/BoCucNoiBo'
import BoCucChinh from './layouts/BoCucChinh'
import GioiThieuPage from './pages/GioiThieuPage'
import DatBanPage from './pages/DatBanPage'
import GioHangPage from './pages/GioHangPage'
import ThanhToanPage from './pages/ThanhToanPage'
import TrangChuPage from './pages/TrangChuPage'
import BangDieuKhienNoiBoPage from './pages/BangDieuKhienNoiBoPage'
import DangNhapNoiBoPage from './pages/DangNhapNoiBoPage'
import DangNhapPage from './pages/DangNhapPage'
import ThucDonPage from './pages/ThucDonPage'
import HoSoPage from './pages/HoSoPage'
import DangKyPage from './pages/DangKyPage'

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
          <Route path="/dang-nhap" element={<DangNhapPage />} />
          <Route path="/dang-ky" element={<DangKyPage />} />
        </Route>

        <Route path="/noi-bo" element={<BoCucNoiBo />}>
          <Route index element={<Navigate to="/noi-bo/bang-dieu-khien" replace />} />
          <Route path="dang-nhap" element={<DangNhapNoiBoPage />} />
          <Route
            path="bang-dieu-khien"
            element={(
              <TuyenDuongBaoVe>
                <BangDieuKhienNoiBoPage />
              </TuyenDuongBaoVe>
            )}
          />
        </Route>

        <Route path="/bang-dieu-khien-host" element={<Navigate to="/noi-bo/bang-dieu-khien" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
