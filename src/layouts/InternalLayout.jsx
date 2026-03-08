import { Outlet } from 'react-router-dom'

function InternalLayout() {
  return (
    <div className="internal-layout">
      <main className="internal-layout-main">
        <Outlet />
      </main>
    </div>
  )
}

export default InternalLayout
