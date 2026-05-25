import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'

function TuyenDuongBaoVe({
  children,
  loginPath = '/noi-bo/dang-nhap',
  redirectUnauthorizedTo = '/',
  yeuCauQuanLy = false,
  chiCanDangNhap = false,
}) {
  const location = useLocation()
  const outletContext = useOutletContext()
  const { daDangNhap, coTheVaoNoiBo, dangKhoiTaoXacThuc, laQuanLy } = useXacThuc()

  if (dangKhoiTaoXacThuc && !daDangNhap) {
    return null
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

  if (yeuCauQuanLy && !laQuanLy) {
    return <Navigate to={redirectUnauthorizedTo} replace />
  }

  if (children) {
    return children
  }

  return <Outlet context={outletContext} />
}

export default TuyenDuongBaoVe
