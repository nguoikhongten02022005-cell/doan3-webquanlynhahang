import { Outlet, useLocation } from 'react-router-dom'
import DauTrang from '../components/DauTrang'
import ChanTrang from '../components/ChanTrang'

function BoCucChinh() {
  const location = useLocation()
  const isDatBanPage = location.pathname === '/dat-ban'

  return (
    <>
      <DauTrang />
      <main>
        <Outlet />
      </main>
      <ChanTrang compact={isDatBanPage} />
    </>
  )
}

export default BoCucChinh
