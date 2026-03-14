import { Navigate, useLocation } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'

function TuyenDuongBaoVe({ children }) {
  const location = useLocation()
  const { daDangNhap, coTheVaoNoiBo, dangKhoiTaoXacThuc } = useXacThuc()

  if (dangKhoiTaoXacThuc) {
    return <div className="booking-empty">Đang xác thực phiên đăng nhập...</div>
  }

  if (!daDangNhap) {
    return <Navigate to="/noi-bo/dang-nhap" replace state={{ from: location.pathname }} />
  }

  if (!coTheVaoNoiBo) {
    return <Navigate to="/" replace />
  }

  return children
}

export default TuyenDuongBaoVe
