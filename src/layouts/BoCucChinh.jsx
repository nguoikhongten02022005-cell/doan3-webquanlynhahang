import { Outlet } from 'react-router-dom'
import DauTrang from '../components/DauTrang'
import ChanTrang from '../components/ChanTrang'

function BoCucChinh() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <DauTrang />
      <main id="main-content">
        <Outlet />
      </main>
      <ChanTrang />
    </>
  )
}

export default BoCucChinh
