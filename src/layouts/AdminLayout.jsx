import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import { useXacThuc } from '../hooks/useXacThuc'
import { useAdminData } from '../features/admin/useAdminData'

function AdminLayout() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { nguoiDungHienTai, laAdmin, dangXuat } = useXacThuc()
  const adminData = useAdminData()
  const { badges } = adminData

  const handleLogout = async () => {
    await dangXuat()
    navigate('/admin/dang-nhap', { replace: true })
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="admin-shell">
      <div
        className={`admin-shell__overlay ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <AdminSidebar
        laAdmin={laAdmin}
        badges={badges}
        nguoiDungHienTai={nguoiDungHienTai}
        onLogout={handleLogout}
        onNavigate={closeMobileMenu}
        isMobileOpen={mobileMenuOpen}
      />

      <div className="admin-shell__content">
        <main className="admin-shell__main" id="main-content">
          <Outlet context={adminData} />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
