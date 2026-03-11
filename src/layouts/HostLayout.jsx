import { Outlet } from 'react-router-dom'

function HostLayout() {
  return (
    <div className="host-shell">
      <header className="host-layout-header">
        <div className="container host-layout-bar">
          <div className="host-layout-brand">
            <span className="host-layout-mark">NV</span>
            <div>
              <p className="host-layout-kicker">Internal operations</p>
              <h1>Nguyên Vị · Host Console</h1>
            </div>
          </div>
          <div className="host-layout-meta">
            <span className="host-layout-chip">Lễ tân / Host</span>
            <p>Theo dõi booking website và xử lý xác nhận nhanh.</p>
          </div>
        </div>
      </header>

      <main className="host-layout-main">
        <Outlet />
      </main>
    </div>
  )
}

export default HostLayout
