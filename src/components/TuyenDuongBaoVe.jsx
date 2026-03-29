import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'

function TuyenDuongBaoVe({
  children,
  loginPath = '/noi-bo/dang-nhap',
  redirectUnauthorizedTo = '/',
  yeuCauAdmin = false,
  chiCanDangNhap = false,
}) {
  const location = useLocation()
  const outletContext = useOutletContext()
  const { daDangNhap, coTheVaoNoiBo, dangKhoiTaoXacThuc, laAdmin } = useXacThuc()

  if (dangKhoiTaoXacThuc) {
    return <div className="dat-ban-empty">Đang xác thực phiên đăng nhập...</div>
  }

  if (!daDangNhap) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />
  }

  if (chiCanDangNhap) {
    if (children) {
      return children
    }

    return <Outlet context={outletContext} />
  }

  if (!coTheVaoNoiBo) {
    return <Navigate to={redirectUnauthorizedTo} replace />
  }

  if (yeuCauAdmin && !laAdmin) {
    return <Navigate to={redirectUnauthorizedTo} replace />
  }

  if (children) {
    return children
  }

  return <Outlet context={outletContext} />
}

export default TuyenDuongBaoVe
