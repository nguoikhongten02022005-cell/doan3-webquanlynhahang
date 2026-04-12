import { Outlet, useLocation } from 'react-router-dom'

function BoCucNoiBo() {
  const { pathname } = useLocation()
  const laTrangDangNhapNoiBo = pathname === '/noi-bo/dang-nhap'

  return (
    <div className="noi-bo-layout">
      <main
        id="main-content"
        className={`noi-bo-layout-main ${laTrangDangNhapNoiBo ? 'noi-bo-layout-main--auth' : ''}`.trim()}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default BoCucNoiBo
