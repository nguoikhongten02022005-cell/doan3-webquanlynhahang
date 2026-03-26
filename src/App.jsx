import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './styles/tong-hop-giao-dien.css'
import TuyenDuongBaoVe from './components/TuyenDuongBaoVe'
import BoCucNoiBo from './layouts/BoCucNoiBo'
import BoCucChinh from './layouts/BoCucChinh'
import AdminLayout from './layouts/AdminLayout'
import GioiThieuPage from './pages/GioiThieuPage'
import DatBanPage from './pages/DatBanPage'
import GioHangPage from './pages/GioHangPage'
import ThanhToanPage from './pages/ThanhToanPage'
import TrangChuPage from './pages/TrangChuPage'
import DangNhapNoiBoPage from './pages/DangNhapNoiBoPage'
import DangNhapPage from './pages/DangNhapPage'
import ThucDonPage from './pages/ThucDonPage'
import HoSoPage from './pages/HoSoPage'
import DangKyPage from './pages/DangKyPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminDatBanPage from './pages/admin/AdminDatBanPage'
import AdminSoDoBanPage from './pages/admin/AdminSoDoBanPage'
import AdminThucDonPage from './pages/admin/AdminThucDonPage'
import AdminDonHangPage from './pages/admin/AdminDonHangPage'
import AdminNhanVienPage from './pages/admin/AdminNhanVienPage'
import AdminThongKePage from './pages/admin/AdminThongKePage'

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

        <Route path="/admin/dang-nhap" element={<DangNhapNoiBoPage />} />
        <Route
          path="/admin"
          element={(
            <TuyenDuongBaoVe loginPath="/admin/dang-nhap">
              <AdminLayout />
            </TuyenDuongBaoVe>
          )}
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="dat-ban" element={<AdminDatBanPage />} />
          <Route path="so-do-ban" element={<AdminSoDoBanPage />} />
          <Route path="thuc-don" element={<AdminThucDonPage />} />
          <Route path="don-hang" element={<AdminDonHangPage />} />
          <Route path="thong-ke" element={<AdminThongKePage />} />
          <Route
            element={(
              <TuyenDuongBaoVe
                loginPath="/admin/dang-nhap"
                redirectUnauthorizedTo="/admin/dashboard"
                yeuCauAdmin
              />
            )}
          >
            <Route path="nhan-vien" element={<AdminNhanVienPage />} />
          </Route>
        </Route>

        <Route path="/noi-bo" element={<BoCucNoiBo />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dang-nhap" element={<Navigate to="/admin/dang-nhap" replace />} />
          <Route path="bang-dieu-khien" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        <Route path="/bang-dieu-khien-host" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
