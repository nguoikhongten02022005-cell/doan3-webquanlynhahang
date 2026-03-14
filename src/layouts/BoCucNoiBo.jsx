import { Outlet } from 'react-router-dom'

function BoCucNoiBo() {
  return (
    <div className="internal-layout">
      <main className="internal-layout-main">
        <Outlet />
      </main>
    </div>
  )
}

export default BoCucNoiBo
