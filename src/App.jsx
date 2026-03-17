import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './theme/nen-va-trang-chu.css'
import './theme/xac-thuc-va-gio-hang.css'
import './theme/thanh-toan-va-thuc-don.css'
import './theme/gioi-thieu-va-ho-so.css'
import './theme/dat-ban.css'
import './theme/noi-bo.css'
import './theme/modal-va-tien-ich.css'
import TuyenDuongBaoVe from './components/TuyenDuongBaoVe'
import BoCucNoiBo from './layouts/BoCucNoiBo'
import BoCucChinh from './layouts/BoCucChinh'
import {
  taiBangDieuKhienNoiBoPage,
  taiDangKyPage,
  taiDangNhapNoiBoPage,
  taiDangNhapPage,
  taiDatBanPage,
  taiGioHangPage,
  taiGioiThieuPage,
  taiHoSoPage,
  taiThanhToanPage,
  taiThucDonPage,
  taiTrangChuPage,
} from './services/prefetch/taiTuyenTrang'

const GioiThieuPage = lazy(taiGioiThieuPage)
const DatBanPage = lazy(taiDatBanPage)
const GioHangPage = lazy(taiGioHangPage)
const ThanhToanPage = lazy(taiThanhToanPage)
const TrangChuPage = lazy(taiTrangChuPage)
const BangDieuKhienNoiBoPage = lazy(taiBangDieuKhienNoiBoPage)
const DangNhapNoiBoPage = lazy(taiDangNhapNoiBoPage)
const DangNhapPage = lazy(taiDangNhapPage)
const ThucDonPage = lazy(taiThucDonPage)
const HoSoPage = lazy(taiHoSoPage)
const DangKyPage = lazy(taiDangKyPage)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BoCucChinh />}>
          <Route path="/" element={<TrangChuPage />} />
          <Route path="/thuc-don" element={<ThucDonPage />} />
          <Route path="/dat-ban" element={<DatBanPage />} />
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
