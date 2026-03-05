import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function MainLayout() {
  return (
    <>
      <Header cartCount={3} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
