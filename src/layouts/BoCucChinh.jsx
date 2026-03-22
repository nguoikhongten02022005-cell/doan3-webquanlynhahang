import { Outlet, useLocation } from 'react-router-dom'
import DauTrang from '../components/DauTrang'
import ChanTrang from '../components/ChanTrang'

function BoCucChinh() {
  const location = useLocation()
  const isDatBanPage = location.pathname === '/dat-ban'

  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <DauTrang />
      <main id="main-content">
        <Outlet />
      </main>
      <ChanTrang compact={isDatBanPage} />
    </>
  )
}

export default BoCucChinh
