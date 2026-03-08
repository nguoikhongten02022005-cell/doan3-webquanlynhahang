import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MainLayout() {
  const location = useLocation()
  const isBookingPage = location.pathname === '/booking'

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer compact={isBookingPage} />
    </>
  )
}

export default MainLayout
