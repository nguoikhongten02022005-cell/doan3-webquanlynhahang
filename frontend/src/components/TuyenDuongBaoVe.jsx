import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useXacThuc } from '../hooks/useXacThuc'
import { Result, Spin } from 'antd'

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

  if (dangKhoiTaoXacThuc) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f7f5f2' }}>
        <Result
          icon={<Spin size="large" />}
          title="Đang xác thực phiên đăng nhập..."
          subTitle="Vui lòng chờ trong giây lát"
        />
      </div>
    )
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
