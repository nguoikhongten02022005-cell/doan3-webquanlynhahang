import { Outlet } from 'react-router-dom'

function BoCucNoiBo() {
  return (
    <div className="noi-bo-layout">
      <main className="noi-bo-layout-main">
        <Outlet />
      </main>
    </div>
  )
}

export default BoCucNoiBo
