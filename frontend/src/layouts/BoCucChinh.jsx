import { Outlet, useLocation } from 'react-router-dom'
import DauTrang from '../components/DauTrang'
import ChanTrang from '../components/ChanTrang'

const CAC_TUYEN_XAC_THUC = new Set(['/dang-nhap', '/dang-ky'])

function BoCucChinh() {
  const { pathname } = useLocation()
  const laTrangXacThuc = CAC_TUYEN_XAC_THUC.has(pathname)

  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      {!laTrangXacThuc && <DauTrang />}
      <main id="main-content" className={laTrangXacThuc ? 'main-content-auth' : ''}>
        <Outlet />
      </main>
      {!laTrangXacThuc && <ChanTrang />}
    </>
  )
}

export default BoCucChinh
